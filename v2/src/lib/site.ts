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
  email: "hello@gravino.in", // TODO(confirm): real address — brochure says 〔add email〕
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
  body: "Startups and growing companies don't have a deck problem, then a report problem, then a brand problem. They have one communications challenge that shows up in a dozen formats — and no time to brief a different vendor on the business each time.",
  primary: { label: "Send us a deck", href: "/contact" },
  secondary: { label: "See what we cover", href: "/services" },
} as const;

/* ---------------------------------------------------------------------------
 * The argument
 * ------------------------------------------------------------------------ */

export const PROBLEM = {
  label: "The problem",
  headline: "You don't have five problems. You have one, in a dozen formats.",
  body: [
    "Gravino absorbs the whole of it. We cover the full surface of how your business communicates — from the investor deck to the launch film to the internal playbook — as an embedded partner that learns your business once, then handles all of it.",
    "We lead with high-stakes business communication — the decks, reports and narratives that decide outcomes — and bring the full range of brand, digital, motion and campaign work behind it. One senior team, fluent across every format, so nothing is lost in translation between five suppliers.",
  ],
  pull: "Most studios design your logo. Most freelancers build one deck. We become the communications capability your company doesn't have the headcount to hire.",
} as const;

export const BALANCE = {
  label: "Why it matters",
  headline: "Every high-stakes communication is a balancing act.",
  body: "Enough detail to be credible, enough clarity to be understood; ambition that inspires, grounded in proof that convinces. Tip too far either way and you either bore the room or lose its trust.",
  pull: "A brilliant business that communicates unclearly is an undervalued one.",
  close:
    "That balance is the discipline — and it's the one we've built the firm around. It's also why clients tell us the same thing: that we understood their business faster, and covered more of what they needed, than anyone else they'd worked with.",
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
          "The investor deck, the board narrative, the keynote — the documents where a “no” costs the most. Built to survive the hardest question in the room, not just to open well.",
        items: ["Pitch & investor decks", "Boardroom presentations", "Keynote design"],
      },
      {
        n: "02",
        title: "Report with authority",
        kind: "ESG & impact reporting",
        blurb:
          "Annual reports, ESG disclosures and governance summaries that turn a regulatory obligation into a credibility asset — dense data made readable, milestones made memorable.",
        items: ["Sustainability reports", "Governance", "Stakeholder reports"],
      },
      {
        n: "03",
        title: "Own the conversation",
        kind: "Editorial design & thought leadership",
        blurb:
          "Whitepapers, briefs and case studies that package your expertise into something a busy executive actually finishes — and remembers you for.",
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
          "Positioning, identity systems and rebrands designed to compound in value — so the brand reads as the category leader before a word is spoken.",
        items: ["Positioning", "Visual identity systems", "Rebranding"],
      },
      {
        n: "05",
        title: "Stop the brand leaking",
        kind: "Enterprise presentation infrastructure",
        blurb:
          "Master templates, brand-compliance tooling and asset libraries that keep every team on-brand without a designer policing every file. Consistency becomes the default.",
        items: ["Templates", "Brand-compliance tooling", "Asset libraries"],
      },
    ],
  },
  {
    n: "03",
    name: "Growth & digital marketing",
    premise:
      "The work that carries your story to market — often the highest-visibility asset you own.",
    disciplines: [
      {
        n: "06",
        title: "Move the story",
        kind: "Motion design & corporate video",
        blurb:
          "Launch films, explainers, campaign motion and animated sequences that give a static narrative momentum across every channel. When the market needs to feel something, this is where it happens.",
        items: ["Launch films", "Explainers", "Campaign motion"],
      },
      {
        n: "07",
        title: "Turn attention into pipeline",
        kind: "Integrated digital marketing",
        blurb:
          "Go-to-market suites, ad creative and sales collateral engineered for conversion, not just impressions — the full launch toolkit on one coherent identity.",
        items: ["GTM collateral", "Ad creative", "Service menus"],
      },
      {
        n: "08",
        title: "Make complexity obvious",
        kind: "Information design & data visualisation",
        blurb:
          "Research and analytics translated into visuals a decision-maker grasps in seconds. The insight was always there; we make it impossible to miss.",
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
          "High-visibility campaigns for institutions and public initiatives, built to educate and move large audiences.",
        items: ["PSA strategy", "Community outreach", "Campaign playbooks"],
      },
      {
        n: "10",
        title: "Command the space",
        kind: "Spatial, event & experiential design",
        blurb:
          "Booths, environmental branding and print that make the brand feel as considered in the room as it does on screen.",
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
    body: "Every choice is backed by data, logic and market positioning. We start from what the business needs to prove, then design to prove it.",
  },
  {
    n: "02",
    title: "C-suite fluency",
    body: `Built for high-stakes rooms — seed rounds through IPO roadshows, boardrooms, and the reporting that follows. We've spent ${SITE.experienceYears}+ years, combined, in exactly these rooms.`,
  },
  {
    n: "03",
    title: "One team, full range",
    body: "From a five-slide teaser to a launch film to a data-heavy annual report — one embedded team covers it, at a senior standard, without you managing a roster of freelancers.",
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
    "Most companies solve recurring communications one of three ways. Only one gives you senior craft, full coverage and predictable cost at once.",
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
  body: "Send us your current investor deck, report or brand piece. We'll send back a one-page teardown — what's working, what's costing you, and what we'd change. It's the fastest way to see how we think.",
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
    lede: "You get seconds. Seconds to secure the round, align the board, hold the room, convince the market you're the one to bet on. In those seconds, how your business communicates is the business — and a brilliant strategy told badly loses to an average one told well.",
    body: "Most companies underinvest here exactly when the stakes are highest — walking into the most important meetings of the year with a deck built overnight and a brand that quietly signals “smaller than we are.” The best narratives balance ambition with proof: bold enough to inspire, grounded enough to trust. We build that balance, so you walk in with the advantage instead of hoping to earn it.",
    pull: "A brilliant business with an unclear narrative is an undervalued one.",
    points: [
      {
        title: "Win the room",
        body: "Investor decks and board narratives engineered to survive the hardest question — not just to open well. From seed rounds to IPO roadshows, we build the story that holds up under real scrutiny.",
      },
      {
        title: "Command the market",
        body: "Positioning, identity and the launch films that make you read as the category leader before you've said a word. Perception is a lever — we make it work in your favour, across every format your market sees.",
      },
      {
        title: "Move at your speed",
        body: "An embedded design partner with senior capability on tap — no hiring runway, no lag between the idea and the asset, no five vendors to brief. When the moment is now, you're ready now.",
      },
    ],
    close: "Built like an in-house team. Positioned like a market leader.",
    offer:
      "Send us your current investor or board deck. We'll return a one-page teardown of what's helping and what's holding it back — no cost, no pitch.",
  },
  cfo: {
    slug: "cfo",
    role: "For the chief financial officer",
    headline: "Senior design capability. Without the headcount line.",
    lede: "Design is now a recurring business need — the decks, reports and brand assets never stop. But solving it the obvious way is expensive: a senior in-house team is a permanent cost line for demand that arrives in waves, and the freelancer alternative trades that for inconsistent quality, coordination overhead, and a brand that fragments across a dozen hands.",
    body: "Gravino is the third option — the balance between the two. One embedded team covers the full surface of your business communications, so you get the capability of an in-house function without the fixed cost, the recruitment risk, or the idle capacity between projects.",
    pull: "The hidden cost of design isn't the invoice — it's the hours spent coordinating it.",
    points: [
      {
        title: "One partner, not ten vendors",
        body: "A single accountable team replaces scattered freelancers — one point of contact, one standard, dramatically less management overhead. And because that team already covers every format you need, you're not re-onboarding a supplier every time the requirement changes.",
      },
      {
        title: "Spend that scales with need",
        body: "Project-based when the work is defined, retainer when it's continuous. You commission capacity when you need it and never carry it when you don't — turning an unpredictable cost into a planned one.",
      },
      {
        title: "Protect the brand you paid for",
        body: "Every off-brand slide is value quietly leaking out of an asset you invested in. Our systems and templates keep every team on-brand by default — so brand equity compounds instead of eroding.",
      },
    ],
    close: "Transparent by default — clear scope, quotes after a short conversation, no surprise line items.",
    offer:
      "Send us a recent set of company decks or brand material. We'll return a one-page read on where design spend is being lost and where it's working — no cost, no obligation.",
  },
} as const;
