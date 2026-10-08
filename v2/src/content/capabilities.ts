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
 * GLYPHS are small line drawings of each deliverable's format, drawn on a
 * 64 x 48 grid: outlines in currentColor (the tile sets it), one violet or
 * sky accent each. Plain SVG strings, because the home page is HTML and the
 * Services page is React; both insert the same markup.
 * ======================================================================== */

export type GlyphKey =
  | "deck" | "board" | "report" | "paper" | "newsletter" | "data"
  | "strategy" | "naming" | "logo" | "guidelines" | "templates" | "stationery"
  | "campaign" | "social" | "ads" | "website" | "sales" | "awareness"
  | "film" | "motion" | "ux" | "events" | "signage" | "packaging";

export type Deliverable = { name: string; glyph: GlyphKey; /** Services page only: one short line. */ note: string };

export type Capability = {
  n: string;
  id: string;
  name: string;
  /** One sentence. Shown on the home page and the Services page. */
  line: string;
  deliverables: Deliverable[];
};

export const CAPABILITIES: Capability[] = [
  {
    n: "01",
    id: "business-communication",
    name: "Business Communication",
    line: "The decks, reports and documents your business is judged by.",
    deliverables: [
      { name: "Investor & pitch decks", glyph: "deck", note: "Built for the hardest question in the room." },
      { name: "Board presentations", glyph: "board", note: "Clear enough to decide on." },
      { name: "Annual & ESG reports", glyph: "report", note: "Dense data, made readable." },
      { name: "Thought leadership", glyph: "paper", note: "Papers a busy reader finishes." },
      { name: "Internal communications", glyph: "newsletter", note: "One story, told inside the company." },
      { name: "Data & infographics", glyph: "data", note: "The insight, impossible to miss." },
    ],
  },
  {
    n: "02",
    id: "brand-identity",
    name: "Brand Identity",
    line: "How your business is recognised, wherever people meet it.",
    deliverables: [
      { name: "Strategy & positioning", glyph: "strategy", note: "The place you own in the market." },
      { name: "Naming", glyph: "naming", note: "Names and brand architecture." },
      { name: "Logo & identity", glyph: "logo", note: "A system, not just a mark." },
      { name: "Brand guidelines", glyph: "guidelines", note: "So it holds without us in the room." },
      { name: "Templates & libraries", glyph: "templates", note: "Every team on-brand, by default." },
      { name: "Stationery & collateral", glyph: "stationery", note: "The brand in people's hands." },
    ],
  },
  {
    n: "03",
    id: "marketing-growth",
    name: "Marketing & Growth",
    line: "The work that takes your story to market, and keeps it there.",
    deliverables: [
      { name: "Launch campaigns", glyph: "campaign", note: "Go-to-market, built to move." },
      { name: "Social content", glyph: "social", note: "Always on, always on-brand." },
      { name: "Ad creative", glyph: "ads", note: "Made for conversion, not impressions." },
      { name: "Websites", glyph: "website", note: "Designed and built." },
      { name: "Sales collateral", glyph: "sales", note: "Decks and one-pagers that close." },
      { name: "Awareness campaigns", glyph: "awareness", note: "Public and social impact work." },
    ],
  },
  {
    n: "04",
    id: "experience-engagement",
    name: "Experience & Engagement",
    line: "Where your brand moves, responds and fills a room.",
    deliverables: [
      { name: "Brand films", glyph: "film", note: "Launch films and explainers." },
      { name: "Motion & 3D", glyph: "motion", note: "2D and 3D motion design." },
      { name: "UX/UI & product", glyph: "ux", note: "Interfaces that feel effortless." },
      { name: "Events & exhibitions", glyph: "events", note: "Booths and stages." },
      { name: "Spatial & signage", glyph: "signage", note: "Environments and wayfinding." },
      { name: "Print & packaging", glyph: "packaging", note: "As considered in hand as on screen." },
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
