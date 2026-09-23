/* ===========================================================================
 * The portfolio.
 * ---------------------------------------------------------------------------
 * ⚠ PLACEHOLDER CONTENT. Every client below came from Arun's build and is
 * invented. The client has seen them, knows they are placeholders, and is
 * sending the real four. THEY MUST BE REPLACED BEFORE THE SITE IS PUBLIC:
 * fabricated case studies on an agency site are not a rough edge, they are a
 * claim about work that was never done.
 *
 * What IS real here is the shape. Each entry is a story in four beats,
 * because that is the order a buyer reads a case study in:
 *
 *   situation  what was at stake, and why it was hard
 *   approach   what we actually did about it
 *   made       the deliverables, so the scope is legible
 *   outcome    what changed
 *
 * `outcome` is deliberately modest in the placeholders. Inventing a metric
 * ("raised $40M", "conversion up 300%") would be a different and worse kind
 * of lie than a made-up client name, and it is the first thing a real
 * prospect would ask us to substantiate. When the real work arrives, this is
 * the field that needs evidence behind it.
 * ======================================================================== */

export type Work = {
  n: string;
  name: string;
  sector: string;
  year: string;
  /** One line, the hook. */
  summary: string;
  situation: string;
  approach: string;
  made: string[];
  outcome: string;
  image: string;
};

export const WORKS: Work[] = [
  {
    n: "01",
    name: "Aura Pay",
    sector: "Payments infrastructure",
    year: "2025",
    summary:
      "A security model only engineers understood, in front of investors who were not engineers.",
    situation:
      "The product's advantage was its authentication and clearing architecture. The people deciding whether to fund it were not going to read an architecture diagram, and the existing deck asked them to.",
    approach:
      "We moved the technical proof out of the narrative and into an appendix, and rebuilt the front of the deck around what the architecture lets a bank do that it could not do before. The engineering did not get simpler; it stopped being the opening argument.",
    made: ["Investor deck", "Technical appendix", "Data room one-pagers"],
    outcome: "Taken into investor meetings as the primary document.",
    image: "/assets/portfolio-1.jpg",
  },
  {
    n: "02",
    name: "Nexus AI",
    sector: "Enterprise software",
    year: "2025",
    summary:
      "Every board pack said something different because every team built its own.",
    situation:
      "Reporting was assembled by four teams in four formats. By the time it reached the board it read as four companies, and the meeting was spent reconciling numbers rather than deciding with them.",
    approach:
      "We built one reporting system: fixed chart grammar, a fixed order of argument, and templates the teams could actually use without a designer. The constraint was that it had to survive being edited by non-designers under deadline.",
    made: ["Board reporting system", "Chart library", "Editable templates"],
    outcome: "One pack, assembled by four teams, in one voice.",
    image: "/assets/portfolio-2.jpg",
  },
  {
    n: "03",
    name: "Lumen Edu",
    sector: "Education",
    year: "2024",
    summary:
      "A curriculum that worked in the room and fell apart on the page.",
    situation:
      "The teaching was the product and it was good. The printed and digital material did not carry it: dense, unsequenced, and written for the people who made it rather than the people learning from it.",
    approach:
      "We rebuilt the material around the sequence a learner moves through, not the structure the syllabus was written in, and set a typographic system that holds at both A4 and phone width.",
    made: ["Curriculum design system", "Print and digital layouts", "Brand refresh"],
    outcome: "One system across print, web and classroom.",
    image: "/assets/portfolio-3.jpg",
  },
  {
    n: "04",
    name: "Vanguard Bio",
    sector: "Life sciences",
    year: "2024",
    summary:
      "Genomic data that clinicians had to decode before they could use it.",
    situation:
      "The science was sound and the output was a wall of sequencing data. Clinicians were doing interpretation work the material should have done for them, which is slow and is where mistakes live.",
    approach:
      "We designed the read, not the chart: what a clinician needs first, what they need next, and what belongs in a footnote. Visual hierarchy did the triage that people were doing manually.",
    made: ["Data visualisation system", "Clinical reporting templates", "Scientific poster suite"],
    outcome: "Findings readable at a glance, detail still one level down.",
    image: "/assets/portfolio-4.jpg",
  },
];
