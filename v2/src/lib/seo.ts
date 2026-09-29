/* ===========================================================================
 * Per-page metadata and structured data.
 * ---------------------------------------------------------------------------
 * WHY THIS EXISTS. The root layout used to set `alternates.canonical: "/"`
 * and the home page's Open Graph url/title/description, and no page
 * overrode them. Next inherits metadata down the tree, so EVERY page shipped
 *
 *     <link rel="canonical" href="https://gravino.in/">
 *
 * plus the home page's share preview: six pages telling Google they were
 * duplicates of the home page, and every shared link rendering as the home
 * page. Found on the live site 2026-09-27 (Lighthouse and Broodle, both).
 *
 * The rule now: the layout sets only what is genuinely site-wide (base URL,
 * site name, locale, card type). Every page calls pageMeta() with its own
 * path, so canonical, og:url, og:title and og:description can never be
 * inherited from somewhere else again.
 *
 * STRUCTURED DATA states only what the site already says in visible copy:
 * name, email, Chennai, the markets in the footer, the ten disciplines.
 * Deliberately absent, and not to be added without the client:
 *   - the team (hidden at the client's request until they choose to show it)
 *   - years of experience (the "75+" figure is unconfirmed and conflicts
 *     with the team bios, which add to 65)
 *   - portfolio clients' names (case studies are labelled by kind, e.g.
 *     "Concept brand pitch", and the client is not named)
 *   - sameAs social profiles (none exist yet)
 * ======================================================================== */

import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site-url";
import { SITE, GROUPS, MARKETS } from "@/lib/site";

/* The share image, stated explicitly. A page that sets its own openGraph
 * object stops inheriting the opengraph-image.jpg file convention from the
 * root, so without this every interior page shipped with no og:image at all
 * (caught on the first build of this file). */
const SHARE_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Gravino: one team for everything your business needs to say",
};

export function pageMeta({
  path,
  title,
  description,
  index = true,
  image,
}: {
  /** The route as it is actually served, with its trailing slash. */
  path: string;
  /** The full title as it should appear in search results and tabs. */
  title: string;
  description: string;
  index?: boolean;
  /** A page-specific share image (a case study's cover); defaults to the site's. */
  image?: { url: string; width: number; height: number; alt: string };
}): Metadata {
  const shareImage = image ?? SHARE_IMAGE;
  return {
    title: { absolute: title },
    description,
    alternates: index ? { canonical: path } : undefined,
    robots: index ? undefined : { index: false },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_IN",
      url: path,
      title,
      description,
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
  };
}

const abs = (path: string) => new URL(path, SITE_URL).toString();

/** Site-wide: who Gravino is. Rendered once, from the root layout. */
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": abs("/#organization"),
    name: SITE.name,
    url: abs("/"),
    logo: abs("/icon.png"),
    image: abs("/opengraph-image.jpg"),
    email: SITE.email,
    slogan: SITE.tagline,
    description:
      "An embedded business communications partner: one senior team for investor decks, board presentations, reports, brand, motion and campaigns.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chennai",
      addressCountry: "IN",
    },
    areaServed: MARKETS,
    knowsAbout: GROUPS.flatMap((g) => g.disciplines.map((d) => d.kind)),
  };
}

/** Home only: the site as a whole. */
export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: SITE.name,
    url: abs("/"),
    publisher: { "@id": abs("/#organization") },
    inLanguage: "en",
  };
}

/** Interior pages: where this page sits under the home page. */
export function breadcrumbLd(name: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: abs("/") },
      { "@type": "ListItem", position: 2, name, item: abs(path) },
    ],
  };
}

/** /services/: the ten disciplines, as services offered by Gravino. */
export function servicesLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "What Gravino covers",
    itemListElement: GROUPS.flatMap((g) => g.disciplines).map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: d.kind,
        description: d.blurb,
        serviceType: d.items.join(", "),
        provider: { "@id": abs("/#organization") },
        areaServed: MARKETS,
      },
    })),
  };
}

/** Breadcrumbs of any depth: [["Home","/"],["Work","/portfolio/"],["Pivo","/portfolio/pivo/"]]. */
export function breadcrumbTrailLd(trail: [string, string][]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: abs(path),
    })),
  };
}

/** A case study as a CreativeWork by Gravino. States its kind honestly
 *  (e.g. "Concept brand pitch") and does not name the client. */
export function caseStudyLd(c: { slug: string; title: string; kind: string; summary: string; cover: string; disciplines: string[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": abs(`/portfolio/${c.slug}/#work`),
    name: c.title,
    genre: c.kind,
    description: c.summary,
    image: abs(c.cover),
    keywords: c.disciplines.join(", "),
    creator: { "@id": abs("/#organization") },
    url: abs(`/portfolio/${c.slug}/`),
    inLanguage: "en",
  };
}
