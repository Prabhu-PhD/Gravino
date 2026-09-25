<?php
/* ===========================================================================
 * Credentials for the teardown form. TEMPLATE ONLY.
 * ---------------------------------------------------------------------------
 * HOW TO USE THIS
 *
 * 1. Copy it and fill in the real values.
 * 2. Upload it to the server as `gravino-mail-config.php`, placed ONE LEVEL
 *    ABOVE public_html:
 *
 *        /home/gravinoi/gravino-mail-config.php        <- here
 *        /home/gravinoi/public_html/send.php
 *        /home/gravinoi/public_html/index.html
 *
 *    Above the web root, so the file cannot be fetched over HTTP even if PHP
 *    is ever misconfigured and starts serving .php files as plain text.
 * 3. chmod it to 600 so only your account can read it.
 *
 * NEVER commit the filled-in version. .gitignore already excludes it.
 *
 * WHY RESEND AND NOT SMTP. Outbound SMTP is transparently intercepted on
 * this host: a TLS handshake completes against an address with nothing
 * behind it and presents the host's own certificate, on ports 25, 465 and
 * 587 alike. Port 443 is clean, so the mail goes out over HTTPS instead.
 * The full reasoning is at the top of public/send.php.
 * ======================================================================== */

return [
    // From https://resend.com/api-keys. Starts "re_". Sending permission is
    // all it needs.
    'resend_key' => 'PUT-THE-RESEND-API-KEY-HERE',

    // Where submissions land.
    'to' => 'create@gravino.in',

    /* WHO THE MAIL COMES FROM.
     *
     * The default below is Resend's shared sender and needs no DNS setup at
     * all. Reply-To is set to the visitor either way, so replying from the
     * inbox answers them directly.
     *
     * To send as your own address instead, verify gravino.in inside Resend,
     * add the DKIM records it gives you at GoDaddy, and change this to:
     *
     *     'from' => 'Gravino <create@gravino.in>',
     *
     * Do NOT make that change before the domain is verified. The SPF record
     * for gravino.in ends in -all and DMARC is p=quarantine, so unverified
     * mail claiming to be from the domain will be quarantined rather than
     * delivered.
     */
    'from' => 'Gravino Website <onboarding@resend.dev>',

    /* Any long random string. It gates the connectivity check:
     *     https://gravino.in/send.php?selftest=THIS-VALUE
     * which contacts Resend, confirms the key is accepted, and sends
     * nothing. Without a match the endpoint returns 404, so the check is
     * invisible to anyone else. Leave empty to disable it. */
    'selftest_token' => 'CHANGE-ME-TO-SOMETHING-LONG-AND-RANDOM',
];
