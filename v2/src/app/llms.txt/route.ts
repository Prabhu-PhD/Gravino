/* ===========================================================================
 * /llms.txt -- a plain-language summary of Gravino for AI engines.
 * ---------------------------------------------------------------------------
 * Follows the llms.txt convention (llmstxt.org): a title, a one-paragraph
 * summary, then sections of links with one-line descriptions. Retrieval
 * crawlers use it to understand a site without parsing its layout.
 *
 * Generated from src/lib/site.ts at build time rather than written by hand,
 * so it cannot drift from what the pages say. `force-static` makes the export
 * write it to out/llms.txt, the same way robots.txt and sitemap.xml are made.
 *
 * Every fact here is one the live site already states in visible copy.
 * Deliberately left out, for the same reasons as the structured data in
 * src/lib/seo.ts: the team (hidden at the client's request), years of
 * experience (unconfirmed). The portfolio IS listed: it now holds only real
 * work, each case study labelled with what it actually was (e.g. a concept
 * brand pitch), and the client is not named.
 * ======================================================================== */

import { SITE, GROUPS, EMBEDDED, MARKETS } from "@/lib/site";
import { CASES } from "@/lib/work";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-static";

const url = (path: string) => new URL(path, SITE_URL).toString();

export function GET() {
  const lines: string[] = [];
  const add = (...l: string[]) => lines.push(...l);

  add(
    `# ${SITE.name}`,
    "",
    `> ${SITE.name} is an embedded business communications partner based in ${SITE.location}. One senior team handles the communication a business is judged by: investor and board presentations, annual and ESG reports, brand, motion and campaigns. It works as part of a client's team, alongside their leadership, marketing team and agency, rather than as another supplier to brief.`,
    "",
    "## Key facts",
    "",
    `- Location: ${SITE.location}.`,
    `- Markets: ${MARKETS.join(", ")}.`,
    `- Contact: ${SITE.email}, or the form at ${url("/contact/")}.`,
    "- Starting a project: the form at /contact/ asks for the service, timeline, budget range and project details; Gravino replies within a working day with questions, an approach and a next step.",
    "- Engagements: a defined project when the scope is clear, or a retainer when the work is continuous.",
    "- Ownership: files and full copyright transfer to the client on completion.",
    "- Confidentiality: material a client shares stays confidential.",
    "",
    "## What embedded means",
    "",
    ...EMBEDDED.points.map((p) => `- ${p.title}: ${p.body}`),
    "",
    "## Services",
    "",
  );

  for (const g of GROUPS) {
    add(`### ${g.name}`, "", g.premise, "");
    for (const d of g.disciplines) {
      add(`- ${d.kind}: ${d.items.join(", ")}.`);
    }
    add("");
  }

  add(
    "## Pages",
    "",
    `- [Home](${url("/")}): overview of Gravino and its capabilities.`,
    `- [Why Gravino](${url("/why-gravino/")}): what working with an embedded business communications partner is like, and where it fits alongside an existing team.`,
    `- [What we cover](${url("/services/")}): the ten disciplines in four groups, with what each produces.`,
    `- [Portfolio](${url("/portfolio/")}): case studies, each told from the brief to the finished work.`,
    ...CASES.map((c) => `- [${c.title}](${url(`/portfolio/${c.slug}/`)}): ${c.kind}. ${c.summary}`),
    `- [Contact](${url("/contact/")}): start a project through the project intake form.`,
    "",
    "## Optional",
    "",
    `- [Privacy Policy](${url("/privacy/")}): what the website collects and how to have it removed.`,
    `- [Terms & Disclaimer](${url("/terms/")}): terms of use, and what a project enquiry commits you to.`,
    "",
  );

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
