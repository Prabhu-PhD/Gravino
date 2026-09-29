import { ARUN_SECTIONS_HTML } from "@/content/arun-sections";
import { CASES } from "@/lib/work";

/* ===========================================================================
 * The downstream sections, injected as his markup rather than rebuilt in JSX.
 * ---------------------------------------------------------------------------
 * This is a server component, so the markup is in the initial HTML response -
 * it is not client-rendered, and it stays crawlable.
 *
 * `display: contents` on the wrapper is deliberate. React needs a single
 * element to hang the injected HTML on, but his sections are written as
 * direct children of <body>; a wrapper that generated a box would become
 * their containing block and change how the sticky and absolutely positioned
 * pieces inside them resolve. `contents` removes the box and leaves the
 * sections laid out as though the wrapper were not there.
 *
 * THE PORTFOLIO SLIDER is filled here from src/lib/work.ts, the same list the
 * portfolio pages use. The first project is written straight into the HTML
 * (so crawlers and no-JS visitors see real work, not a placeholder), and the
 * whole list is serialised into #portfolioData for ui.js to page through.
 * ======================================================================== */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Arun's title treatment: first word plain, the rest in the brand gradient. */
function titleHtml(title: string) {
  const [first, ...rest] = title.split(" ");
  const tail = rest.join(" ");
  return tail
    ? `${esc(first)} <span class="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1 inline-block">${esc(tail)}</span>`
    : esc(first);
}

const projects = CASES.map((c) => ({
  title: c.title,
  kind: c.kind,
  desc: c.summary,
  image: c.stage.src,
  position: c.stage.position ?? "center",
  thumb: c.thumb,
  href: `/portfolio/${c.slug}/`,
}));

const first = projects[0];

const HTML = ARUN_SECTIONS_HTML.replace("{{PORTFOLIO_STAGE}}", esc(first.image))
  .replace("{{PORTFOLIO_STAGE_POS}}", esc(first.position))
  .replace("{{PORTFOLIO_KIND}}", esc(first.kind))
  .replace("{{PORTFOLIO_TITLE_HTML}}", titleHtml(first.title))
  .replace("{{PORTFOLIO_SUMMARY}}", esc(first.desc))
  .replace("{{PORTFOLIO_HREF}}", esc(first.href))
  .replace("{{PORTFOLIO_TITLE_TEXT}}", esc(first.title))
  // JSON inside a <script>: escape "<" so no value can close the tag.
  .replace("{{PORTFOLIO_DATA}}", JSON.stringify(projects).replace(/</g, "\u003c"));

export function ArunSections() {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: HTML }} />;
}
