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
   to prerender one into a static file unless told the result is constant.
   It is: both files return the same bytes on every build. */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
