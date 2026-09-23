import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/* Every public route. /lab is deliberately absent — see robots.ts. */
const ROUTES = ["", "/about", "/services", "/contact", "/for/ceo", "/for/cfo"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
}
