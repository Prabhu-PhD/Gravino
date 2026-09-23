/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray package-lock.json in the home dir confuses inference).
  outputFileTracingRoot: import.meta.dirname,

  /* Dev and build get SEPARATE build directories.

     They shared `.next` by default, so running `npm run build` while the dev
     server was up rewrote the chunks underneath it and every route started
     500ing with "Cannot find module './611.js'" and
     "__webpack_modules__[moduleId] is not a function". That looks like a code
     error and is not one; it cost three separate debugging detours in this
     project alone.

     Next sets NODE_ENV before it loads this file: production for
     `next build`, development for `next dev`, so the two no longer write to
     the same directory.

     THIS HELPS BUT IS NOT A CURE, and that was measured rather than assumed.
     With the directories split, a build run against a live dev server still
     left the routes that had ALREADY been compiled returning 500, while
     routes compiled afterwards were fine. So something shared outside
     distDir is still being invalidated, most likely the webpack/SWC cache
     under node_modules. A clean dev restart fixes it.

     The operational rule therefore stands: STOP THE DEV SERVER BEFORE
     BUILDING. What this setting buys is that `out/` and the production
     output no longer get destroyed by a dev restart, and vice versa. */
  distDir: process.env.NODE_ENV === "production" ? ".next-build" : ".next",

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
