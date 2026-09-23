import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/* /lab is the WebGL judging surface — its own header says it is not part of
   the site. It was publicly crawlable, which is how it would have ended up
   in search results. */
/* Required by `output: export`. Next treats a metadata route as dynamic by
   default - it is a function, and it could read the request - so it refuses
   to prerender one into a static file unless told the result is constant.
   It is: both files return the same bytes on every build. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/lab"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
