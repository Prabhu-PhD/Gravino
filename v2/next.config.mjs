/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray package-lock.json in the home dir confuses inference).
  outputFileTracingRoot: import.meta.dirname,

  /* STATIC EXPORT — the site is going onto Broodle shared cPanel hosting,
     which serves files through Apache and cannot run a Node server.

     That costs nothing here: there is no API route, no middleware, no server
     action and no dynamic rendering anywhere in this app, so every route was
     already prerendered at build time. `next build` now writes a plain
     `out/` folder of HTML, CSS, JS and images that any web server can serve.

     What this mode gives up, for the record, in case any of it is wanted
     later: Image Optimization, rewrites/redirects/headers from this file,
     ISR, and anything server-rendered per request. */
  output: "export",

  /* Required by `output: export` — there is no server to resize images on
     demand, so next/image serves the files as authored. They were already
     sized and compressed by hand. */
  images: { unoptimized: true },

  /* Emits `/about/index.html` rather than `/about.html`, which Apache serves
     natively at /about/ with no rewrite rules at all. Without it, every
     interior URL would need a RewriteRule to find its file. */
  trailingSlash: true,
};

export default nextConfig;
