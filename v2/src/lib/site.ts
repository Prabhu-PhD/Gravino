/**
 * All Gravino site copy, as data.
 *
 * Sourced from the 2026-08-30 collateral (GravinoBrochure.pdf,
 * Gravino_Brochure.docx, Gravino_CEO_Flyer.docx, Gravino_CFO_Flyer.docx),
 * tightened for screen — the print copy runs long for a page you scroll.
 *
 * Anything still unconfirmed is marked TODO(confirm) and kept OUT of the
 * rendered pages rather than shipped as plausible-looking filler. Grep for it.
 */

export const SITE = {
  name: "Gravino",
  wordmark: "Gravino",
  domain: "gravino.in",
  /** The campaign line. */
  tagline: "Where Balance Meets Value",
  /** The line locked up under the logo mark in the brand art. */
  lockupLine: "Value Has Gravity.",
  email: "create@gravino.in", // Confirmed by the client.
  whatsapp: "", // TODO(confirm): real number
  location: "Chennai, India",
  markets: "US · Europe · Gulf · India",
  experienceYears: 75,
  teamSize: 4,
} as const;

/* Work is deliberately absent until there is work to show: all three case
   studies in the brochure are 〔bracketed〕 placeholders with no client, no
   brief and no outcome. Add the route and this entry together. */
export const NAV = [
  { label: "What we cover", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SOCIALS = [
  { label: "LinkedIn", href: "#" }, // TODO(confirm)
  { label: "Behance", href: "#" }, // TODO(confirm)
  { label: "Instagram", href: "#" }, // TODO(confirm)
] as const;

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------ */

export const HERO = {
  /** `accent` is set in the brand gradient — the device the brochure uses on
   *  "say.", "Balance" and "Model". One word per headline, never more. */
  headline: ["One team for everything", "your business needs to"],
  accent: "say.",
  body: "One senior team across every format — learning your business once, then handling everything it has to say.",
  primary: { label: "Send us a deck", href: "/contact" },
  secondary: { label: "See what we cover", href: "/services" },
} as const;

/* ---------------------------------------------------------------------------
 * The argument
 * ------------------------------------------------------------------------ */

export const PROBLEM = {
  label: "The problem",
  headline: "One problem. A dozen formats.",
  body: [
    "Investor deck to launch film to internal playbook. An embedded partner, not a vendor you re-brief every time.",
    "We lead with the work that decides outcomes: decks, reports, narratives. Brand, digital, motion and campaign sit behind it.",
  ],
  pull: "Most studios design your logo. Most freelancers build one deck. We become the communications capability your company doesn't have the headcount to hire.",
} as const;

export const BALANCE = {
  label: "Why it matters",
  headline: "Every high-stakes communication is a balancing act.",
  body: "Enough detail to be credible. Enough clarity to be understood. Tip either way and you bore the room, or lose it.",
  pull: "A brilliant business that communicates unclearly is an undervalued one.",
  close:
    "The discipline we built the firm around. Clients say the same thing: we understood the business faster, and covered more of it, than anyone before us.",
} as const;

/* ---------------------------------------------------------------------------
 * What we cover — four groups, ten disciplines
 * ------------------------------------------------------------------------ */

export type Discipline = {
  n: string;
  /** The outcome, which is how the brochure leads. */
  title: string;
  /** The category name, kept as the quieter half. */
  kind: string;
  blurb: string;
  items: string[];
};

export type Group = {
  n: string;
  name: string;
  premise: string;
  disciplines: Discipline[];
};

export const GROUPS: Group[] = [
  {
    n: "01",
    name: "Capital & corporate narrative",
    premise: "Communication that secures funding and aligns the room.",
    disciplines: [
      {
        n: "01",
        title: "Win the room",
        kind: "High-stakes corporate communications",
        blurb:
          "The deck, the board narrative, the keynote — where a “no” costs most. Built to survive the hardest question in the room, not just to open well.",
        items: ["Pitch & investor decks", "Boardroom presentations", "Keynote design"],
      },
      {
        n: "02",
        title: "Report with authority",
        kind: "ESG & impact reporting",
        blurb:
          "Annual reports, ESG disclosures, governance summaries. Obligation turned into a credibility asset: dense data made readable.",
        items: ["Sustainability reports", "Governance", "Stakeholder reports"],
      },
      {
        n: "03",
        title: "Own the conversation",
        kind: "Editorial design & thought leadership",
        blurb:
          "Whitepapers, briefs and case studies a busy executive actually finishes — and remembers you for.",
        items: ["Whitepapers", "Newsletters", "Case studies"],
      },
    ],
  },
  {
    n: "02",
    name: "Brand & identity systems",
    premise: "Foundational identity that lets a brand scale without losing itself.",
    disciplines: [
      {
        n: "04",
        title: "Build an asset, not a logo",
        kind: "Strategic brand architecture",
        blurb:
          "Positioning, identity systems and rebrands built to compound — so the brand reads as category leader before a word is spoken.",
        items: ["Positioning", "Visual identity systems", "Rebranding"],
      },
      {
        n: "05",
        title: "Stop the brand leaking",
        kind: "Enterprise presentation infrastructure",
        blurb:
          "Templates, compliance tooling and asset libraries that keep every team on-brand without a designer policing files.",
        items: ["Templates", "Brand-compliance tooling", "Asset libraries"],
      },
    ],
  },
  {
    n: "03",
    name: "Growth & digital marketing",
    premise: "The work that carries your story to market.",
    disciplines: [
      {
        n: "06",
        title: "Move the story",
        kind: "Motion design & corporate video",
        blurb:
          "Launch films, explainers, campaign motion. When the market needs to feel something, this is where it happens.",
        items: ["Launch films", "Explainers", "Campaign motion"],
      },
      {
        n: "07",
        title: "Turn attention into pipeline",
        kind: "Integrated digital marketing",
        blurb:
          "Go-to-market suites, ad creative and sales collateral built for conversion, not impressions. One coherent identity throughout.",
        items: ["GTM collateral", "Ad creative", "Service menus"],
      },
      {
        n: "08",
        title: "Make complexity obvious",
        kind: "Information design & data visualisation",
        blurb:
          "Research and analytics a decision-maker grasps in seconds. The insight was always there — we make it impossible to miss.",
        items: ["Research synthesis", "Data storytelling", "Infographics"],
      },
    ],
  },
  {
    n: "04",
    name: "Public & physical experience",
    premise: "Where the brand steps off the screen into public and physical space.",
    disciplines: [
      {
        n: "09",
        title: "Reach the public",
        kind: "Awareness & social impact campaigns",
        blurb:
          "High-visibility work for institutions and public initiatives, built to move large audiences.",
        items: ["PSA strategy", "Community outreach", "Campaign playbooks"],
      },
      {
        n: "10",
        title: "Command the space",
        kind: "Spatial, event & experiential design",
        blurb:
          "Booths, environmental branding and print — as considered in the room as on screen.",
        items: ["Booths", "Environmental branding", "Print & packaging"],
      },
    ],
  },
];

/* ---------------------------------------------------------------------------
 * The model
 * ------------------------------------------------------------------------ */

export const MODEL = [
  {
    n: "01",
    title: "Strategic precision",
    body: "Start from what the business has to prove. Then design to prove it.",
  },
  {
    n: "02",
    title: "C-suite fluency",
    body: `Seed rounds, boardrooms, IPO roadshows, and the reporting that follows. ${SITE.experienceYears}+ years in exactly those rooms.`,
  },
  {
    n: "03",
    title: "One team, full range",
    body: "Five-slide teaser to launch film to annual report. One team, one standard, no roster to manage.",
  },
] as const;

/* ---------------------------------------------------------------------------
 * The comparison — the strongest section in the collateral, and the one the
 * CFO flyer is built around. Lives on a dark band.
 * ------------------------------------------------------------------------ */

export const COMPARISON = {
  label: "Why an embedded partner",
  headline: "Why this beats the alternatives.",
  intro:
    "Three ways to solve this. One gives you senior craft, full coverage and predictable cost at once.",
  columns: ["Freelancers", "In-house hire", "Gravino"],
  rows: [
    { k: "Seniority", v: ["Varies job to job", "One person's ceiling", "Senior team, every project"] },
    { k: "Coverage", v: ["One format each", "One person's range", "Full communications surface"] },
    { k: "Consistency", v: ["Fragments across hands", "Strong, single-threaded", "Systemised across all work"] },
    { k: "Cost shape", v: ["Unpredictable", "Fixed, even when idle", "Scales with need"] },
    { k: "Idle capacity", v: ["—", "Paid whether used or not", "None — commissioned as needed"] },
    { k: "Management load", v: ["You coordinate everyone", "You manage the role", "One point of contact"] },
  ],
  close: "You shouldn't have to build a department to solve a recurring problem.",
} as const;

/* ---------------------------------------------------------------------------
 * Proof
 *
 * TODO(confirm): the brochure carries all three case studies in 〔brackets〕 —
 * no client names, no outcomes. Deliberately NOT rendered until real details
 * land; a case study with invented specifics is worse than none.
 * ------------------------------------------------------------------------ */

export const SECTORS = [
  "IT services",
  "Overseas education",
  "Manufacturing",
  "Public sector",
] as const;

/* ---------------------------------------------------------------------------
 * The offer
 * ------------------------------------------------------------------------ */

export const TEARDOWN = {
  label: "No cost, no pitch",
  headline: "Start with a look, not a commitment.",
  body: "Send a deck. We'll send back one page: what's working, what's costing you, what we'd change.",
  cta: { label: "Send us a deck", href: "/contact" },
  terms: [
    "Scope fixed before work begins, with a clear quote after a short conversation.",
    "Your files and full copyright transfer to you on completion.",
    "What you share stays confidential.",
  ],
} as const;

/* ---------------------------------------------------------------------------
 * Audience pages
 * ------------------------------------------------------------------------ */

export const AUDIENCES = {
  ceo: {
    slug: "ceo",
    role: "For the chief executive",
    headline: "Your story is your most valuable asset. We make sure it wins.",
    lede: "Seconds to secure the round, hold the room, convince the market you're worth the bet. In those seconds, how you communicate is the business.",
    body: "Most underinvest exactly when the stakes are highest — the year's biggest meeting, a deck built overnight, a brand that signals “smaller than we are.” We build the balance instead: bold enough to inspire, grounded enough to trust.",
    pull: "A brilliant business with an unclear narrative is an undervalued one.",
    points: [
      {
        title: "Win the room",
        body: "Investor decks and board narratives built to survive the hardest question, not just to open well. Seed round through IPO roadshow.",
      },
      {
        title: "Command the market",
        body: "Positioning, identity and launch films that read as category leader before you've said a word. Perception is a lever.",
      },
      {
        title: "Move at your speed",
        body: "Senior capability on tap. No hiring runway, no lag between the idea and the asset, no five vendors to brief.",
      },
    ],
    close: "Built like an in-house team. Positioned like a market leader.",
    offer:
      "Send your investor or board deck. We'll return one page on what's helping and what's holding it back.",
  },
  cfo: {
    slug: "cfo",
    role: "For the chief financial officer",
    headline: "Senior design capability. Without the headcount line.",
    lede: "The decks, reports and brand assets never stop. An in-house team is a permanent cost for demand that arrives in waves; freelancers trade that for a brand fragmented across a dozen hands.",
    body: "Gravino is the third option. One embedded team, covering every format — the capability of an in-house function without the fixed cost, the recruitment risk, or the idle capacity.",
    pull: "The hidden cost of design isn't the invoice — it's the hours spent coordinating it.",
    points: [
      {
        title: "One partner, not ten vendors",
        body: "One accountable team, one point of contact, one standard. No re-onboarding a supplier every time the requirement changes.",
      },
      {
        title: "Spend that scales with need",
        body: "Project-based when scope is defined, retainer when it's continuous. Commission capacity when you need it; never carry it when you don't.",
      },
      {
        title: "Protect the brand you paid for",
        body: "Every off-brand slide leaks value from an asset you paid for. Templates keep every team on-brand by default, so equity compounds.",
      },
    ],
    close: "Transparent by default — clear scope, quotes after a short conversation, no surprise line items.",
    offer:
      "Send a recent set of company decks. We'll return one page on where design spend is leaking and where it's working.",
  },
} as const;
