# Deploying Gravino to Broodle shared cPanel hosting

Server IP: `122.180.87.100`

## What this is

The site builds to **plain static files** — HTML, CSS, JS and images. There is
no Node process to run, no database, nothing to keep alive. Shared cPanel
hosting serves it exactly as well as any other host would.

That is not a compromise forced by the hosting: this app never had an API
route, middleware, a server action or a dynamic page, so every route was
already rendered at build time. `output: "export"` in `next.config.mjs` just
tells Next to write those pages to disk instead of serving them.

## Build

```bash
cd v2
npm ci
npm run build
```

**Stop the dev server first if one is running.** Dev and build write to
separate directories now (`.next` and `.next-build`), but a build against a
live dev server still leaves already-compiled routes returning 500 until that
server is restarted. Measured, not assumed.

This writes `v2/out/`. Everything inside it — including the hidden
`.htaccess` — is what gets uploaded. Nothing else from the repo goes on the
server.

## Upload

The contents of `out/` go into `public_html`, **not** the `out` folder
itself. `public_html/index.html` must exist when you are done.

Easiest route, in cPanel:

1. **File Manager** → open `public_html` → delete whatever placeholder is
   there (`default.html`, `cgi-bin` can stay).
2. Settings (top right) → tick **Show Hidden Files (dotfiles)**. Do this
   before uploading or you will not be able to see or verify `.htaccess`.
3. Zip `out/` locally, upload the zip, then **Extract** it in `public_html`,
   and move the files up one level if they landed in an `out/` subfolder.

If you would rather use FTP, upload `out/*` to `/public_html/` and make sure
the client is set to transfer hidden files.

## cPanel settings

1. **SSL/TLS Status → Run AutoSSL.** Do this *after* DNS points here
   (below), because Let's Encrypt validates over HTTP against the live
   domain. Until a certificate exists, the HTTPS redirect in `.htaccess`
   will send visitors to a browser warning.
2. Check that `public_html` is the document root for `gravino.in`.
3. Nothing else. No Node app, no Passenger, no Python. If a "Setup Node.js
   App" entry exists in cPanel, ignore it — it is not used here.

## DNS

These change where the domain points, so they are made at whoever the domain
is registered with, not in cPanel. **`gravino.in` currently resolves to the
older deployment**, so this is the cutover.

| Type | Name | Value | TTL |
|------|------|-------------------|------|
| A | `@` | `122.180.87.100` | 3600 |
| A | `www` | `122.180.87.100` | 3600 |

A `CNAME` of `www` → `gravino.in` works equally well if you prefer.

Two warnings worth reading twice:

- **DO NOT TOUCH THE MX RECORDS.** This is no longer a general caution:
  `create@gravino.in` is a GoDaddy mailbox on Titan, so the MX records for
  the domain point at Titan. Changing them, or letting cPanel "take over"
  mail for the domain, stops your email dead. When you add the domain in
  cPanel, set it to use **remote mail exchanger**, not local.
- Lower the TTL to 300 a day *before* the cutover if you want to be able to
  roll back quickly. Once the change is live, TTL only helps you next time.

Propagation is usually minutes, occasionally hours. Check with:

```bash
nslookup gravino.in
```

## The form: SMTP to Titan

`create@gravino.in` is a GoDaddy mailbox on Titan, so the domain's MX records
point at Titan rather than at this cPanel account. PHP's `mail()` would
therefore have to relay out from a shared-hosting IP with no SPF
authorisation for your domain, which is how form mail ends up in spam.

`public/send.php` instead connects to Titan's own SMTP and authenticates as
the mailbox. That makes us the authorised sender: SPF and DKIM align, and the
mail is as deliverable as anything else sent from that account. Nothing
passes through a third party, so the privacy policy stays true as written.

### Set it up

1. Copy `v2/mail-config.example.php`, fill in the real values.
2. Upload it as `gravino-mail-config.php`, **one level above `public_html`**:

   ```
   /home/youraccount/gravino-mail-config.php      <- here, NOT in public_html
   /home/youraccount/public_html/send.php
   ```

   Above the web root so it can never be fetched over HTTP, even if PHP were
   ever misconfigured and began serving `.php` files as text.

3. `chmod 600` it.

The password is the mailbox's own Titan password. If you would rather keep no
password on the server, every value can come from environment variables
instead (`GRAVINO_SMTP_USER`, `GRAVINO_SMTP_PASS`, and so on) set in cPanel or
with `SetEnv` in `.htaccess`; `send.php` checks the environment first.

### Prove it works before trusting it

None of this code has ever been executed: there is no PHP on the machine it
was written on. So there is a check that authenticates against Titan and
sends nothing:

```
https://gravino.in/send.php?selftest=YOUR-TOKEN
```

The token is `selftest_token` from the config. A pass returns
`{"ok":true,...}` naming the host and account. A failure returns the actual
SMTP error, which is what you want for diagnosis. Without a matching token
the URL returns 404, so it gives nothing away to anyone who guesses the path.

Then **submit the real form once** and confirm the mail arrives.

### If it fails

- `Could not reach smtp.titan.email:465` means the host blocks outbound SMTP.
  Some shared hosts do. Try port 587 in the config (`send.php` will use
  STARTTLS automatically). If both are blocked, ask Broodle to open outbound
  SMTP, or fall back to Web3Forms: set `NEXT_PUBLIC_WEB3FORMS_KEY` at build
  time and rebuild. That routes submissions through a third party, so the
  privacy policy would then need rewriting.
- `SMTP expected 235` means the username or password is wrong.
- `The form is not configured yet` means `send.php` cannot find the config
  file or the environment variables.

## Verify after going live

```bash
curl -sI https://gravino.in/ | head -3
curl -sI https://gravino.in/about/ | head -3
curl -s  https://gravino.in/robots.txt
curl -sI https://gravino.in/_next/static/ -o /dev/null -w '%{http_code}\n'
```

Expect `200` on the pages, the robots body to name the sitemap, and a `403`
or `404` on the bare `_next/static/` directory (listings are turned off on
purpose).

In a browser, confirm:

- the home page reaches the planet and the hero releases on scroll
- `/about/`, `/services/`, `/contact/`, `/privacy/` and `/terms/` all load dark
- the footer links reach those pages, and the legal links work
- **the teardown form actually sends**, and the mail arrives at
  `create@gravino.in`. This is the single most important check: it is the one
  path that has never been executed anywhere
- `http://gravino.in` and `https://www.gravino.in` both land on
  `https://gravino.in`

## Redeploying

There is no pipeline. Rebuild and re-upload:

```bash
cd v2 && npm run build
```

Then replace `public_html` with the new `out/` contents. Files under
`_next/static/` are content-hashed, so old and new can coexist safely during
an upload; the HTML is served with `must-revalidate`, so a change is visible
immediately rather than after a cache expires.

## One thing to know about this host

Shared hosting serves from a single machine in India. For an audience in
India and the Gulf that is fine — arguably better than a US-edge CDN. For
significant US or European traffic it will be slower than the Vercel setup,
because the heaviest asset on the home page is `three.min.js` at 589KB
(**146KB gzipped** — the `mod_deflate` rules in `.htaccess` are what make
that difference, and are the single biggest performance item on this host).

Nothing here locks you in. The same `out/` folder deploys to any static host,
including Vercel, unchanged.
