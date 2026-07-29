import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { CurrencyProvider } from "@/lib/currency";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gravino.in"),
  title: {
    default: "Gravino — Your on-demand design team",
    template: "%s · Gravino",
  },
  description:
    "A senior design department on tap. Presentations, documentation, print and digital — a systemic process and transparent pricing, delivered on a steady cadence. Based in India, serving the US, Europe and the Gulf.",
  keywords: [
    "design agency",
    "presentation design",
    "pitch deck design",
    "design retainer",
    "on-demand design",
    "India design studio",
  ],
  openGraph: {
    title: "Gravino — Your on-demand design team",
    description:
      "Senior craft, systemic process, fair pricing. A design department on tap for teams with recurring design needs.",
    url: "https://gravino.in",
    siteName: "Gravino",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <body>
        <CurrencyProvider>
          <SiteNav />
          <main>{children}</main>
          <SiteFooter />
        </CurrencyProvider>
      </body>
    </html>
  );
}
