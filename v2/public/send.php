<?php
/* ===========================================================================
 * Project intake form endpoint: Resend over HTTPS.
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
        /* The confirmation email to the visitor. 'auto' (the default) sends
           it only once `from` is no longer Resend's shared sender: until
           gravino.in is verified in Resend, Resend delivers only to the
           account's own inbox, so a confirmation to a visitor would bounce.
           Verifying the domain and changing `from` switches it on by itself.
           'on' or 'off' overrides. */
        'confirm'  => $pick('GRAVINO_CONFIRM', 'confirm', 'auto'),
        /* Resend's endpoint. Only ever changed to point a local test run at a
           stand-in server; production leaves it alone. */
        'resend_url' => $pick('GRAVINO_RESEND_URL', 'resend_url', 'https://api.resend.com/emails'),
    ];
}

/* ---------------------------------------------------------------------------
 * RATE LIMIT. The honeypot stops naive bots; this stops a script, or one
 * impatient person, filling the inbox. Per sender address: at most 3
 * enquiries in 10 minutes and 10 in a day.
 *
 * Stored as a SHA-256 of the IP (never the IP itself), one small file per
 * address, in a folder beside the config file ABOVE public_html, so it can
 * never be fetched over HTTP. Entries older than a day are dropped as they
 * are read, and files untouched for a day are swept now and then.
 *
 * Fails open: if the folder cannot be written, the enquiry goes through and
 * the problem is logged. Losing a lead is worse than letting a spammer by.
 * ------------------------------------------------------------------------ */
function rate_limited(string $ip, string $bucket = 'gravino', int $burst = 3, int $daily = 10): bool {
    $dir = __DIR__ . '/../gravino-ratelimit';
    if (!is_dir($dir) && !@mkdir($dir, 0700) && !is_dir($dir)) {
        error_log('send.php: rate-limit folder not writable: ' . $dir);
        return false;
    }
    $file = $dir . '/' . hash('sha256', $bucket . '|' . $ip) . '.json';
    $h = @fopen($file, 'c+');
    if ($h === false) {
        error_log('send.php: rate-limit file not writable');
        return false;
    }
    flock($h, LOCK_EX);
    $now = time();
    $seen = json_decode(stream_get_contents($h) ?: '[]', true);
    $seen = array_values(array_filter(is_array($seen) ? $seen : [], static fn($t) => is_int($t) && $t > $now - 86400));
    $recent = count(array_filter($seen, static fn($t) => $t > $now - 600));
    $limited = $recent >= $burst || count($seen) >= $daily;
    if (!$limited) {
        $seen[] = $now;
    }
    ftruncate($h, 0);
    rewind($h);
    fwrite($h, json_encode($seen));
    flock($h, LOCK_UN);
    fclose($h);

    // Now and then, sweep files nobody has touched for a day.
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $f) {
            if (@filemtime($f) < $now - 86400) {
                @unlink($f);
            }
        }
    }
    return $limited;
}

/* ---------------------------------------------------------------------------
 * ENQUIRY REFERENCES, for "add a link" after sending (the client, 2026-10-08:
 * paste a link, no uploads). Each enquiry gets a random reference, returned
 * to the visitor's browser only. A link is accepted only with a reference
 * issued in the last 24 hours, at most 5 per enquiry, and the follow-up email
 * takes the name, email and subject from what WE stored, never from the
 * request, so this cannot be used to send arbitrary mail to the inbox.
 * Stored hashed, in a folder above public_html; lapsed ones are swept.
 * ------------------------------------------------------------------------ */
function ref_dir(): string {
    return __DIR__ . '/../gravino-ratelimit/refs';
}

function ref_store(array $meta): string {
    $dir = ref_dir();
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        error_log('send.php: refs folder not writable');
        return '';
    }
    $ref = bin2hex(random_bytes(16));
    $meta['created'] = time();
    $meta['links'] = 0;
    if (@file_put_contents($dir . '/' . hash('sha256', $ref) . '.json', json_encode($meta), LOCK_EX) === false) {
        error_log('send.php: ref not written');
        return '';
    }
    if (random_int(1, 50) === 1) {
        foreach (glob($dir . '/*.json') ?: [] as $f) {
            if (@filemtime($f) < time() - 86400) {
                @unlink($f);
            }
        }
    }
    return $ref;
}

/** The stored enquiry for a reference, with its link counter taken, or null. */
function ref_take(string $ref): ?array {
    if (!preg_match('/^[a-f0-9]{32}$/', $ref)) {
        return null;
    }
    $file = ref_dir() . '/' . hash('sha256', $ref) . '.json';
    $h = @fopen($file, 'r+');
    if ($h === false) {
        return null;
    }
    flock($h, LOCK_EX);
    $meta = json_decode(stream_get_contents($h) ?: '', true);
    $ok = is_array($meta) && ($meta['created'] ?? 0) > time() - 86400 && ($meta['links'] ?? 99) < 5;
    if ($ok) {
        $meta['links']++;
        ftruncate($h, 0);
        rewind($h);
        fwrite($h, json_encode($meta));
    }
    flock($h, LOCK_UN);
    fclose($h);
    return $ok ? $meta : null;
}

function fail(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

/**
 * One HTTPS POST to Resend. Returns [httpStatus, decodedBody, transportError].
 * Takes the whole config for the key and the endpoint.
 */
function resend_post(array $cfg, array $payload): array {
    $ch = curl_init($cfg['resend_url']);
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
            'Authorization: Bearer ' . $cfg['api_key'],
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
    [$status, $body, $err] = resend_post($cfg, ['from' => '', 'to' => [], 'subject' => '']);
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

/* A link added after sending: see ENQUIRY REFERENCES above. */
if ($field('followup') === '1') {
    $link = $field('link');
    if ($link === '' || mb_strlen($link) > 500 || !filter_var($link, FILTER_VALIDATE_URL)
        || !preg_match('#^https?://#i', $link) || preg_match('/[\r\n<>"]/', $link)) {
        fail('Please paste a full link, starting with https://');
    }
    if ($cfg['api_key'] === '') {
        fail('That did not reach us. Please email it to create@gravino.in.', 500);
    }
    if (rate_limited((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 'link', 5, 20)) {
        fail('That is a lot of links at once. Please email the rest to create@gravino.in.', 429);
    }
    $lead = ref_take($field('ref'));
    if ($lead === null) {
        fail('This enquiry can no longer take links here. Please email it to create@gravino.in.', 410);
    }
    [$fSubject, $fHtml, $fText] = link_email($lead, $link);
    $leadName = str_replace(['"', '<', '>'], '', (string) $lead['name']);
    [$status, $resBody, $err] = resend_post($cfg, [
        'from'     => $cfg['from'],
        'to'       => [$cfg['to']],
        'reply_to' => $leadName !== '' ? sprintf('%s <%s>', $leadName, $lead['email']) : (string) $lead['email'],
        'subject'  => $fSubject,
        'html'     => $fHtml,
        'text'     => $fText,
    ]);
    if ($err !== '' || $status < 200 || $status >= 300) {
        error_log(sprintf('send.php link failure: http=%d curl=%s', $status, $err));
        fail('That did not reach us. Please email it to create@gravino.in.', 502);
    }
    echo json_encode(['ok' => true]);
    exit;
}

$name     = $field('name');
$email    = $field('email');
$phone    = $field('phone');
$company  = $field('company');
$service  = $field('service');
$timeline = $field('timeline');
$budget   = $field('budget');
$source   = $field('source');
$details  = $field('details');

if ($name === '' || $email === '' || $phone === '') {
    fail('Please give us your name, email and phone number.');
}
if ($service === '' || $timeline === '' || $details === '') {
    fail('Please tell us the service, the timeline and a little about the project.');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fail('That email address does not look right.');
}
if (mb_strlen($name) > 120 || mb_strlen($company) > 160 || mb_strlen($details) > 4000
    || mb_strlen($service) > 80 || mb_strlen($timeline) > 80 || mb_strlen($budget) > 80 || mb_strlen($source) > 80) {
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

if (rate_limited((string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'))) {
    fail('We have already received a few enquiries from you. Please try again later, or email create@gravino.in directly.', 429);
}

/* ===========================================================================
 * THE TWO EMAILS (the client, 2026-10-08: "it is just a text. How is this an
 * actionable email?").
 *
 * The lead email to us is now a LEAD CARD: a subject that sorts in the inbox
 * list (service, budget, timeline, who), a "reply by" time worked out from
 * the one-working-day promise, and buttons that act: Reply opens a drafted
 * first response addressed to them, Call dials, WhatsApp opens a chat.
 *
 * The confirmation to the visitor says what was received, what happens next,
 * and how to add files (reply to it).
 *
 * Both are HTML with a plain-text twin. The HTML is email-safe on purpose:
 * tables, inline styles, no images, no web fonts, no CSS gradients, because
 * Outlook and Gmail strip or ignore all of those. Every value from the
 * visitor goes through h() before it touches markup.
 * ======================================================================== */

function h(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}

function first_name(string $name): string {
    $parts = preg_split('/\s+/u', trim($name)) ?: [];
    return (string) ($parts[0] ?? '');
}

/** "Under ₹2 lakh (under $2,500)" -> "Under ₹2 lakh", for the subject line. */
function short_budget(string $budget): string {
    return trim((string) preg_replace('/\s*\(.*\)\s*$/u', '', $budget));
}

/**
 * When the reply is due: one working day after it arrived, in India time.
 * Arriving at a weekend counts from Monday 10:00. Public holidays are not
 * known here; the label says "working day" and we are honest about that.
 */
function reply_by(int $ts): DateTimeImmutable {
    $tz = new DateTimeZone('Asia/Kolkata');
    $t = (new DateTimeImmutable('@' . $ts))->setTimezone($tz);
    $dow = (int) $t->format('N');
    if ($dow >= 6) {
        $t = $t->modify('next monday')->setTime(10, 0);
    }
    $t = $t->modify('+1 day');
    while ((int) $t->format('N') >= 6) {
        $t = $t->modify('+1 day');
    }
    return $t;
}

function ist(int $ts): DateTimeImmutable {
    return (new DateTimeImmutable('@' . $ts))->setTimezone(new DateTimeZone('Asia/Kolkata'));
}

/**
 * Digits for wa.me and tel:. A number given with + or 00 is used as it is.
 * A bare 10-digit number starting 6 to 9 is an Indian mobile, so +91 is
 * assumed, and the button says so. Anything else gets no WhatsApp button
 * rather than a guess that opens a stranger's chat.
 * Returns [digits for wa.me or '', true if +91 was assumed].
 */
function whatsapp_digits(string $phone): array {
    $p = trim($phone);
    $d = preg_replace('/\D+/', '', $p) ?? '';
    if (strncmp($p, '+', 1) === 0) {
        return [strlen($d) >= 8 ? $d : '', false];
    }
    if (strncmp($d, '00', 2) === 0) {
        $d = substr($d, 2);
        return [strlen($d) >= 8 ? $d : '', false];
    }
    if (strlen($d) === 10 && preg_match('/^[6-9]/', $d)) {
        return ['91' . $d, true];
    }
    if (strlen($d) === 12 && strncmp($d, '91', 2) === 0) {
        return [$d, false];
    }
    return ['', false];
}

/** A button that survives Outlook: a table cell with a background colour.
 *  Each sits in an inline-block wrapper so a row of them wraps on a phone
 *  (a row of table cells cannot, and pushed the email off-screen at 375px,
 *  measured). Outlook ignores inline-block and stacks them, which is fine. */
function email_button(string $href, string $label, string $bg, string $fg, string $border = ''): string {
    $b = $border !== '' ? $border : $bg;
    return '<div style="display:inline-block;margin:0 8px 8px 0;vertical-align:top;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td bgcolor="' . $bg . '" style="border-radius:8px;border:1px solid ' . $b . ';">'
        . '<a href="' . h($href) . '" style="display:inline-block;padding:11px 18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;line-height:18px;color:' . $fg . ';text-decoration:none;border-radius:8px;white-space:nowrap;">'
        . h($label) . '</a></td></tr></table></div>';
}

/** The shared frame: a light page, a white card, the wordmark, a footer. */
function email_frame(string $preheader, string $tag, string $inner, string $footer): string {
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>Gravino</title></head>'
        . '<body style="margin:0;padding:0;background:#f3f2f8;">'
        . '<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . h($preheader) . '</div>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f3f2f8"><tr><td align="center" style="padding:24px 12px;">'
        . '<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">'
        . '<tr><td style="padding:0 4px 12px 4px;font-family:Arial,Helvetica,sans-serif;">'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
        . '<td style="font-size:13px;font-weight:bold;letter-spacing:4px;color:#1b1838;">GRAVINO</td>'
        . '<td align="right" style="font-size:11px;letter-spacing:2px;color:#6b6790;text-transform:uppercase;">' . h($tag) . '</td>'
        . '</tr></table></td></tr>'
        . '<tr><td bgcolor="#7b3fe4" style="height:4px;line-height:4px;font-size:0;border-radius:4px 4px 0 0;">&nbsp;</td></tr>'
        . '<tr><td bgcolor="#ffffff" style="padding:28px 28px 20px 28px;border-radius:0 0 12px 12px;font-family:Arial,Helvetica,sans-serif;color:#1b1838;">'
        . $inner
        . '</td></tr>'
        . '<tr><td style="padding:16px 8px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#7a7799;">' . $footer . '</td></tr>'
        . '</table></td></tr></table></body></html>';
}

/** Label / value rows. Empty values print as "not given". */
function email_rows(array $rows): string {
    $out = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">';
    foreach ($rows as [$label, $value]) {
        $v = $value !== '' ? $value : '<span style="color:#9a97b5;">not given</span>';
        $out .= '<tr><td width="110" valign="top" style="padding:9px 12px 9px 0;border-top:1px solid #ecebf4;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#6b6790;">' . h($label) . '</td>'
            . '<td valign="top" style="padding:9px 0;border-top:1px solid #ecebf4;font-size:15px;line-height:21px;color:#1b1838;">' . $v . '</td></tr>';
    }
    return $out . '</table>';
}

function email_heading(string $text, string $top = '24px'): string {
    return '<p style="margin:' . $top . ' 0 8px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7b3fe4;font-weight:bold;">' . h($text) . '</p>';
}

/** The lead email to us. Returns [subject, html, text]. */
function lead_email(array $f, int $ts, string $ip): array {
    $first = first_name($f['name']);
    $who = $f['company'] !== '' ? $f['company'] : $f['name'];
    $due = reply_by($ts);
    $got = ist($ts);
    $dueText = $due->format('D j M, g:i a') . ' IST';
    $gotText = $got->format('D j M, g:i a') . ' IST';

    /* Short and clear (the client, 2026-10-08): what, then who. Budget,
       timeline and the reply-by time ride in the preheader, the grey preview
       line most inboxes show under the subject. */
    $subject = 'New enquiry: ' . $f['service'] . ', ' . $who;
    $preheader = implode(' · ', [
        $f['budget'] !== '' ? short_budget($f['budget']) : 'Budget not given',
        $f['timeline'],
        'Reply by ' . $dueText,
    ]);

    /* Reply: a first response already addressed, with gaps marked in [square
       brackets] to fill. One click and a quick edit, not a blank page. */
    $replySubject = 'Re: your ' . mb_strtolower($f['service']) . ' project | Gravino';
    $replyBody = implode("\n", [
        'Hi ' . ($first !== '' ? $first : 'there') . ',',
        '',
        'Thank you for telling us about ' . ($f['company'] !== '' ? $f['company'] . "'s" : 'your') . ' ' . mb_strtolower($f['service']) . ' project.',
        '',
        '[A question or two about the brief]',
        '',
        'Could we take 20 minutes to talk it through? Two times that suit us:',
        '  [Day, time]',
        '  [Day, time]',
        '',
        'Best,',
        '[Name]',
        'Gravino',
    ]);
    $replyHref = 'mailto:' . rawurlencode($f['email']) . '?subject=' . rawurlencode($replySubject) . '&body=' . rawurlencode($replyBody);

    // With the country known (given, or +91 inferred), dial the full
    // international number, so Call works from a phone outside India too.
    [$wa, $assumed91] = whatsapp_digits($f['phone']);
    $telHref = 'tel:' . ($wa !== '' ? '+' . $wa : (preg_replace('/[^\d+]/', '', $f['phone']) ?? ''));
    $waHref = $wa !== ''
        ? 'https://wa.me/' . $wa . '?text=' . rawurlencode('Hi ' . ($first !== '' ? $first : '') . ', this is Gravino, about the ' . mb_strtolower($f['service']) . ' project you sent us.')
        : '';

    $buttons = email_button($replyHref, 'Reply to ' . ($first !== '' ? $first : 'them'), '#5b3fd6', '#ffffff')
        . email_button($telHref, 'Call', '#ffffff', '#1b1838', '#cfcbe6')
        . ($waHref !== '' ? email_button($waHref, $assumed91 ? 'WhatsApp (+91 assumed)' : 'WhatsApp', '#ffffff', '#0b7a43', '#bfe3cf') : '');

    $details = nl2br(h($f['details']), false);

    $inner =
        '<p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6790;">New project enquiry</p>'
        . '<h1 style="margin:6px 0 4px 0;font-size:24px;line-height:30px;font-weight:bold;color:#1b1838;">' . h($who) . '</h1>'
        // The heading is the company when there is one, so this line names
        // the person; with no company the heading already is the person.
        . ($f['company'] !== '' ? '<p style="margin:0 0 16px 0;font-size:15px;line-height:21px;color:#3d3a5c;">' . h($f['name']) . '</p>' : '<div style="height:12px;line-height:12px;font-size:0;">&nbsp;</div>')
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px 0;"><tr>'
        . '<td bgcolor="#fff4e0" style="padding:8px 12px;border-radius:8px;border:1px solid #f4d9a6;font-size:13px;line-height:18px;color:#7a4a00;">'
        . '<b>Reply by ' . h($dueText) . '</b> &middot; received ' . h($gotText) . '</td></tr></table>'
        . '<div>' . $buttons . '</div>'
        . email_heading('The brief')
        . email_rows([
            ['Service', h($f['service'])],
            ['Timeline', h($f['timeline'])],
            ['Budget', h($f['budget'])],
            ['Found via', h($f['source'])],
        ])
        . email_heading('In their words')
        . '<div style="padding:14px 16px;background:#f7f6fb;border-left:3px solid #7b3fe4;border-radius:0 8px 8px 0;font-size:15px;line-height:22px;color:#1b1838;">' . $details . '</div>'
        . email_heading('Contact')
        . email_rows([
            ['Email', '<a href="mailto:' . h($f['email']) . '" style="color:#5b3fd6;">' . h($f['email']) . '</a>'],
            ['Phone', '<a href="' . h($telHref) . '" style="color:#5b3fd6;">' . h($f['phone']) . '</a>'],
            ['Company', h($f['company'])],
        ]);

    $footer = 'Sent from the project intake form on gravino.in. Replying to this email answers ' . h($f['name']) . ' directly.<br>'
        . 'IP ' . h($ip) . ' &middot; ' . gmdate('Y-m-d H:i:s', $ts) . ' UTC';

    $html = email_frame($preheader, 'New enquiry', $inner, $footer);

    $text = implode("\n", [
        'NEW PROJECT ENQUIRY: ' . $who,
        'Reply by ' . $dueText . ' (received ' . $gotText . ')',
        '',
        'Name:      ' . $f['name'],
        'Company:   ' . ($f['company'] !== '' ? $f['company'] : 'not given'),
        'Email:     ' . $f['email'],
        'Phone:     ' . $f['phone'],
        '',
        'Service:   ' . $f['service'],
        'Timeline:  ' . $f['timeline'],
        'Budget:    ' . ($f['budget'] !== '' ? $f['budget'] : 'not given'),
        'Found via: ' . ($f['source'] !== '' ? $f['source'] : 'not given'),
        '',
        'In their words:',
        $f['details'],
        '',
        'Act on it:',
        '  Reply:    just reply to this email (it goes to ' . $f['email'] . ')',
        '  Call:     ' . $telHref,
        $waHref !== '' ? '  WhatsApp: ' . $waHref : '  WhatsApp: no country code given, so no link',
        '',
        '---',
        'Sent from the project intake form on gravino.in',
        'IP ' . $ip . ' · ' . gmdate('Y-m-d H:i:s', $ts) . ' UTC',
    ]);

    return [$subject, $html, $text];
}

/** A link added to an enquiry after sending. Returns [subject, html, text].
 *  "Re: " + the lead's own subject, so most inboxes file it with the lead. */
function link_email(array $lead, string $link): array {
    $host = (string) (parse_url($link, PHP_URL_HOST) ?: 'link');
    $subject = 'Re: ' . (string) $lead['subject'];
    $inner =
        '<p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#6b6790;">Added to an enquiry</p>'
        . '<h1 style="margin:6px 0 4px 0;font-size:22px;line-height:28px;font-weight:bold;color:#1b1838;">' . h((string) $lead['name']) . ' sent a link</h1>'
        . '<p style="margin:0 0 18px 0;font-size:15px;line-height:21px;color:#3d3a5c;">For the enquiry: ' . h((string) $lead['subject']) . '</p>'
        . '<div>' . email_button($link, 'Open ' . $host, '#5b3fd6', '#ffffff') . '</div>'
        . '<p style="margin:8px 0 0 0;font-size:13px;line-height:19px;color:#6b6790;word-break:break-all;">' . h($link) . '</p>';
    $footer = 'Added from the success screen of the project intake form on gravino.in. Replying answers ' . h((string) $lead['name']) . ' directly.<br>'
        . 'Links open third-party sites; check the address before signing in anywhere.';
    $html = email_frame($lead['name'] . ' added a link: ' . $host, 'Link added', $inner, $footer);
    $text = implode("\n", [
        $lead['name'] . ' added a link to their enquiry:',
        $link,
        '',
        'Enquiry: ' . $lead['subject'],
        'Replying to this email answers ' . $lead['name'] . ' directly.',
    ]);
    return [$subject, $html, $text];
}

/** The confirmation to the visitor. Returns [subject, html, text]. */
function confirmation_email(array $f): array {
    $first = first_name($f['name']);
    $hi = 'Thank you, ' . ($first !== '' ? $first : 'and hello') . '.';

    $step = static fn(int $n, string $title, string $body): string =>
        '<tr><td width="34" valign="top" style="padding:0 0 14px 0;">'
        . '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="24" height="24" align="center" style="border:1px solid #cfcbe6;border-radius:12px;font-size:12px;color:#5b3fd6;">' . $n . '</td></tr></table></td>'
        . '<td valign="top" style="padding:0 0 14px 0;"><p style="margin:0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#7b3fe4;font-weight:bold;">' . h($title) . '</p>'
        . '<p style="margin:2px 0 0 0;font-size:15px;line-height:22px;color:#3d3a5c;">' . $body . '</p></td></tr>';

    $inner =
        '<h1 style="margin:0 0 8px 0;font-size:24px;line-height:30px;font-weight:bold;color:#1b1838;">' . h($hi) . '</h1>'
        . '<p style="margin:0 0 20px 0;font-size:15px;line-height:23px;color:#3d3a5c;">Your project details reached us. Here is what happens next.</p>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
        // The same three steps as the site (src/lib/next-steps.ts). Keep in step.
        . $step(1, 'We read it ourselves', 'Not a form queue. A senior member of our team reads every project that comes in.')
        . $step(2, 'A short conversation', 'Within a working day we come back with questions and a time to talk it through.')
        . $step(3, 'Then, a clear quote', 'Scope, approach and price, fixed before any work begins.')
        . '</table>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 0 0;"><tr>'
        . '<td bgcolor="#f1effe" style="padding:16px 18px;border-radius:10px;border:1px solid #ddd6fb;">'
        . '<p style="margin:0;font-size:15px;font-weight:bold;color:#1b1838;">Have a deck, brief or reference?</p>'
        . '<p style="margin:4px 0 0 0;font-size:14px;line-height:21px;color:#3d3a5c;">Reply to this email with it attached, or with a link. It joins your enquiry, so our first reply can already speak to it.</p>'
        . '</td></tr></table>'
        . email_heading('What you sent')
        . email_rows([
            ['Service', h($f['service'])],
            ['Timeline', h($f['timeline'])],
            ['Budget', h($f['budget'])],
            ['Details', nl2br(h($f['details']), false)],
        ])
        . '<div style="margin:22px 0 4px 0;">' . email_button('https://gravino.in/portfolio/', 'See our work', '#5b3fd6', '#ffffff') . '</div>';

    $footer = 'Gravino &middot; <a href="mailto:create@gravino.in" style="color:#5b3fd6;">create@gravino.in</a> &middot; <a href="https://gravino.in" style="color:#5b3fd6;">gravino.in</a><br>'
        . 'You are receiving this because you sent a project enquiry on gravino.in.';

    $html = email_frame('Your project details reached us. A reply within a working day.', 'Project received', $inner, $footer);

    $text = implode("\n", [
        'Hi ' . ($first !== '' ? $first : 'there') . ',',
        '',
        'Thank you. Your project details reached us. What happens next:',
        '',
        '  1. We read it ourselves. Not a form queue: a senior member of our',
        '     team reads every project that comes in.',
        '  2. A short conversation. Within a working day we come back with',
        '     questions and a time to talk it through.',
        '  3. Then, a clear quote. Scope, approach and price, fixed before any',
        '     work begins.',
        '',
        'Have a deck, brief or reference? Reply to this email with it attached,',
        'or with a link, and it joins your enquiry.',
        '',
        'What you sent:',
        '  Service:   ' . $f['service'],
        '  Timeline:  ' . $f['timeline'],
        '  Budget:    ' . ($f['budget'] !== '' ? $f['budget'] : 'not given'),
        '',
        'See our work: https://gravino.in/portfolio/',
        '',
        'Gravino',
        'create@gravino.in',
        'https://gravino.in',
    ]);

    return ['We have your project details | Gravino', $html, $text];
}

$now = time();
$ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$f = compact('name', 'email', 'phone', 'company', 'service', 'timeline', 'budget', 'source', 'details');

[$subject, $html, $text] = lead_email($f, $now, $ip);
$safeName = str_replace(['"', '<', '>'], '', $name);

[$status, $resBody, $err] = resend_post($cfg, [
    'from'     => $cfg['from'],
    'to'       => [$cfg['to']],
    'reply_to' => $safeName !== '' ? sprintf('%s <%s>', $safeName, $email) : $email,
    'subject'  => $subject,
    'html'     => $html,
    'text'     => $text,
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

// A reference for "add a link". Empty if it could not be stored, in which
// case the success screen falls back to the email address.
$ref = ref_store(['name' => $name, 'email' => $email, 'subject' => $subject]);

/* The enquiry has reached us. Now the visitor's confirmation, best effort:
   whatever happens to it, they have already succeeded, so a failure here is
   logged and never shown to them. Reply-To is our inbox, so a reply to the
   confirmation (with their deck attached, say) reaches the team.
   `confirmation` in the response tells the success screen whether it can
   say "reply to the email we sent you" or must offer another way. */
$confirmed = false;
$confirm = strtolower($cfg['confirm']);
$sharedSender = stripos($cfg['from'], '@resend.dev') !== false;
if ($confirm === 'on' || ($confirm === 'auto' && !$sharedSender)) {
    [$cSubject, $cHtml, $cText] = confirmation_email($f);
    [$cStatus, $cBody, $cErr] = resend_post($cfg, [
        'from'     => $cfg['from'],
        'to'       => [$email],
        'reply_to' => $cfg['to'],
        'subject'  => $cSubject,
        'html'     => $cHtml,
        'text'     => $cText,
    ]);
    $confirmed = $cErr === '' && $cStatus >= 200 && $cStatus < 300;
    if (!$confirmed) {
        error_log(sprintf(
            'send.php confirmation failure: http=%d curl=%s body=%s',
            $cStatus,
            $cErr,
            is_array($cBody) ? json_encode($cBody) : 'null'
        ));
    }
}

echo json_encode(['ok' => true, 'confirmation' => $confirmed, 'ref' => $ref]);
