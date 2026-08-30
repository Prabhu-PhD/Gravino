/** Central content for the Gravino site. Placeholder contact details — confirm. */

export const SITE = {
  name: "Gravino",
  wordmark: "Gravino.",
  domain: "gravino.in",
  tagline: "Where balance meets value",
  email: "hello@gravino.in",
  whatsapp: "+91 00000 00000", // TODO: confirm real number
  location: "India — serving the US, Europe & the Gulf",
  experienceYears: 75,
  teamSize: 4,
};

export const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "Behance", href: "#" },
  { label: "LinkedIn", href: "#" },
] as const;

export const NAV = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export type Pillar = {
  n: string;
  name: string;
  blurb: string;
  items: string[];
  fromINR: number;
  unit?: string;
};

export const PILLARS: Pillar[] = [
  {
    n: "01",
    name: "Presentations",
    blurb:
      "Investor decks, sales decks and keynotes — plus reusable template systems so every pitch lands the same way twice.",
    items: ["Pitch & investor decks", "Sales & product decks", "Template systems"],
    fromINR: 15000,
    unit: "per deck",
  },
  {
    n: "02",
    name: "Documentation",
    blurb:
      "Reports, whitepapers, proposals and manuals. Dense information, made clear, on-brand, and easy to act on.",
    items: ["Reports & whitepapers", "Proposals & manuals", "Annual reports"],
    fromINR: 20000,
  },
  {
    n: "03",
    name: "Print",
    blurb:
      "Brochures, collateral, packaging and stationery — production-ready files, pixel-precise and press-perfect.",
    items: ["Brochures & collateral", "Packaging", "Stationery & events"],
    fromINR: 20000,
  },
  {
    n: "04",
    name: "Digital",
    blurb:
      "Social, web banners, email and UI — plus brand identity — designed and shipped on a steady, predictable cadence.",
    items: ["Social & web banners", "UI/UX & web", "Brand & logo"],
    fromINR: 1500,
    unit: "per post",
  },
];
