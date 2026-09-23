<?php
/* ===========================================================================
 * Teardown form endpoint: authenticated SMTP to Titan.
 * ---------------------------------------------------------------------------
 * WHY NOT mail(). create@gravino.in is a GoDaddy mailbox on Titan, so the MX
 * records for this domain point at Titan and not at this cPanel account.
 * mail() would therefore relay out from a shared-hosting IP that carries no
 * SPF authorisation for gravino.in, which is how form mail ends up in spam or
 * refused outright. Sending through Titan's own SMTP with the mailbox's
 * credentials makes us the authorised sender: SPF and DKIM align and the mail
 * is exactly as deliverable as anything else sent from that account.
 *
 * WHY NOT PHPMailer. It is the usual answer and it is a good library, but it
 * would mean vendoring a few thousand lines into this repo to use maybe five
 * percent of it. The exchange below is the whole of SMTP submission: connect,
 * EHLO, AUTH, envelope, DATA, QUIT, checking the reply code at every step.
 * It is short enough to read in full, which matters more here than features,
 * because none of it can be executed until it is on the host.
 *
 * CREDENTIALS ARE NOT IN THIS FILE and must never be committed. They are read
 * from, in order:
 *   1. environment variables (cPanel, or SetEnv in .htaccess)
 *   2. a config file ONE LEVEL ABOVE public_html, so it is not web-reachable
 *      even if PHP is ever misconfigured and stops executing.
 * See mail-config.example.php and DEPLOY.md.
 *
 * SELF TEST. Because this cannot be run here, there is a check that proves
 * the host can reach Titan and that the credentials authenticate, WITHOUT
 * sending anything:
 *     https://gravino.in/send.php?selftest=YOUR_TOKEN
 * The token lives in the config. Without it the parameter does nothing, so
 * the endpoint gives away no information to anyone who guesses the path.
 * ======================================================================== */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

function config(): array {
    $file = __DIR__ . '/../gravino-mail-config.php';
    $fromFile = is_readable($file) ? (require $file) : [];
    if (!is_array($fromFile)) {
        $fromFile = [];
    }

    $pick = static function (string $env, string $key, string $default = '') use ($fromFile): string {
        $v = getenv($env);
        if (is_string($v) && $v !== '') {
            return $v;
        }
        return isset($fromFile[$key]) ? (string) $fromFile[$key] : $default;
    };

    return [
        'host'     => $pick('GRAVINO_SMTP_HOST', 'host', 'smtp.titan.email'),
        'port'     => (int) $pick('GRAVINO_SMTP_PORT', 'port', '465'),
        'user'     => $pick('GRAVINO_SMTP_USER', 'user'),
        'pass'     => $pick('GRAVINO_SMTP_PASS', 'pass'),
        'to'       => $pick('GRAVINO_MAIL_TO', 'to', 'create@gravino.in'),
        'selftest' => $pick('GRAVINO_SELFTEST_TOKEN', 'selftest_token'),
    ];
}

function fail(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

// ---------------------------------------------------------------------------
// A minimal SMTP submission client
// ---------------------------------------------------------------------------

final class Smtp {
    /** @var resource */
    private $sock;
    /** True only for port 587, where the session starts plain and upgrades. */
    private bool $startTls = false;

    public function __construct(string $host, int $port, int $timeout = 20) {
        // Port 465 is implicit TLS; 587 starts plain and upgrades with STARTTLS.
        $scheme = $port === 465 ? 'ssl://' : 'tcp://';
        $ctx = stream_context_create(['ssl' => [
            'verify_peer'       => true,
            'verify_peer_name'  => true,
            'SNI_enabled'       => true,
        ]]);
        $sock = @stream_socket_client(
            $scheme . $host . ':' . $port,
            $errno, $errstr, $timeout,
            STREAM_CLIENT_CONNECT, $ctx
        );
        if (!$sock) {
            throw new RuntimeException("Could not reach {$host}:{$port} ({$errstr})");
        }
        $this->sock = $sock;
        stream_set_timeout($this->sock, $timeout);
        $this->expect('220');
    }

    /** Reads a full multi-line reply and checks its code. */
    private function expect(string $code): string {
        $out = '';
        while (true) {
            $line = fgets($this->sock, 8192);
            if ($line === false) {
                throw new RuntimeException('SMTP connection closed while waiting for ' . $code);
            }
            $out .= $line;
            // Continuation lines look like "250-...", the final one "250 ...".
            if (strlen($line) >= 4 && $line[3] === ' ') {
                break;
            }
        }
        if (strncmp($out, $code, strlen($code)) !== 0) {
            throw new RuntimeException('SMTP expected ' . $code . ', got: ' . trim(substr($out, 0, 200)));
        }
        return $out;
    }

    private function send(string $line, string $expect): string {
        fwrite($this->sock, $line . "\r\n");
        return $this->expect($expect);
    }

    public function login(string $host, string $user, string $pass): void {
        $greeting = $this->send('EHLO ' . $host, '250');
        if ($this->portIsStartTls()) {
            $this->send('STARTTLS', '220');
            if (!stream_socket_enable_crypto($this->sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new RuntimeException('STARTTLS negotiation failed');
            }
            $greeting = $this->send('EHLO ' . $host, '250');
        }
        if (stripos($greeting, 'AUTH') === false) {
            throw new RuntimeException('Server did not advertise AUTH');
        }
        $this->send('AUTH LOGIN', '334');
        $this->send(base64_encode($user), '334');
        $this->send(base64_encode($pass), '235');
    }

    public function markStartTls(): void { $this->startTls = true; }
    private function portIsStartTls(): bool { return $this->startTls; }

    public function envelope(string $from, string $to): void {
        $this->send('MAIL FROM:<' . $from . '>', '250');
        $this->send('RCPT TO:<' . $to . '>', '250');
    }

    public function data(string $message): void {
        $this->send('DATA', '354');
        /* Dot stuffing: a line that is just "." would otherwise end the
           message early, so any leading dot is doubled. RFC 5321 s4.5.2. */
        $message = preg_replace('/^\./m', '..', $message);
        fwrite($this->sock, $message . "\r\n.\r\n");
        $this->expect('250');
    }

    public function quit(): void {
        @fwrite($this->sock, "QUIT\r\n");
        @fclose($this->sock);
    }
}

// ---------------------------------------------------------------------------
// Request handling
// ---------------------------------------------------------------------------

$cfg = config();

/* Self test: proves connectivity and credentials without sending mail. */
if (isset($_GET['selftest'])) {
    if ($cfg['selftest'] === '' || !hash_equals($cfg['selftest'], (string) $_GET['selftest'])) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Not found.']);
        exit;
    }
    try {
        $smtp = new Smtp($cfg['host'], $cfg['port']);
        if ($cfg['port'] !== 465) { $smtp->markStartTls(); }
        $smtp->login($_SERVER['SERVER_NAME'] ?? 'gravino.in', $cfg['user'], $cfg['pass']);
        $smtp->quit();
        echo json_encode([
            'ok' => true,
            'message' => 'Connected to ' . $cfg['host'] . ':' . $cfg['port'] . ' and authenticated as ' . $cfg['user'] . '. Nothing was sent.',
        ]);
    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Method not allowed.', 405);
}

$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$field = static function (string $key) use ($data): string {
    $v = $data[$key] ?? '';
    return is_string($v) ? trim($v) : '';
};

/* Honeypot: hidden from people, irresistible to bots. Answer 200 so the bot
   believes it worked and does not retry with variations. */
if ($field('website') !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

$name    = $field('name');
$email   = $field('email');
$phone   = $field('phone');
$company = $field('company');
$asset   = $field('asset');
$notes   = $field('notes');

if ($name === '' || $email === '' || $phone === '') {
    fail('Please give us your name, email and phone number.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('That email address does not look right.');
}
if (mb_strlen($name) > 120 || mb_strlen($company) > 160 || mb_strlen($notes) > 4000) {
    fail('That is longer than we can accept.');
}
/* Anything with a newline in it must never reach a header. */
foreach ([$email, $name, $phone, $company] as $headerish) {
    if (preg_match('/[\r\n]/', $headerish)) {
        fail('Invalid characters in your details.');
    }
}

if ($cfg['user'] === '' || $cfg['pass'] === '') {
    error_log('send.php: SMTP credentials are not configured');
    fail('The form is not configured yet. Please email create@gravino.in directly.', 500);
}

$body = implode("\r\n", [
    'Name:     ' . $name,
    'Email:    ' . $email,
    'Phone:    ' . $phone,
    'Company:  ' . ($company !== '' ? $company : 'not given'),
    'Review:   ' . ($asset !== '' ? $asset : 'not specified'),
    '',
    'Notes / link:',
    $notes !== '' ? $notes : 'none given',
    '',
    '---',
    'Sent from the teardown form on gravino.in',
    'IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    'Time: ' . gmdate('Y-m-d H:i:s') . ' UTC',
]);

/* RFC 2047 for anything outside ASCII, so a name with an accent in it does
   not arrive as mojibake in the subject line. */
$subjectText = 'Teardown request: ' . ($company !== '' ? $company : $name);
$subject = preg_match('/[\x80-\xFF]/', $subjectText)
    ? '=?UTF-8?B?' . base64_encode($subjectText) . '?='
    : $subjectText;

$safeName = str_replace(['"', '<', '>'], '', $name);
$domain = $_SERVER['SERVER_NAME'] ?? 'gravino.in';

/* From must be the authenticated mailbox or Titan will refuse it. Reply-To
   is the visitor, so hitting reply in the inbox answers them directly. */
$headers = [
    'Date: ' . gmdate('D, d M Y H:i:s') . ' +0000',
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $domain . '>',
    'From: Gravino Website <' . $cfg['user'] . '>',
    'To: <' . $cfg['to'] . '>',
    'Reply-To: "' . $safeName . '" <' . $email . '>',
    'Subject: ' . $subject,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'Content-Transfer-Encoding: 8bit',
    'X-Mailer: gravino-site',
];

try {
    $smtp = new Smtp($cfg['host'], $cfg['port']);
    if ($cfg['port'] !== 465) { $smtp->markStartTls(); }
    $smtp->login($domain, $cfg['user'], $cfg['pass']);
    $smtp->envelope($cfg['user'], $cfg['to']);
    $smtp->data(implode("\r\n", $headers) . "\r\n\r\n" . $body);
    $smtp->quit();
} catch (Throwable $e) {
    /* The detail goes to the server log, never to the browser: it can name
       the host and the account. The visitor gets something they can act on. */
    error_log('send.php SMTP failure: ' . $e->getMessage());
    fail('We could not send that just now. Please email create@gravino.in directly.', 502);
}

echo json_encode(['ok' => true]);
