<?php
/* ===========================================================================
 * Teardown form endpoint.
 * ---------------------------------------------------------------------------
 * The form used to build a mailto: and hand off to the visitor's mail client,
 * which was the wrong answer. It asks the person to send their own enquiry,
 * it silently does nothing on a device with no mail client configured, and
 * there is no record on our side that they ever tried.
 *
 * This sends it. The site is a static export on Apache, and cPanel hosting
 * runs PHP, so a single PHP file next to the HTML is the whole backend needed
 * for a contact form. No third-party service, no API key, no account.
 *
 * NOTE FOR LOCAL DEVELOPMENT: `next dev` does not execute PHP, so submitting
 * the form locally will fail. That is expected. It works from the moment the
 * export is on the cPanel host.
 *
 * DELIVERABILITY: From: is a mailbox on our own domain so the host's SPF
 * record covers it. Reply-To: is the visitor, so hitting reply in the inbox
 * answers them directly. Sending as the visitor's own address instead would
 * fail SPF and land the lot in spam.
 * ======================================================================== */

declare(strict_types=1);

const MAIL_TO = 'create@gravino.in';
const MAIL_FROM = 'create@gravino.in';

header('Content-Type: application/json; charset=utf-8');

function fail(string $message, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fail('Method not allowed.', 405);
}

/* Accept either a JSON body or an ordinary form post. */
$raw = file_get_contents('php://input') ?: '';
$data = json_decode($raw, true);
if (!is_array($data)) {
    $data = $_POST;
}

$field = static function (string $key) use ($data): string {
    $v = $data[$key] ?? '';
    return is_string($v) ? trim($v) : '';
};

/* Honeypot: a field hidden from people and irresistible to bots. Answer 200
   so the bot believes it succeeded and does not retry with variations. */
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

/* Header injection guard. Anything with a newline in it must never reach a
   mail header, so the address is rejected outright rather than stripped. */
foreach ([$email, $name, $phone] as $headerish) {
    if (preg_match('/[\r\n]/', $headerish)) {
        fail('Invalid characters in your details.');
    }
}

$safeName = preg_replace('/["<>]/', '', $name) ?? $name;

$lines = [
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
];

$subject = 'Teardown request: ' . ($company !== '' ? $company : $name);
$headers = implode("\r\n", [
    'From: Gravino Website <' . MAIL_FROM . '>',
    'Reply-To: ' . $safeName . ' <' . $email . '>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'X-Mailer: gravino-site',
]);

$sent = @mail(MAIL_TO, $subject, implode("\n", $lines), $headers, '-f' . MAIL_FROM);

if (!$sent) {
    /* Do not pretend. If the MTA refused it, the visitor needs to know so
       they can use the address directly rather than assume we have it. */
    fail('We could not send that just now. Please email create@gravino.in directly.', 502);
}

echo json_encode(['ok' => true]);
