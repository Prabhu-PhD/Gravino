import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site-url";

/* One family. DM Sans is the brochure's own body face; its display face,
   Hagrid, is a commercial licence this project does not hold, and a
   near-miss substitute for a display face reads worse than committing to the
   brand face we actually have. Hierarchy comes from weight and scale.
   Self-hosted by next/font — no third-party request at runtime. */
const dm = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Gravino",
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
    locale: "en_IN",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={dm.variable}>
      <body>{children}</body>
    </html>
  );
}
