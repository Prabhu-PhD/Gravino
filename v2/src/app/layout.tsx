import type { Metadata } from "next";
import { JsonLd } from "@/components/json-ld";
import { organizationLd } from "@/lib/seo";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";

/* One family. DM Sans is the brochure's own body face; its display face,
   Hagrid, is a commercial licence this project does not hold, and a
   near-miss substitute for a display face reads worse than committing to the
   brand face we actually have. Hierarchy comes from weight and scale.
   Self-hosted by next/font — no third-party request at runtime.
   600 is there for The Grid's case study, whose type specimen names DM Sans
   Semibold; without it the browser silently substitutes 700. */
const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm",
  display: "swap",
});

const TITLE = "Gravino | One team for everything your business needs to say";
const DESCRIPTION =
  "One senior team for the full surface of how your business communicates: investor decks, reports, brand, motion and campaigns. Where Balance Meets Value.";

export const metadata: Metadata = {
  /* Without metadataBase, Next emits RELATIVE Open Graph image URLs, which no
     crawler can resolve — a shared link renders with no image at all. The
     opengraph-image.jpg and icon.png beside this file are picked up by
     convention and resolved against it. */
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Gravino" },
  description: DESCRIPTION,
  /* Deliberately NO canonical, og:url, og:title or og:description here.
     Metadata is inherited, and these used to be set to the home page's
     values, so every page on the site declared itself a duplicate of the
     home page and shared as the home page. Each page sets its own through
     pageMeta() in src/lib/seo.ts. Only genuinely site-wide values stay. */
  openGraph: { type: "website", siteName: "Gravino", locale: "en_IN" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dm.variable}>
      <body>
        {/* First thing a keyboard user reaches; hidden until focused. Every
            page provides #main: interior pages on <main>, the home page on a
            marker just before the hero (Arun's ids are left untouched). */}
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        <JsonLd data={organizationLd()} />
      </body>
    </html>
  );
}
