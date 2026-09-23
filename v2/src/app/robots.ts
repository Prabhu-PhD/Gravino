import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/* /lab is the WebGL judging surface — its own header says it is not part of
   the site. It was publicly crawlable, which is how it would have ended up
   in search results. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/lab"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
