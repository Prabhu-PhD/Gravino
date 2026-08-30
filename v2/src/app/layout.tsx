import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Gravino — One team for everything your business needs to say",
    template: "%s — Gravino",
  },
  description:
    "One senior team for the full surface of how your business communicates — investor decks, reports, brand, motion and campaigns. Where Balance Meets Value.",
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
