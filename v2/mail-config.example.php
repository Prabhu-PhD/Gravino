<?php
/* ===========================================================================
 * SMTP credentials for the teardown form. TEMPLATE ONLY.
 * ---------------------------------------------------------------------------
 * HOW TO USE THIS
 *
 * 1. Copy it and fill in the real values.
 * 2. Upload it to the server as `gravino-mail-config.php`, placed ONE LEVEL
 *    ABOVE public_html:
 *
 *        /home/youraccount/gravino-mail-config.php     <- here
 *        /home/youraccount/public_html/send.php
 *        /home/youraccount/public_html/index.html
 *
 *    Above the web root, so the file cannot be fetched over HTTP even if PHP
 *    is ever misconfigured and starts serving .php files as plain text.
 * 3. chmod it to 600 so only your account can read it.
 *
 * NEVER commit the filled-in version. .gitignore already excludes it, but the
 * safer habit is to keep it off this machine entirely and paste the values
 * straight into cPanel's file editor.
 *
 * If you would rather not keep a password on the server at all, every value
 * below can be supplied as an environment variable instead (GRAVINO_SMTP_USER
 * and so on) via cPanel or a SetEnv line in .htaccess. send.php checks the
 * environment first.
 * ======================================================================== */

return [
    // Titan's submission host. Port 465 is implicit TLS and is the default;
    // 587 also works and send.php will use STARTTLS for it.
    'host' => 'smtp.titan.email',
    'port' => 465,

    // The mailbox doing the sending. Titan will refuse to send as any other
    // address, so this must be a real mailbox and its own password.
    'user' => 'create@gravino.in',
    'pass' => 'PUT-THE-MAILBOX-PASSWORD-HERE',

    // Where submissions land. The same mailbox is fine.
    'to' => 'create@gravino.in',

    // Any long random string. It gates the connectivity check:
    //     https://gravino.in/send.php?selftest=THIS-VALUE
    // which authenticates against Titan and sends nothing. Without a match
    // the endpoint returns 404, so the check is invisible to anyone else.
    // Leave it empty to disable the check entirely.
    'selftest_token' => 'CHANGE-ME-TO-SOMETHING-LONG-AND-RANDOM',
];
