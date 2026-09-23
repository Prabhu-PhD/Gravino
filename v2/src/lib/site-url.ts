/* The canonical origin, in one place.

   Used for metadataBase (which Open Graph and Twitter card URLs resolve
   against), robots.txt and the sitemap. Without it Next warns at build time
   and emits relative social image URLs, which crawlers cannot fetch.

   gravino.in is the intended home but currently resolves to an older
   deployment, so this is overridable per environment. NEXT_PUBLIC_SITE_URL
   should be set in Vercel for preview deployments; the default is correct
   for production. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://gravino.in";
