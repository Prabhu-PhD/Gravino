import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/* Every public route. /lab is deliberately absent — see robots.ts. */
/* Trailing slashes because the build sets trailingSlash: true, so these are
   the URLs that actually exist. A sitemap listing /about when the server
   301s to /about/ makes every entry a redirect. */
const ROUTES = [
  "/",
  "/about/",
  "/services/",
  "/portfolio/",
  "/contact/",
  "/privacy/",
  "/terms/",
];

/* Required by `output: export`. Next treats a metadata route as dynamic by
   default - it is a function, and it could read the request - so it refuses
   to prerender one into a static file unless told the result is constant. */
export const dynamic = "force-static";

/* The commit date, injected by next.config.mjs, NOT `new Date()`.
   This comment used to claim the file returned the same bytes on every build.
   It did not: `new Date()` made sitemap.xml the single file that changed on
   every rebuild, and it was the last thing keeping the output from being
   reproducible. A build-time timestamp is also a dishonest lastmod, telling
   crawlers every page changed whenever we rebuilt. */
const LAST_MODIFIED = process.env.GRAVINO_COMMIT_DATE ?? "2026-09-25T00:00:00Z";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(LAST_MODIFIED);
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
