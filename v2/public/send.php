<?php
/* ===========================================================================
 * Teardown form endpoint: Resend over HTTPS.
 * ---------------------------------------------------------------------------
 * WHY NOT SMTP, AND WHY NOT mail().
 *
 * mail() was wrong because create@gravino.in is a Titan mailbox at GoDaddy,
 * so the domain's MX points away from this server and mail() would relay out
 * from a shared IP that SPF does not authorise (the record is
 * "include:secureserver.net -all", and DMARC is p=quarantine).
 *
 * Authenticated SMTP to Titan was the right answer and cannot work HERE.
 * Outbound SMTP on this host is transparently intercepted: a TLS handshake
 * completes against 192.0.2.1, an RFC 5737 documentation address with
 * nothing behind it, and presents CN=jp2.broodlepro.com. Ports 25, 465 and
 * 587 are all terminated by that appliance before leaving the box. It is a
 * network policy, not an account setting.
 *
 * The script's verify_peer=true was therefore doing its job by refusing to
 * continue. Turning it off would have sent the Titan mailbox password in
 * cleartext to the interceptor. That was never an option.
 *
 * Port 443 is clean, verified: github.com:443 presents a genuine
 * certificate. So the mail goes out over HTTPS instead.
 *
 * DELIVERABILITY. From: is a Resend-owned sender, NOT create@gravino.in.
 * Sending as gravino.in from Resend would fail SPF (-all) and be quarantined
 * by DMARC unless Resend is added to the domain's DNS. Reply-To is the
 * visitor, so replying from the inbox still answers them directly. To send
 * as create@gravino.in properly, verify the domain in Resend, add the DKIM
 * records it gives you at GoDaddy, then change `from` in the config.
 *
 * CREDENTIALS are read from the environment first, otherwise from
 * gravino-mail-config.php ONE LEVEL ABOVE public_html. Never committed.
 * ======================================================================== */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

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
        'api_key'  => $pick('GRAVINO_RESEND_KEY', 'resend_key'),
        // Resend's shared sender works with no DNS setup. Swap this for
        // create@gravino.in once the domain is verified in Resend.
        'from'     => $pick('GRAVINO_MAIL_FROM', 'from', 'Gravino Website <onboarding@resend.dev>'),
        'to'       => $pick('GRAVINO_MAIL_TO', 'to', 'create@gravino.in'),
        'selftest' => $pick('GRAVINO_SELFTEST_TOKEN', 'selftest_token'),
    ];
}

function fail(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

/**
 * One HTTPS POST to Resend. Returns [httpStatus, decodedBody, transportError].
 */
function resend_post(string $apiKey, array $payload): array {
    $ch = curl_init('https://api.resend.com/emails');
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 20,
        CURLOPT_CONNECTTIMEOUT => 10,
        // Kept ON deliberately. 443 is not intercepted on this host, and a
        // certificate failure here would mean something has changed.
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_SSL_VERIFYHOST => 2,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
            'Accept: application/json',
        ],
        CURLOPT_POSTFIELDS     => json_encode($payload, JSON_UNESCAPED_UNICODE),
    ]);
    $raw = curl_exec($ch);
    $err = $raw === false ? curl_error($ch) : '';
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return [$status, is_string($raw) ? json_decode($raw, true) : null, $err];
}

$cfg = config();

/* Self test: proves the host can reach Resend and that the key is accepted,
   without sending anything. Resend has no ping endpoint, so this posts a
   deliberately invalid payload: 401/403 means the key is wrong, while 422
   means the key was ACCEPTED and only the payload was rejected, which is
   exactly what we need to know. */
if (isset($_GET['selftest'])) {
    if ($cfg['selftest'] === '' || !hash_equals($cfg['selftest'], (string) $_GET['selftest'])) {
        http_response_code(404);
        echo json_encode(['ok' => false, 'error' => 'Not found.']);
        exit;
    }
    if ($cfg['api_key'] === '') {
        echo json_encode(['ok' => false, 'error' => 'No Resend API key configured.']);
        exit;
    }
    [$status, $body, $err] = resend_post($cfg['api_key'], ['from' => '', 'to' => [], 'subject' => '']);
    if ($err !== '') {
        http_response_code(502);
        echo json_encode(['ok' => false, 'error' => 'Could not reach api.resend.com: ' . $err]);
        exit;
    }
    $msg = 'Reached Resend. Unexpected status; see http and detail.';
    if ($status === 401 || $status === 403) {
        $msg = 'Reached Resend but the API key was rejected.';
    } elseif ($status === 422 || $status === 400) {
        $msg = 'Reached Resend and the key was accepted. Nothing was sent.';
    }
    echo json_encode([
        'ok'      => $status !== 401 && $status !== 403,
        'http'    => $status,
        'message' => $msg,
        'detail'  => $body,
    ]);
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
/* Newlines must not reach a header even through an API, because Reply-To is
   built from the visitor's own input. */
foreach ([$email, $name, $phone, $company] as $headerish) {
    if (preg_match('/[\r\n]/', $headerish)) {
        fail('Invalid characters in your details.');
    }
}

if ($cfg['api_key'] === '') {
    error_log('send.php: no Resend API key configured');
    fail('The form is not configured yet. Please email create@gravino.in directly.', 500);
}

$body = implode("\n", [
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

$safeName = str_replace(['"', '<', '>'], '', $name);

[$status, $resBody, $err] = resend_post($cfg['api_key'], [
    'from'     => $cfg['from'],
    'to'       => [$cfg['to']],
    'reply_to' => $safeName !== '' ? sprintf('%s <%s>', $safeName, $email) : $email,
    'subject'  => 'Teardown request: ' . ($company !== '' ? $company : $name),
    'text'     => $body,
]);

if ($err !== '' || $status < 200 || $status >= 300) {
    /* Detail to the log, never to the browser: it can name the account and
       echo back why the key was rejected. The visitor gets something they
       can act on instead. */
    error_log(sprintf(
        'send.php Resend failure: http=%d curl=%s body=%s',
        $status,
        $err,
        is_array($resBody) ? json_encode($resBody) : 'null'
    ));
    fail('We could not send that just now. Please email create@gravino.in directly.', 502);
}

echo json_encode(['ok' => true]);
