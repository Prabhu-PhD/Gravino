/* ===========================================================================
 * WHAT WE COVER: the one source.
 * ---------------------------------------------------------------------------
 * The client, 2026-10-08: one set of capability names across the whole site,
 * fewer words, and the deliverables shown VISUALLY rather than as bullet
 * lists. Before this, the home page, the Services page and the hero each had
 * their own names and their own lists for the same four things.
 *
 * Read by: the home page "What we cover" section (content/arun-sections.ts,
 * rendered as HTML), the Services page, the intake form's service options,
 * and the structured data. Change a name here and it changes everywhere.
 *
 * Positioning (also the client's): Gravino is an EMBEDDED partner. The
 * tagline stays "Where Balance Meets Value". No other slogans.
 *
 * Twelve deliverables each (the client, 2026-10-08: "add two more rows").
 * The second six are drawn from the site's earlier copy and the case
 * studies, not invented: keynote design, ESG and stakeholder reports, case
 * studies, research synthesis, brand architecture, rebranding, compliance
 * tooling and asset libraries, GTM suites, campaign playbooks and motion,
 * service menus, community outreach, explainers, experiential and
 * environmental design, the Grid's merchandise and Zylo's image style.
 *
 * GLYPHS are small line drawings of each deliverable's format, drawn on a
 * 64 x 48 grid: outlines in currentColor (the tile sets it), one violet or
 * sky accent each. Plain SVG strings, because the home page is HTML and the
 * Services page is React; both insert the same markup.
 * ======================================================================== */

export type GlyphKey =
  | "deck" | "roadshow" | "board" | "keynote" | "report" | "esg" | "stakeholder" | "paper" | "casestudy" | "newsletter" | "data" | "research"
  | "strategy" | "architecture" | "naming" | "messaging" | "logo" | "rebrand" | "guidelines" | "templates" | "assets" | "compliance" | "stationery" | "merch"
  | "campaign" | "gtm" | "playbook" | "ads" | "social" | "reel" | "artdirection" | "website" | "sales" | "menu" | "awareness" | "outreach"
  | "film" | "explainer" | "motion2d" | "motion" | "ux" | "activation" | "stage" | "events" | "environment" | "signage" | "packaging" | "print";

export type Deliverable = { name: string; glyph: GlyphKey; /** Services page only: one short line. */ note: string };

export type Capability = {
  n: string;
  id: string;
  name: string;
  /** One sentence. Shown on the home page and the Services page. */
  line: string;
  /** Services page only: what the capability is for, in two sentences. */
  detail: string;
  /** Case studies (work.ts slugs) that show this capability. */
  work: string[];
  /** Twelve, in the order they are shown. The home page shows all twelve
   *  from lg up and the first six on phones and tablets, so the first six
   *  are the ones a visitor should meet first. */
  deliverables: Deliverable[];
};

export const CAPABILITIES: Capability[] = [
  {
    n: "01",
    id: "business-communication",
    name: "Business Communication",
    line: "The decks, reports and documents your business is judged by.",
    detail:
      "The deck, the board paper, the annual report: the documents where a \u201cno\u201d costs most. We build them to survive the hardest question in the room, and make dense data easy to read.",
    work: ["zylo"],
    deliverables: [
      { name: "Investor & pitch decks", glyph: "deck", note: "Built for the hardest question in the room." },
      { name: "Board presentations", glyph: "board", note: "Clear enough to decide on." },
      { name: "Annual reports", glyph: "report", note: "A year of results, made readable." },
      { name: "Whitepapers & briefs", glyph: "paper", note: "Papers a busy reader finishes." },
      { name: "Newsletters & internal comms", glyph: "newsletter", note: "One story, told inside the company." },
      { name: "Data & infographics", glyph: "data", note: "The insight, impossible to miss." },
      { name: "IPO & roadshow decks", glyph: "roadshow", note: "The story a listing has to tell." },
      { name: "Keynotes & speeches", glyph: "keynote", note: "The talk, the slides and the stage." },
      { name: "Sustainability & ESG reports", glyph: "esg", note: "Disclosure turned into credibility." },
      { name: "Stakeholder reports", glyph: "stakeholder", note: "For investors, partners and staff." },
      { name: "Case studies", glyph: "casestudy", note: "Proof, told as a story." },
      { name: "Research synthesis", glyph: "research", note: "Findings grasped in seconds." },
    ],
  },
  {
    n: "02",
    id: "brand-identity",
    name: "Brand Identity",
    line: "How your business is recognised, wherever people meet it.",
    detail:
      "Positioning, identity and the systems that hold them together, built to compound over time. Templates and libraries keep every team on-brand without a designer checking every file.",
    work: ["the-grid", "pivo", "zylo"],
    deliverables: [
      { name: "Strategy & positioning", glyph: "strategy", note: "The place you own in the market." },
      { name: "Naming", glyph: "naming", note: "Names that are easy to say and own." },
      { name: "Logo & identity", glyph: "logo", note: "A system, not just a mark." },
      { name: "Brand guidelines", glyph: "guidelines", note: "So it holds without us in the room." },
      { name: "Presentation templates", glyph: "templates", note: "Every deck on-brand, by default." },
      { name: "Stationery & collateral", glyph: "stationery", note: "The brand in people's hands." },
      { name: "Brand architecture", glyph: "architecture", note: "How the company and its brands relate." },
      { name: "Messaging & taglines", glyph: "messaging", note: "What you say, and how you say it." },
      { name: "Rebranding", glyph: "rebrand", note: "A new identity, keeping what works." },
      { name: "Asset libraries", glyph: "assets", note: "Logos, images and files in one place." },
      { name: "Brand compliance tools", glyph: "compliance", note: "Checks that keep every file on-brand." },
      { name: "Merchandise", glyph: "merch", note: "The brand people take home." },
    ],
  },
  {
    n: "03",
    id: "marketing-growth",
    name: "Marketing & Growth",
    line: "The work that takes your story to market, and keeps it there.",
    detail:
      "Go-to-market work, ad creative and sales collateral built for conversion, not impressions, with one identity throughout. And for institutions and public initiatives, campaigns built to move large audiences.",
    work: ["pivo", "zylo"],
    deliverables: [
      { name: "Launch campaigns", glyph: "campaign", note: "A product or brand, taken to market." },
      { name: "Social content", glyph: "social", note: "Always on, always on-brand." },
      { name: "Ad creative", glyph: "ads", note: "Made for conversion, not impressions." },
      { name: "Websites", glyph: "website", note: "Designed and built." },
      { name: "Sales collateral", glyph: "sales", note: "Decks and one-pagers that close." },
      { name: "Awareness campaigns", glyph: "awareness", note: "Public and social impact work." },
      { name: "Go-to-market kits", glyph: "gtm", note: "Everything sales needs on day one." },
      { name: "Campaign playbooks", glyph: "playbook", note: "So every team runs it the same way." },
      { name: "Campaign motion", glyph: "reel", note: "Short video for feeds and screens." },
      { name: "Art direction", glyph: "artdirection", note: "An image style the brand can own." },
      { name: "Service menus", glyph: "menu", note: "What you offer, easy to choose from." },
      { name: "Community outreach", glyph: "outreach", note: "Programmes that reach people directly." },
    ],
  },
  {
    n: "04",
    id: "experience-engagement",
    name: "Experience & Engagement",
    line: "Where your brand moves, responds and fills a room.",
    detail:
      "Films, motion and interfaces for when the market needs to feel something. Booths, environments, packaging and print that are as considered in the room as on screen.",
    work: ["the-grid", "pivo"],
    deliverables: [
      { name: "Launch & brand films", glyph: "film", note: "For when the market needs to feel something." },
      { name: "3D & product visuals", glyph: "motion", note: "Products shown before they exist." },
      { name: "UX/UI & product", glyph: "ux", note: "Interfaces that feel effortless." },
      { name: "Exhibition booths", glyph: "events", note: "Stands that stop people walking past." },
      { name: "Wayfinding & signage", glyph: "signage", note: "People find their way, on-brand." },
      { name: "Packaging", glyph: "packaging", note: "As considered in hand as on screen." },
      { name: "Explainer videos", glyph: "explainer", note: "A complex idea, in two minutes." },
      { name: "Motion graphics", glyph: "motion2d", note: "2D motion for screens and stages." },
      { name: "Experiential activations", glyph: "activation", note: "Moments people step into." },
      { name: "Event & stage design", glyph: "stage", note: "The stage, the screens, the room." },
      { name: "Environmental branding", glyph: "environment", note: "Your brand on the walls of your space." },
      { name: "Print", glyph: "print", note: "Right on paper, not just on screen." },
    ],
  },
];

/* Accent colours: violet for the main accent, sky for a second touch. */
const V = "#a78bfa";
const S = "#38bdf8";
const line = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"';

export const GLYPHS: Record<GlyphKey, string> = {
  // A 16:9 slide on a stand, with a rising bar chart.
  deck: `<rect x="7" y="6" width="50" height="30" rx="3" ${line}/><line x1="32" y1="36" x2="32" y2="42" ${line}/><line x1="25" y1="42" x2="39" y2="42" ${line}/><rect x="14" y="24" width="5" height="7" rx="1" fill="${S}" fill-opacity=".75"/><rect x="22" y="19" width="5" height="12" rx="1" fill="${V}" fill-opacity=".8"/><rect x="30" y="14" width="5" height="17" rx="1" fill="${V}"/><line x1="41" y1="15" x2="51" y2="15" ${line}/><line x1="41" y1="21" x2="49" y2="21" ${line}/>`,
  // A screen with a ring chart, and the people around the table.
  board: `<rect x="12" y="5" width="40" height="25" rx="2.5" ${line}/><circle cx="25" cy="17.5" r="6" ${line}/><path d="M25 11.5 A6 6 0 0 1 31 17.5 L25 17.5 Z" fill="${V}"/><line x1="36" y1="14" x2="46" y2="14" ${line}/><line x1="36" y1="20" x2="43" y2="20" ${line}/><circle cx="20" cy="39" r="3" ${line}/><circle cx="32" cy="40" r="3" fill="${S}" fill-opacity=".8" stroke="none"/><circle cx="44" cy="39" r="3" ${line}/>`,
  // A portrait report with a folded corner and a pie chart.
  report: `<path d="M19 4 H39 L46 11 V44 H19 Z" ${line}/><path d="M39 4 V11 H46" ${line}/><circle cx="32.5" cy="22" r="7.5" ${line}/><path d="M32.5 14.5 A7.5 7.5 0 0 1 40 22 L32.5 22 Z" fill="${V}"/><line x1="24" y1="34" x2="41" y2="34" ${line}/><line x1="24" y1="39" x2="36" y2="39" ${line}/>`,
  // Two pages, a heading bar, columns of text.
  paper: `<rect x="23" y="7" width="26" height="36" rx="2" ${line} opacity=".55"/><rect x="15" y="4" width="26" height="36" rx="2" ${line}/><rect x="19" y="9" width="14" height="4" rx="1" fill="${V}"/><line x1="19" y1="18" x2="37" y2="18" ${line}/><line x1="19" y1="23" x2="37" y2="23" ${line}/><line x1="19" y1="28" x2="37" y2="28" ${line}/><line x1="19" y1="33" x2="30" y2="33" ${line}/>`,
  // A letter rising out of an envelope.
  newsletter: `<rect x="20" y="5" width="24" height="22" rx="1.5" ${line}/><rect x="24" y="9" width="16" height="4" rx="1" fill="${V}"/><line x1="24" y1="17" x2="40" y2="17" ${line}/><line x1="24" y1="21" x2="36" y2="21" ${line}/><path d="M12 22 V43 H52 V22" ${line}/><path d="M12 22 L32 35 L52 22" ${line}/>`,
  // Axes, a rising line, its points.
  data: `<path d="M10 6 V40 H56" ${line}/><polyline points="14,33 24,25 33,29 44,15 52,11" fill="none" stroke="${V}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="24" cy="25" r="2.2" fill="${S}"/><circle cx="44" cy="15" r="2.2" fill="${S}"/><circle cx="52" cy="11" r="2.2" fill="${V}"/>`,
  // A target, and the arrow in it.
  strategy: `<circle cx="30" cy="25" r="16" ${line}/><circle cx="30" cy="25" r="10" ${line}/><circle cx="30" cy="25" r="4" fill="${V}"/><line x1="30" y1="25" x2="52" y2="8" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/><path d="M47 6 L53 7 L52 13" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  // A name tag on its string.
  naming: `<path d="M14 15 H44 L54 24 L44 33 H14 Z" ${line}/><circle cx="44" cy="24" r="2.2" ${line}/><rect x="19" y="20" width="15" height="3.5" rx="1" fill="${V}"/><line x1="19" y1="28" x2="30" y2="28" ${line}/><path d="M46 24 C54 18 58 30 62 22" fill="none" stroke="${S}" stroke-width="1.4" stroke-linecap="round"/>`,
  // A card carrying a mark and a wordmark.
  logo: `<rect x="12" y="6" width="40" height="36" rx="3" ${line}/><circle cx="27" cy="21" r="7" fill="${V}"/><path d="M31 27 L38 14 L45 27 Z" fill="${S}" fill-opacity=".85"/><line x1="20" y1="34" x2="44" y2="34" ${line}/>`,
  // An open book: swatches on the left page, type on the right.
  guidelines: `<path d="M32 10 C26 6 16 6 8 8 V42 C16 40 26 40 32 44 C38 40 48 40 56 42 V8 C48 6 38 6 32 10 Z" ${line}/><line x1="32" y1="10" x2="32" y2="44" ${line}/><rect x="13" y="15" width="6" height="6" rx="1" fill="${V}"/><rect x="21" y="15" width="6" height="6" rx="1" fill="${S}"/><rect x="13" y="24" width="6" height="6" rx="1" ${line}/><line x1="37" y1="16" x2="51" y2="16" ${line}/><line x1="37" y1="22" x2="49" y2="22" ${line}/><line x1="37" y1="28" x2="51" y2="28" ${line}/>`,
  // Four layouts from one system.
  templates: `<rect x="10" y="6" width="20" height="16" rx="2" ${line}/><rect x="34" y="6" width="20" height="16" rx="2" ${line}/><rect x="10" y="26" width="20" height="16" rx="2" ${line}/><rect x="34" y="26" width="20" height="16" rx="2" ${line}/><rect x="13" y="9" width="8" height="3" rx="1" fill="${V}"/><rect x="37" y="9" width="8" height="3" rx="1" fill="${V}"/><rect x="13" y="29" width="8" height="3" rx="1" fill="${V}"/><rect x="37" y="29" width="8" height="3" rx="1" fill="${S}"/>`,
  // A letterhead with a business card on it.
  stationery: `<rect x="12" y="4" width="26" height="36" rx="2" ${line}/><circle cx="18" cy="10" r="2.5" fill="${V}"/><line x1="17" y1="18" x2="33" y2="18" ${line}/><line x1="17" y1="23" x2="31" y2="23" ${line}/><rect x="28" y="27" width="26" height="16" rx="2" fill="#11111f" stroke="currentColor" stroke-width="1.6"/><circle cx="34" cy="33" r="2.5" fill="${S}"/><line x1="39" y1="33" x2="49" y2="33" ${line}/><line x1="33" y1="38" x2="45" y2="38" ${line}/>`,
  // A megaphone and its sound.
  campaign: `<path d="M12 20 H20 L40 9 V39 L20 28 H12 Z" ${line}/><path d="M18 28 L21 38 H26 L24 29" ${line}/><path d="M46 17 C49 20 49 28 46 31" fill="none" stroke="${V}" stroke-width="1.8" stroke-linecap="round"/><path d="M51 12 C57 18 57 30 51 36" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/>`,
  // A phone with a grid of posts.
  social: `<rect x="21" y="3" width="22" height="42" rx="4" ${line}/><line x1="29" y1="7" x2="35" y2="7" ${line}/><rect x="24.5" y="11" width="7" height="7" rx="1" fill="${V}"/><rect x="32.5" y="11" width="7" height="7" rx="1" fill="${S}" fill-opacity=".8"/><rect x="24.5" y="19.5" width="7" height="7" rx="1" ${line}/><rect x="32.5" y="19.5" width="7" height="7" rx="1" fill="${V}" fill-opacity=".6"/><rect x="24.5" y="28" width="15" height="11" rx="1" ${line}/>`,
  // A billboard on its posts.
  ads: `<rect x="6" y="6" width="52" height="24" rx="2" ${line}/><circle cx="18" cy="18" r="6" fill="${V}"/><line x1="29" y1="14" x2="50" y2="14" ${line}/><rect x="29" y="19" width="14" height="5" rx="1.5" fill="${S}" fill-opacity=".85"/><line x1="20" y1="30" x2="20" y2="44" ${line}/><line x1="44" y1="30" x2="44" y2="44" ${line}/>`,
  // A browser window with a hero block.
  website: `<rect x="6" y="6" width="52" height="36" rx="3" ${line}/><line x1="6" y1="13" x2="58" y2="13" ${line}/><circle cx="11" cy="9.5" r="1" fill="currentColor"/><circle cx="15" cy="9.5" r="1" fill="currentColor"/><circle cx="19" cy="9.5" r="1" fill="currentColor"/><rect x="11" y="17" width="42" height="11" rx="1.5" fill="${V}" fill-opacity=".85"/><line x1="11" y1="33" x2="30" y2="33" ${line}/><line x1="11" y1="37" x2="24" y2="37" ${line}/><rect x="40" y="32" width="13" height="6" rx="1.5" fill="${S}" fill-opacity=".85"/>`,
  // A one-pager with a key figure and a signed-off tick.
  sales: `<rect x="16" y="4" width="28" height="40" rx="2" ${line}/><rect x="20" y="9" width="12" height="9" rx="1.5" fill="${V}"/><line x1="35" y1="11" x2="40" y2="11" ${line}/><line x1="35" y1="16" x2="40" y2="16" ${line}/><line x1="20" y1="24" x2="40" y2="24" ${line}/><line x1="20" y1="29" x2="36" y2="29" ${line}/><circle cx="46" cy="37" r="7" fill="${S}"/><path d="M42.5 37 L45 39.5 L49.5 34.5" fill="none" stroke="#0b0b16" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  // A crowd, and the message reaching them.
  awareness: `<circle cx="16" cy="32" r="4" ${line}/><path d="M9 44 C9 38 23 38 23 44" ${line}/><circle cx="32" cy="30" r="4.5" fill="${V}"/><path d="M24 44 C24 37 40 37 40 44" fill="${V}" fill-opacity=".35" stroke="none"/><circle cx="48" cy="32" r="4" ${line}/><path d="M41 44 C41 38 55 38 55 44" ${line}/><path d="M24 15 C28 9 36 9 40 15" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/><path d="M19 10 C26 1 38 1 45 10" fill="none" stroke="${S}" stroke-width="1.6" stroke-linecap="round" opacity=".6"/>`,
  // A film frame and play.
  film: `<rect x="6" y="8" width="52" height="32" rx="3" ${line}/><line x1="6" y1="14" x2="58" y2="14" ${line}/><line x1="6" y1="34" x2="58" y2="34" ${line}/><line x1="13" y1="8" x2="13" y2="14" ${line}/><line x1="21" y1="8" x2="21" y2="14" ${line}/><line x1="43" y1="34" x2="43" y2="40" ${line}/><line x1="51" y1="34" x2="51" y2="40" ${line}/><path d="M28 19 L38 24 L28 29 Z" fill="${V}"/>`,
  // A cube with motion trails.
  motion: `<path d="M34 8 L50 16 V32 L34 40 L18 32 V16 Z" ${line}/><path d="M18 16 L34 24 L50 16" ${line}/><line x1="34" y1="24" x2="34" y2="40" ${line}/><path d="M34 24 L50 16 V32 L34 40 Z" fill="${V}" fill-opacity=".55" stroke="none"/><line x1="4" y1="20" x2="12" y2="20" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/><line x1="7" y1="26" x2="13" y2="26" stroke="${S}" stroke-width="1.8" stroke-linecap="round" opacity=".7"/><line x1="4" y1="32" x2="12" y2="32" stroke="${S}" stroke-width="1.8" stroke-linecap="round" opacity=".45"/>`,
  // An app screen: cards and a switch.
  ux: `<rect x="20" y="3" width="24" height="42" rx="4" ${line}/><rect x="24" y="9" width="16" height="9" rx="2" fill="${V}" fill-opacity=".85"/><rect x="24" y="21" width="16" height="6" rx="1.5" ${line}/><rect x="24" y="30" width="10" height="5" rx="2.5" fill="${S}"/><circle cx="31.5" cy="32.5" r="1.8" fill="#0b0b16"/><line x1="29" y1="40" x2="35" y2="40" ${line}/><path d="M50 18 L50 30 L53 27 L56 33" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`,
  // An exhibition booth: back wall, banner, counter.
  events: `<path d="M8 40 V10 H56 V40" ${line}/><rect x="14" y="14" width="36" height="9" rx="1.5" fill="${V}"/><rect x="22" y="29" width="20" height="11" rx="1" ${line}/><line x1="4" y1="40" x2="60" y2="40" ${line}/><circle cx="12" cy="33" r="2.5" fill="${S}"/><circle cx="52" cy="33" r="2.5" fill="${S}"/>`,
  // A wayfinding post with signs.
  signage: `<line x1="22" y1="6" x2="22" y2="44" ${line}/><line x1="15" y1="44" x2="29" y2="44" ${line}/><path d="M22 9 H48 L54 14 L48 19 H22 Z" fill="${V}"/><path d="M22 23 H46 L52 28 L46 33 H22 Z" ${line}/><path d="M22 23 H12 L7 28 L12 33 H22" fill="${S}" fill-opacity=".7" stroke="none"/>`,
  // A box with its label.
  packaging: `<path d="M32 6 L54 15 V36 L32 45 L10 36 V15 Z" ${line}/><path d="M10 15 L32 24 L54 15" ${line}/><line x1="32" y1="24" x2="32" y2="45" ${line}/><path d="M21 10.5 L43 19.5" ${line}/><path d="M15 23 L27 28 V36 L15 31 Z" fill="${V}"/><path d="M38 28 L49 23.5 V26.5 L38 31 Z" fill="${S}" fill-opacity=".8"/>`,

  /* ---- added 2026-10-08: the second six of each capability ---------------- */
  // A slide whose chart breaks out of the frame: the listing story.
  roadshow: `<rect x="6" y="10" width="40" height="27" rx="3" ${line}/><line x1="26" y1="37" x2="26" y2="43" ${line}/><line x1="19" y1="43" x2="33" y2="43" ${line}/><polyline points="12,31 20,25 27,28 36,18 52,5" fill="none" stroke="${V}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M45 5 H52 V12" fill="none" stroke="${V}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="18" r="2.2" fill="${S}"/>`,
  // A screen behind a lectern, the speaker at it.
  keynote: `<rect x="12" y="4" width="40" height="21" rx="2" ${line}/><rect x="17" y="9" width="15" height="4" rx="1" fill="${V}"/><line x1="17" y1="18" x2="40" y2="18" ${line}/><circle cx="26" cy="30" r="3.2" fill="${S}"/><path d="M18 37 H34 L32 45 H20 Z" ${line}/><path d="M31 37 L35 31" ${line}/>`,
  // A report with a leaf on its cover.
  esg: `<path d="M19 4 H39 L46 11 V44 H19 Z" ${line}/><path d="M39 4 V11 H46" ${line}/><path d="M25 31 C25 21 32 15 41 15 C41 25 34 31 25 31 Z" fill="${S}" fill-opacity=".85"/><path d="M26 30 L36 20" fill="none" stroke="#0b0b16" stroke-width="1.4" stroke-linecap="round"/><line x1="24" y1="38" x2="41" y2="38" ${line}/>`,
  // A report, and the people it is for.
  stakeholder: `<rect x="12" y="4" width="28" height="32" rx="2" ${line}/><rect x="16" y="9" width="13" height="4" rx="1" fill="${V}"/><line x1="16" y1="18" x2="35" y2="18" ${line}/><line x1="16" y1="23" x2="31" y2="23" ${line}/><circle cx="38" cy="39" r="4.5" fill="${V}"/><circle cx="47" cy="39" r="4.5" fill="${S}" fill-opacity=".85"/><circle cx="56" cy="39" r="4.5" ${line}/>`,
  // A page with its picture, and the result going up.
  casestudy: `<rect x="14" y="4" width="34" height="40" rx="2" ${line}/><rect x="18" y="8" width="26" height="12" rx="1.5" fill="${V}" fill-opacity=".8"/><line x1="18" y1="26" x2="44" y2="26" ${line}/><line x1="18" y1="31" x2="34" y2="31" ${line}/><line x1="18" y1="36" x2="31" y2="36" ${line}/><circle cx="46" cy="37" r="7" fill="${S}"/><path d="M46 40.5 V33.5 M43 36.5 L46 33.5 L49 36.5" fill="none" stroke="#0b0b16" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  // A magnifier over the numbers.
  research: `<path d="M8 41 H34" ${line}/><rect x="10" y="29" width="5" height="10" rx="1" fill="${S}" fill-opacity=".75"/><rect x="18" y="23" width="5" height="16" rx="1" ${line}/><circle cx="38" cy="19" r="11" ${line}/><polyline points="31,22 35,18 39,20 44,14" fill="none" stroke="${V}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="46" y1="27" x2="55" y2="36" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`,
  // The parent brand and the three beneath it.
  architecture: `<rect x="25" y="4" width="14" height="10" rx="2" fill="${V}"/><path d="M32 14 V22 M14 22 H50 M14 22 V31 M32 22 V31 M50 22 V31" ${line}/><rect x="7" y="31" width="14" height="10" rx="2" ${line}/><rect x="25" y="31" width="14" height="10" rx="2" fill="${S}" fill-opacity=".8"/><rect x="43" y="31" width="14" height="10" rx="2" ${line}/>`,
  // A speech bubble with the line in it, and the reply.
  messaging: `<path d="M11 5 H43 Q46 5 46 8 V26 Q46 29 43 29 H24 L15 37 L17 29 H11 Q8 29 8 26 V8 Q8 5 11 5 Z" ${line}/><rect x="13" y="10" width="18" height="4" rx="1" fill="${V}"/><line x1="13" y1="19" x2="40" y2="19" ${line}/><line x1="13" y1="24" x2="32" y2="24" ${line}/><path d="M41 33 H54 Q56 33 56 35 V41 Q56 43 54 43 H51 L53 47 L47 43 H41 Q39 43 39 41 V35 Q39 33 41 33 Z" fill="${S}" fill-opacity=".8"/>`,
  // The mark, turned around.
  rebrand: `<rect x="26" y="18" width="12" height="12" rx="2" fill="${V}"/><path d="M15 21 A17 17 0 0 1 46 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M47 6 L47 14 L39 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M49 27 A17 17 0 0 1 18 35" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/><path d="M17 42 L17 34 L25 34" fill="none" stroke="${S}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`,
  // A folder of images.
  assets: `<path d="M6 11 H22 L26 15 H58 V42 H6 Z" ${line}/><rect x="11" y="21" width="13" height="13" rx="1.5" fill="${V}"/><rect x="26" y="21" width="13" height="13" rx="1.5" fill="${S}" fill-opacity=".8"/><rect x="41" y="21" width="13" height="13" rx="1.5" ${line}/><path d="M43 31 L46.5 26.5 L49 29 L50.5 27.5 L52.5 31" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  // A shield with a tick.
  compliance: `<path d="M32 4 L50 10 V23 C50 34 42 41 32 45 C22 41 14 34 14 23 V10 Z" ${line}/><path d="M23.5 24 L29.5 30 L41 17.5" fill="none" stroke="${V}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="38" r="3" fill="${S}"/>`,
  // A T-shirt with the mark on it.
  merch: `<path d="M22 6 L12 11 L6 20 L13 24 L17 19 V43 H47 V19 L51 24 L58 20 L52 11 L42 6 C40 10 36 12 32 12 C28 12 24 10 22 6 Z" ${line}/><circle cx="32" cy="24" r="5" fill="${V}"/><rect x="27" y="32" width="10" height="3" rx="1" fill="${S}" fill-opacity=".85"/>`,
  // An open kit: a document and a phone on their way out.
  gtm: `<path d="M10 22 H54 V42 H10 Z" ${line}/><path d="M10 22 L5 15 M54 22 L59 15" ${line}/><rect x="19" y="5" width="11" height="14" rx="1.5" fill="${V}"/><rect x="34" y="8" width="9" height="13" rx="2" fill="${S}" fill-opacity=".8"/><line x1="24" y1="32" x2="40" y2="32" ${line}/>`,
  // A clipboard checklist.
  playbook: `<rect x="14" y="7" width="32" height="38" rx="3" ${line}/><rect x="24" y="4" width="12" height="6" rx="1.5" fill="${V}"/><path d="M19 18.5 L21.5 21 L25.5 16" fill="none" stroke="${S}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><line x1="29" y1="19" x2="41" y2="19" ${line}/><path d="M19 27.5 L21.5 30 L25.5 25" fill="none" stroke="${S}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/><line x1="29" y1="28" x2="41" y2="28" ${line}/><rect x="19.5" y="34" width="5" height="5" rx="1" ${line}/><line x1="29" y1="37" x2="38" y2="37" ${line}/>`,
  // A vertical video, playing.
  reel: `<rect x="21" y="3" width="22" height="42" rx="4" ${line}/><path d="M29 17 L38 22.5 L29 28 Z" fill="${V}"/><line x1="25.5" y1="37" x2="38.5" y2="37" ${line} opacity=".45"/><line x1="25.5" y1="37" x2="31" y2="37" stroke="${S}" stroke-width="2" stroke-linecap="round"/><line x1="7" y1="17" x2="15" y2="17" stroke="${S}" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="23" x2="15" y2="23" stroke="${S}" stroke-width="1.8" stroke-linecap="round" opacity=".7"/><line x1="7" y1="29" x2="15" y2="29" stroke="${S}" stroke-width="1.8" stroke-linecap="round" opacity=".45"/>`,
  // A camera.
  artdirection: `<rect x="8" y="14" width="48" height="28" rx="4" ${line}/><path d="M22 14 L25 8 H39 L42 14" ${line}/><circle cx="32" cy="28" r="9" ${line}/><circle cx="32" cy="28" r="5" fill="${V}"/><rect x="46" y="18" width="5" height="3" rx="1" fill="${S}"/>`,
  // A menu card: items and their prices.
  menu: `<rect x="16" y="4" width="32" height="40" rx="2" ${line}/><rect x="24" y="9" width="16" height="4" rx="1" fill="${V}"/><line x1="21" y1="20" x2="35" y2="20" ${line}/><circle cx="42" cy="20" r="1.8" fill="${S}"/><line x1="21" y1="27" x2="33" y2="27" ${line}/><circle cx="42" cy="27" r="1.8" fill="${S}"/><line x1="21" y1="34" x2="36" y2="34" ${line}/><circle cx="42" cy="34" r="1.8" fill="${S}"/>`,
  // People together, and the heart of it.
  outreach: `<path d="M32 17 C27.5 14 26 11 28 8.5 C29.5 6.8 31.2 7.6 32 9 C32.8 7.6 34.5 6.8 36 8.5 C38 11 36.5 14 32 17 Z" fill="${S}"/><circle cx="15" cy="29" r="4" ${line}/><path d="M8 44 C8 38 22 38 22 44" ${line}/><circle cx="32" cy="27" r="4.5" fill="${V}"/><path d="M24 44 C24 37 40 37 40 44" fill="${V}" fill-opacity=".35" stroke="none"/><circle cx="49" cy="29" r="4" ${line}/><path d="M42 44 C42 38 56 38 56 44" ${line}/>`,
  // A screen with the idea lit up, and the progress bar.
  explainer: `<rect x="6" y="8" width="52" height="32" rx="3" ${line}/><circle cx="21" cy="20" r="6" fill="${V}"/><path d="M18.5 28.5 H23.5 M19.5 31.5 H22.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><line x1="33" y1="17" x2="50" y2="17" ${line}/><line x1="33" y1="23" x2="45" y2="23" ${line}/><line x1="12" y1="35" x2="52" y2="35" ${line} opacity=".45"/><line x1="12" y1="35" x2="28" y2="35" stroke="${S}" stroke-width="2" stroke-linecap="round"/>`,
  // A shape travelling an arc, with its trail.
  motion2d: `<path d="M8 40 C19 6 45 6 56 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="1.5 4" stroke-linecap="round" opacity=".7"/><circle cx="14" cy="27" r="3.5" ${line} opacity=".35"/><circle cx="21" cy="18" r="4.5" ${line} opacity=".6"/><circle cx="33" cy="14" r="6" fill="${V}"/><rect x="48" y="24" width="10" height="10" rx="2" fill="${S}" fill-opacity=".85" transform="rotate(20 53 29)"/>`,
  // A kiosk, and someone touching it.
  activation: `<rect x="12" y="4" width="24" height="30" rx="2" ${line}/><path d="M24 34 V44 M17 44 H31" ${line}/><rect x="16" y="8" width="16" height="10" rx="1" fill="${V}" fill-opacity=".85"/><circle cx="31" cy="26" r="2" fill="${S}"/><circle cx="31" cy="26" r="5" fill="none" stroke="${S}" stroke-width="1.4" opacity=".6"/><circle cx="50" cy="20" r="4" ${line}/><path d="M43 44 C43 33 57 33 57 44" ${line}/><path d="M45 31 L35 27" ${line}/>`,
  // A stage under its screen and lights.
  stage: `<path d="M4 4 L14 32 H21 Z" fill="${S}" fill-opacity=".22"/><path d="M60 4 L50 32 H43 Z" fill="${S}" fill-opacity=".22"/><rect x="16" y="6" width="32" height="18" rx="1.5" ${line}/><rect x="20" y="10" width="24" height="10" rx="1" fill="${V}" fill-opacity=".85"/><path d="M4 38 H60 M9 38 L13 32 H51 L55 38" ${line}/><line x1="12" y1="38" x2="12" y2="44" ${line}/><line x1="52" y1="38" x2="52" y2="44" ${line}/>`,
  // A room, its back wall carrying the brand.
  environment: `<rect x="16" y="9" width="32" height="25" ${line}/><path d="M4 4 L16 9 M60 4 L48 9 M4 44 L16 34 M60 44 L48 34" ${line}/><circle cx="27" cy="21.5" r="7" fill="${V}"/><rect x="37" y="13" width="7" height="17" rx="1" fill="${S}" fill-opacity=".8"/>`,
  // A printed sheet with its colour bar and crop marks.
  print: `<rect x="16" y="9" width="32" height="32" rx="1" ${line}/><circle cx="22" cy="16" r="2.6" fill="${S}"/><circle cx="28.5" cy="16" r="2.6" fill="${V}"/><circle cx="35" cy="16" r="2.6" fill="currentColor" opacity=".55"/><line x1="21" y1="25" x2="43" y2="25" ${line}/><line x1="21" y1="30" x2="40" y2="30" ${line}/><line x1="21" y1="35" x2="34" y2="35" ${line}/><path d="M8 9 H12 M16 2 V5 M52 9 H56 M48 2 V5 M8 41 H12 M16 45 V48 M52 41 H56 M48 45 V48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`,
};

/** One deliverable tile as HTML: for the home page, which is HTML. */
export function deliverableTileHtml(d: Deliverable) {
  return (
    `<li class="dl-tile"><span class="dl-glyph" aria-hidden="true">` +
    `<svg viewBox="0 0 64 48" width="64" height="48" focusable="false">${GLYPHS[d.glyph]}</svg>` +
    `</span><span class="dl-name">${d.name.replace(/&/g, "&amp;")}</span></li>`
  );
}

/** The intake form's service options: the four capabilities, and a way out. */
export const SERVICE_OPTIONS = [...CAPABILITIES.map((c) => c.name), "Not sure yet"];
