import { execSync } from "node:child_process";

/* REPRODUCIBLE BUILD ID.
 *
 * Next invents a RANDOM build id per build when this is unset. That id names
 * _next/static/<id>/, is inlined into every HTML page, and moves the
 * webpack-<hash>.js runtime chunk name with it. So two builds of the same
 * commit, on the same machine, with no code change, differ across most of the
 * tree -- which makes md5 useless as a verification instrument and has twice
 * sent us chasing phantom differences between the local and the deploy build.
 *
 * Pinned to the commit instead, so md5-across-builds means something. Falls
 * back to Next's random default if git is unavailable, so a build from a
 * tarball without .git still works rather than failing.
 *
 * It is safe to reuse an id across deploys of different content: every asset
 * under _next/static is content-hashed independently, and HTML is served
 * must-revalidate, so nothing can be served stale because of this.
 */
function git(cmd, fallback) {
  try {
    return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return fallback;
  }
}

function buildId() {
  if (process.env.GRAVINO_BUILD_ID) return process.env.GRAVINO_BUILD_ID;
  // null -> Next falls back to its own random id.
  return git("git rev-parse HEAD", null);
}

/* The sitemap's <lastmod>. It used to be `new Date()` in sitemap.ts, which
 * made that one file differ on every build and was the last thing standing
 * between us and a reproducible output. It was also a poor lastmod: a
 * sub-second timestamp tells crawlers every page changed whenever we rebuild,
 * which is untrue and devalues the signal. The commit date is both stable and
 * honest, since that is when the content actually last changed. */
const COMMIT_DATE = git("git log -1 --format=%cI", "2026-09-25T00:00:00Z");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root (a stray package-lock.json in the home dir confuses inference).
  outputFileTracingRoot: import.meta.dirname,

  generateBuildId: buildId,

  // Inlined at build time; read by src/app/sitemap.ts.
  env: { GRAVINO_COMMIT_DATE: COMMIT_DATE },

  /* A NOTE ON BUILDING WHILE `next dev` IS RUNNING: do not.

     `next build` rewrites the chunks under a live dev server and every route
     starts returning 500 with "Cannot find module './331.js'". It looks like
     a code fault and is not one.

     A distDir split was tried here to make the two coexist and was REVERTED,
     for two measured reasons. It did not actually work: with the directories
     separated, routes already compiled by the dev server still broke, so
     something shared outside distDir is being invalidated as well. And it
     silently moved the static export, because `output: "export"` writes into
     distDir, so `out/` stopped being produced at all and the documented
     upload folder vanished.

     Stopping the dev server first is the whole fix. */

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
