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
  body: "One senior team across every format, learning your business once, then handling everything it has to say.",
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
          "The deck, the board narrative, the keynote, where a “no” costs most. Built to survive the hardest question in the room, not just to open well.",
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
          "Whitepapers, briefs and case studies a busy executive actually finishes, and remembers you for.",
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
          "Positioning, identity systems and rebrands built to compound, so the brand reads as category leader before a word is spoken.",
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
          "Research and analytics a decision-maker grasps in seconds. The insight was always there; we make it impossible to miss.",
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
          "Booths, environmental branding and print, as considered in the room as on screen.",
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
    body: "Five-slide teaser to launch film to annual report, held to one standard by one team.",
  },
] as const;

/* ---------------------------------------------------------------------------
 * The comparison — the strongest section in the collateral, and the one the
 * CFO flyer is built around. Lives on a dark band.
 * ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
 * About: the embedded-partner position.
 *
 * Replaces COMPARISON and PROBLEM.pull on the About page. Those argued the
 * case by running down the reader's alternatives ("most companies have two
 * bad options", "most studios design your logo, most freelancers build one
 * deck"): a self-scored table Gravino won on every row, and a pull quote that
 * talked down the peers the business gets referrals from. The substance was
 * real (one contact, cost that scales, consistency, no idle capacity) and is
 * kept here, said about Gravino instead of against anyone else.
 *
 * "Embedded" was already the company's word ("why an embedded partner", "an
 * embedded partner, not a vendor you re-brief"), so this promotes an existing
 * position rather than inventing one.
 * ------------------------------------------------------------------------ */

/* ---------------------------------------------------------------------------
 * About: who Gravino is.
 *
 * SOURCES, so every line can be traced:
 *   TEAM        the earlier live site's About page (gravino-site), verbatim
 *               except where a line compared the team with others.
 *   PRINCIPLES  the earlier site ("standards live in systems", "you own
 *               everything") and the brochure (confidentiality).
 *   WHO         the earlier site ("small on purpose, senior by default",
 *               "being small is the mechanism").
 *
 * Removed on the way in, because the page no longer argues by comparison:
 *   "Most agencies sell you a pitch team and staff the work with juniors."
 *   "Forty people cannot, which is why agencies that size need process."
 *   "Not a pitch team with juniors behind it."
 *
 * TODO(confirm): the years below add up to 65, while SITE.experienceYears
 * (and the brochure) say 75+. A reader can add four numbers. One of them has
 * to change before this page goes live.
 * ------------------------------------------------------------------------ */

export type TeamMember = {
  name: string;
  initials: string;
  role: string;
  years: number;
  tags: readonly string[];
  bio: string;
};

export const ABOUT = {
  eyebrow: "About Gravino",
  headline: "Small on purpose,",
  accent: "senior by default.",
  lede: "Four senior people who do the work themselves. Based in Chennai, working with businesses in India, the Gulf, Europe and the US.",
  who: {
    label: "Who we are",
    headline: "Four people.",
    accent: "One standard.",
    lede: "Being small is the mechanism, not a limitation. Four people who have each spent a career in high-stakes rooms can hold one standard across every format, and every client works with all four.",
  },
  believe: {
    label: "What we believe",
    headline: "The discipline we built",
    accent: "the firm around.",
  },
  team: {
    label: "The team",
    headline: "The people",
    accent: "who do the work.",
    lede: "The four people you talk to are the four people who make the work, from the first call to the final file.",
    /* EMPTY ON PURPOSE. The GitHub repo is public and the client does not
     * want the team shown yet (2026-09-27), so names and bios are not kept
     * here. They live in the PRIVATE repo Prabhu-PhD/gravino-site, in
     * src/pages/about.html: four people, each with name, initials, role,
     * years, tags and bio. Paste them back here when the team is to be shown,
     * after resolving the years TODO above. */
    people: [] as TeamMember[],
  },
  principles: {
    label: "How we are built",
    headline: "Built so the standard",
    accent: "holds.",
    items: [
      {
        title: "The people you meet do the work",
        body: "There is no hand-off between the conversation and the craft. The team on the call is the team on the file.",
      },
      {
        title: "Standards live in systems, not in heads",
        body: "Template libraries, brand-compliance tooling and asset systems, so consistency survives us being busy and survives your team producing things without us.",
      },
      {
        title: "You own everything at the end",
        body: "Full copyright transfers on completion, source files included. Nothing is held back to keep you on a retainer.",
      },
      {
        title: "What you share stays confidential",
        body: "Decks before a round, results before they are announced. Material you share with us stays with us.",
      },
    ],
  },
  reach: {
    label: "Where we work",
    headline: "From Chennai,",
    accent: "to four markets.",
    lede: "Based in Chennai, India. Working with businesses across India, the Gulf, Europe and the US, and used to the time zones that come with that.",
  },
} as const;

/** The markets as a list, for diagrams. Same source as SITE.markets. */
export const MARKETS = SITE.markets.split("·").map((m) => m.trim());

export const EMBEDDED = {
  label: "What we are",
  headline: "An embedded",
  accent: "business communications partner.",
  lede: "We work as part of your team on the communication your business is judged by: the investor deck, the board paper, the annual report, the story you take to market.",
  points: [
    {
      title: "We learn your business once",
      body: "Your numbers, your market, the way you talk about both. Every piece of work after the first starts from what we already know, so the first draft is already close.",
    },
    {
      title: "We work to your calendar",
      body: "Board cycles, funding rounds, reporting season, launches. We plan around the dates that matter to you, so the work is ready before it is needed.",
    },
    {
      title: "One contact for every format",
      body: "Deck, report, film or brand system: one person is accountable for it, and one standard runs across all of it.",
    },
    {
      title: "Sized to the work",
      body: "A defined project when the scope is clear, a retainer when the work is continuous. You pay for the capacity you use.",
    },
  ],
  statement: "We become part of how your company communicates.",
} as const;

export const ALONGSIDE = {
  label: "Where we fit",
  headline: "Alongside the people",
  accent: "you already have.",
  lede: "Embedded means adding to your team, not replacing any part of it.",
  points: [
    {
      title: "Your leadership",
      body: "They know the business better than anyone. We help turn what they know into what an investor, a board or a market needs to hear.",
    },
    {
      title: "Your marketing team",
      body: "They run the brand and the campaigns. We take on the high-stakes material that lands on top of their day job.",
    },
    {
      // DECISION PENDING: naming agencies is the clearest way to say Gravino
      // does not compete with them, but it is only true if the business is
      // content not to pitch against them for brand and campaign work.
      title: "Your agency",
      body: "They lead the creative. We make sure the deck, the report and the story behind them all say the same thing.",
    },
  ],
} as const;

export const COMPARISON = {
  label: "Why an embedded partner",
  headline: "Why this beats the alternatives.",
  intro:
    "Only one of them gives you senior craft, full coverage and predictable cost at the same time.",
  columns: ["Freelancers", "In-house hire", "Gravino"],
  rows: [
    { k: "Seniority", v: ["Varies job to job", "One person's ceiling", "Senior team, every project"] },
    { k: "Coverage", v: ["One format each", "One person's range", "Full communications surface"] },
    { k: "Consistency", v: ["Fragments across hands", "Strong, single-threaded", "Systemised across all work"] },
    { k: "Cost shape", v: ["Unpredictable", "Fixed, even when idle", "Scales with need"] },
    { k: "Idle capacity", v: ["Not applicable", "Paid whether used or not", "None, commissioned as needed"] },
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
 * Starting a project. This was the free one-page review offer until
 * 2026-10-01, when the client replaced it with a straight project intake.
 * ------------------------------------------------------------------------ */

export const INTAKE = {
  label: "Start a project",
  cta: { label: "Start a project", href: "/contact/" },
  terms: [
    "Scope fixed before work begins, with a clear quote after a short conversation.",
    "Your files and full copyright transfer to you on completion.",
    "What you share stays confidential, with an NDA if you want one.",
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
    body: "Most underinvest exactly when the stakes are highest: the year's biggest meeting, a deck built overnight, a brand that signals “smaller than we are.” We build the balance instead: bold enough to inspire, grounded enough to trust.",
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
    body: "Gravino is the third option. One embedded team, covering every format, with the capability of an in-house function without the fixed cost, the recruitment risk, or the idle capacity.",
    pull: "The hidden cost of design isn't the invoice, it's the hours spent coordinating it.",
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
    close: "Transparent by default: clear scope, quotes after a short conversation, no surprise line items.",
    offer:
      "Send a recent set of company decks. We'll return one page on where design spend is leaking and where it's working.",
  },
} as const;
