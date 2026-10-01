/* ===========================================================================
 * The portfolio: one entry per case study.
 * ---------------------------------------------------------------------------
 * Every case study is rendered by the same template (components/case/*), in
 * the format Arun designed for Pivo: a brief told as a slider, a reveal, the
 * palette, the artwork, the product, the campaign, and the work in context.
 * Adding a project is adding an entry here plus its images under
 * public/work/<slug>/. No new page code.
 *
 * This list drives, from one place:
 *   /portfolio/            the index
 *   /portfolio/<slug>/     each case study (static params come from here)
 *   the home page slider   serialised into the page for Arun's ui.js
 *   sitemap.xml, llms.txt and the structured data
 *
 * ORDER MATTERS: it is the order of the index, the home slider, and the
 * previous / next arrows inside a case study.
 *
 * WHAT REPLACED WHAT. This file used to hold four invented clients (Aura Pay,
 * Nexus AI, Lumen Edu, Vanguard Bio) inherited from Arun's first build. They
 * were placeholders and were never to be published as work. They are gone.
 *
 * HONESTY RULE, carried forward: `kind` says what the work actually was. Pivo
 * is a concept brand pitch made for a real client, so it says so, on the
 * index, the slider and the case study. The client is not named.
 * ======================================================================== */

/* ---- theme -------------------------------------------------------------- */

/** A case study wears its own brand, not Gravino's. */
export type CaseTheme = {
  /** Display face for story headings and campaign-style type. */
  display: { family: string; src?: string };
  /** Reading face for everything else. No `src` means a system face. */
  body: { family: string; src?: string };
  /** Page ground behind the 1080px column. */
  ground: string;
  /** The colour story headings are set in. */
  accent: string;
  /** Soft warm colour for intro copy on dark grounds. */
  glow: string;
};

/* ---- sections, in the order Arun's format tells them --------------------- */

export type BriefSlide =
  | { kind: "ask"; title: string[]; label: string; body: string }
  | {
      kind: "story";
      heading?: string[];
      paragraphs: string[];
      image: string;
      mobileImage: string;
      /** Darken behind the text, for images too busy to read over. */
      shade?: boolean;
      alt: string;
    };

export type Section =
  | { type: "brief"; slides: BriefSlide[] }
  | {
      type: "reveal";
      intro: string;
      introLine: string;
      logo: { src: string; alt: string };
      landscape: { src: string; alt: string };
      /** A disc behind the landscape, if the art calls for one. */
      moon?: { color: string };
      ground: string;
    }
  | {
      type: "palette";
      swatches: { name: string; meaning: string; color: string; ink: string }[];
    }
  | { type: "artwork"; image: { src: string; alt: string }; ground: string }
  | {
      type: "products";
      /** Top and bottom colours of the split band behind the products. */
      split: [string, string];
      /** Caption colour. The captions sit on the lower colour of the split. */
      ink?: string;
      items: { src: string; alt: string; width: number; caption: string[] }[];
    }
  | { type: "gallery"; ground: string; items: { src: string; alt: string }[] }
  | { type: "scene"; image: { src: string; alt: string } };

export type CaseStudy = {
  slug: string;
  title: string;
  /** What the work actually was. Shown everywhere the project appears. */
  kind: string;
  /** One or two lines: the index card, the home slider, the meta description. */
  summary: string;
  disciplines: string[];
  /** 0.72 portrait: the home slider's thumbnail card. */
  thumb: string;
  /** Landscape: the home slider's full-bleed stage. */
  stage: { src: string; position?: string };
  /** Landscape: the portfolio index card. */
  cover: string;
  theme: CaseTheme;
  sections: Section[];
};

/* ---- the work ------------------------------------------------------------ */

const PIVO = "/work/pivo";

export const CASES: CaseStudy[] = [
  {
    slug: "pivo",
    title: "Pivo",
    kind: "Concept brand pitch",
    summary:
      "A Russian-inspired premium beer brand for the Indian market: the story, the identity, the packaging and the launch campaign.",
    disciplines: ["Brand identity", "Packaging", "Campaign"],
    // Thumbnail: the product (Arun's Pivo_Thumb). Stage: the Russian culture
    // illustration, not the product (the client, 2026-10-01); the same art as
    // the cover, so the case study has it cached.
    thumb: `${PIVO}/thumb.webp`,
    stage: { src: `${PIVO}/cover.webp`, position: "center" },
    cover: `${PIVO}/cover.webp`,
    theme: {
      display: { family: "Pivo Russian", src: `${PIVO}/fonts/russian.ttf` },
      /* Georgia, deliberately. Arun's page names Schadow BT, but the file in
         his repo is a subset extracted from a PDF with no cmap or post table,
         so every browser rejects it and his page has always rendered in its
         Georgia fallback (measured: document.fonts reports "error" on his
         page and ours). Georgia is therefore the faithful match, and it
         removes the licensing question for a commercial Bitstream face. To
         use real Schadow BT, buy a web licence and add its `src` here. */
      body: { family: "Georgia" },
      ground: "#000000",
      accent: "#ef5519",
      glow: "#fad794",
    },
    sections: [
      {
        type: "brief",
        slides: [
          {
            kind: "ask",
            title: ["Bringing Russian", "heritage into a", "contemporary beer brand."],
            label: "The Client Ask",
            body: "The brief was to create a Russian-inspired premium beer brand with a distinctive identity, packaging and visual world.",
          },
          {
            kind: "story",
            heading: ["The story begins", "in Russia…"],
            paragraphs: [
              "As early as the 9th century, when Slavic communities gathered, they crafted their own brews: golden, rich, and deeply tied to their way of life.",
            ],
            image: `${PIVO}/story-1.webp`,
            mobileImage: `${PIVO}/story-1-mobile.webp`,
            alt: "A Slavic village gathering at dusk, with brewing and smoke rising from the huts.",
          },
          {
            kind: "story",
            paragraphs: [
              "By the 16th century, under Tsar Ivan the Terrible, brewing had become more than craft. It was culture.",
              // Arun's copy, with "tahe" corrected and punctuation tidied at the
              // client's request (2026-09-29).
              "Villages perfected their recipes, families passed down traditions, and great festivals echoed with laughter, music, and the clinking of mugs.",
            ],
            image: `${PIVO}/story-2.webp`,
            mobileImage: `${PIVO}/story-2-mobile.webp`,
            alt: "Villagers sharing drinks outside thatched log houses in 16th-century Russia.",
          },
          {
            kind: "story",
            heading: ["It was more than", "refreshment.", "It was culture."],
            paragraphs: [
              "A bond shared at family tables, in Moscow’s bustling taverns, and during great Russian festivals.",
              "Pivo symbolized friendship, unity, and the warmth of community.",
            ],
            image: `${PIVO}/story-3.webp`,
            mobileImage: `${PIVO}/story-3-mobile.webp`,
            shade: true,
            alt: "A crowded Russian tavern festival, raised mugs and warm lantern light.",
          },
        ],
      },
      {
        type: "reveal",
        intro:
          "From the heart of Russia’s centuries-old brewing culture comes a drink that celebrates friendship, tradition, and togetherness.",
        introLine: "Introducing PIVO: Russia’s cultural beer, now in India.",
        logo: { src: `${PIVO}/logo-white.webp`, alt: "Pivo" },
        landscape: {
          src: `${PIVO}/kremlin.webp`,
          alt: "An illustrated Kremlin skyline above a river, in midnight blue and amber.",
        },
        moon: { color: "#fad794" },
        ground: "#0a2d39",
      },
      {
        type: "palette",
        swatches: [
          { name: "Imperial Charcoal", meaning: "Depth of heritage, richness of roasted malt.", color: "#000000", ink: "#ffffff" },
          { name: "Russian Midnight", meaning: "The deep blue of winter skies and timeless Russian nights.", color: "#0a2d39", ink: "#ffffff" },
          // Charcoal, not Arun's white: white on this orange is 3.5:1, under the
          // 4.5:1 floor. Imperial Charcoal is the palette's own dark (6.0:1).
          { name: "Amber Spirit", meaning: "The warmth of celebration, captured in the glow of amber beer.", color: "#ef5519", ink: "#000000" },
          { name: "Winter Wheat", meaning: "Soft, warm and timeless, inspired by snow, grain and tradition.", color: "#fcd692", ink: "#1a1a1a" },
        ],
      },
      {
        type: "artwork",
        image: { src: `${PIVO}/label.webp`, alt: "The complete Pivo can label, laid out flat." },
        ground: "#0a2d39",
      },
      {
        type: "products",
        split: ["#0a2d39", "#ef5519"],
        // Captions sit on the amber: charcoal for the same reason as the swatch.
        ink: "#000000",
        items: [
          { src: `${PIVO}/can.webp`, alt: "The Pivo premium beer can.", width: 250, caption: ["A can that carries culture.", "PIVO. Bold. Fresh. Russian."] },
          { src: `${PIVO}/bottle.webp`, alt: "The Pivo bottle beside a matryoshka doll.", width: 320, caption: ["From Russia, with layers", "of tradition. The PIVO", "Matryoshka Bottle."] },
        ],
      },
      {
        type: "gallery",
        ground: "#f7e5be",
        items: [
          { src: `${PIVO}/poster-1.webp`, alt: "Launch poster: Introducing Pivo, Russia’s cultural beer." },
          { src: `${PIVO}/poster-2.webp`, alt: "Campaign poster: Russia’s legacy, brewed for today." },
        ],
      },
      {
        type: "scene",
        image: { src: `${PIVO}/bar.webp`, alt: "Pivo cans and bottles on ice at a bar, with the launch poster lit behind." },
      },
    ],
  },
];

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug);
}

/** Neighbours for the previous / next arrows. Null when there is no other. */
export function neighbours(slug: string) {
  const i = CASES.findIndex((c) => c.slug === slug);
  if (i < 0 || CASES.length < 2) return { prev: null, next: null, index: i, total: CASES.length };
  return {
    prev: CASES[(i - 1 + CASES.length) % CASES.length],
    next: CASES[(i + 1) % CASES.length],
    index: i,
    total: CASES.length,
  };
}
