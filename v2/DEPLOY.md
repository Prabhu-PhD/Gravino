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

- **Do not touch the MX records unless you intend to move email too.** If
  mail for `gravino.in` is currently handled anywhere else, repointing MX at
  this host silently stops delivery.
- Lower the TTL to 300 a day *before* the cutover if you want to be able to
  roll back quickly. Once the change is live, TTL only helps you next time.

Propagation is usually minutes, occasionally hours. Check with:

```bash
nslookup gravino.in
```

## Email: `create@gravino.in`

This address is now the destination for every teardown submission on the
site, and **it does not exist yet**. Broodle's cPanel includes mail, so:

cPanel → **Email Accounts** → Create → `create@gravino.in`.

Then send it a real test message from outside and confirm it arrives. If the
mailbox is not live, the form fails silently and no visitor will tell you.

If you would rather keep mail with an existing provider, create the mailbox
there instead and leave the MX records alone.

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
- `/about/`, `/services/`, `/contact/`, `/for/ceo/`, `/for/cfo/` all load dark
- the footer links reach those pages
- the teardown form opens your mail client addressed to `create@gravino.in`
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
