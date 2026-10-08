/* ===========================================================================
 * The portfolio: one entry per case study.
 * ---------------------------------------------------------------------------
 * Every case study is rendered by the same template (components/case/*), in
 * the format Arun designed for Pivo: a brief told as a slider, a reveal, the
 * palette, the artwork, the product, the campaign, and the work in context.
 * The Grid added the naming story, the logo on its grounds, typography, a
 * single collateral piece, and a closing sign-off. A project uses whichever
 * sections its story needs, in its own order.
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
 * previous / next arrows inside a case study. The Grid leads (2026-10-08,
 * review): it is client work, and a buyer's first question is "who for?".
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

/**
 * A face for a case study. `src` loads a file shipped with the project;
 * `cssVar` uses one the site already self-hosts through next/font (whose
 * real family name is generated, so it can only be reached by its variable);
 * neither means a system face.
 */
export type CaseFont = { family: string; src?: string; cssVar?: string };

/** A case study wears its own brand, not Gravino's. */
export type CaseTheme = {
  /** Display face for story headings and campaign-style type. */
  display: CaseFont;
  /** Reading face for everything else. No `src` means a system face. */
  body: CaseFont;
  /** Page ground behind the 1080px column. */
  ground: string;
  /** The colour story headings are set in. */
  accent: string;
  /** Soft warm colour for intro copy on dark grounds. */
  glow: string;
  /**
   * How the brand speaks in type. Omitted, it is Pivo's: the client ask in the
   * reading face, labels in plain sentence case. "display" is The Grid's:
   * the ask and section titles in the display face, uppercase, with small
   * tracked uppercase labels in `secondary`. "plain" is Zylo's: sentence-case
   * story headings in a semibold display face, no uppercase anywhere.
   */
  voice?: "display" | "plain";
  /** Label colour under the "display" voice. Defaults to the accent. */
  secondary?: string;
};

/* ---- sections, in the order Arun's format tells them --------------------- */

/** Text in `*asterisks*` inside an ask title is set in the accent colour. */
export type BriefSlide =
  | {
      kind: "ask";
      title: string[];
      label: string;
      body: string;
      logo?: { src: string; alt: string };
      /** CSS background, if not black, and a light rising from its bottom. */
      ground?: string;
      horizon?: string;
    }
  | {
      kind: "story";
      heading?: string[];
      paragraphs: string[];
      image: string;
      mobileImage: string;
      /** Which side the text sits on. Pivo's is the right. */
      side?: "left" | "right";
      /** Text at the top of the slide instead of the bottom (desktop only). */
      valign?: "top";
      /** A CSS background laid over the whole image, e.g. a colour wash. */
      overlay?: string;
      /** Heading colour for this slide, if not the theme accent. */
      headingColor?: string;
      /** Heading size relative to the voice's own, e.g. 0.75. */
      headingScale?: number;
      /**
       * Darken behind the text, for images too busy to read over. A colour
       * tints the fade in that colour instead of black.
       */
      shade?: boolean | string;
      alt: string;
    };

/** A finished image the template places but does not crop. */
export type Picture = { src: string; alt: string; width: number; height: number };

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
      /** `width` is a relative share of the row (default 1). */
      swatches: { name: string; meaning: string; color: string; ink: string; width?: number }[];
      /** Print each colour's hex value under its meaning. */
      showHex?: boolean;
    }
  | { type: "artwork"; image: { src: string; alt: string }; ground: string }
  | {
      type: "products";
      /** Section title above the products, if any. */
      label?: string;
      /** Top and bottom colours of the split band behind the products. */
      split: [string, string];
      /** Caption colour. The captions sit on the lower colour of the split. */
      ink?: string;
      /** False for photographs on their own backdrop, where a drop shadow
          would outline the rectangle rather than the product. */
      shadow?: boolean;
      items: { src: string; alt: string; width: number; caption: string[] }[];
    }
  | {
      type: "gallery";
      ground: string;
      /** Names the section for screen readers. Defaults to "Campaign". */
      label?: string;
      /** A line above the images. */
      intro?: string;
      introColor?: string;
      /** Defaults to 2. */
      columns?: number;
      /** False for flat artwork on a light ground. */
      shadow?: boolean;
      items: { src: string; alt: string; width?: number; height?: number }[];
    }
  | { type: "scene"; image: { src: string; alt: string } }
  /* Added for The Grid (2026-10-07). Each is generic: a project uses the ones
     its story needs, in any order. */
  | {
      /** The name and the line: what each says and why. */
      type: "naming";
      /** CSS background, so a gradient is allowed. */
      ground: string;
      /** A soft light rising from the bottom edge, in this colour. */
      horizon?: string;
      items: { label: string; title: string; body: string }[];
    }
  | {
      /** The mark, what it means, and the mark on each of its grounds. */
      type: "logo";
      label: string;
      logo: Picture;
      body: string;
      ground: string;
      ink: string;
      /** Title colour. Defaults to `ink`. */
      labelColor?: string;
      variants: {
        logo: Picture;
        /** CSS background: a colour, or `url(...) center/cover` for a photo. */
        ground: string;
        /** A dark plate behind the mark, for photographs. */
        plate?: boolean;
      }[];
    }
  | {
      type: "typography";
      label: string;
      ground: string;
      rows: { label: string; sample: string; style: "display" | "sub" | "body" }[];
    }
  | {
      /** One piece of the system shown on its own: an ID card, a ticket. */
      type: "feature";
      label: string;
      caption?: string;
      image: Picture;
      ground: string;
      ink: string;
      /** Label colour. Defaults to the theme's secondary. */
      labelColor?: string;
      frame?: "shadow" | "rounded";
      /** Cap on the displayed width, in px. Defaults to the column. */
      maxWidth?: number;
    }
  | {
      /** A centred positioning line, with the mark beneath it. */
      type: "statement";
      text: string[];
      logo?: Picture;
      /** Displayed logo width in px. */
      logoWidth?: number;
      ground: string;
      ink: string;
    }
  | {
      /** The image style: a brand mark beside a grid of photographs. */
      type: "imagery";
      /** CSS background, so glows are allowed. */
      ground: string;
      mark?: Picture;
      items: Picture[];
    }
  | {
      /** The sign-off: the mark and the line, once more. */
      type: "closing";
      logo: Picture;
      line: string;
      ground: string;
      horizon?: string;
    };

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
  /** Where to anchor the cover when the index card crops it (CSS object-position). */
  coverPosition?: string;
  theme: CaseTheme;
  sections: Section[];
};

/* ---- the work ------------------------------------------------------------ */

const PIVO = "/work/pivo";
const GRID = "/work/the-grid";
const ZYLO = "/work/zylo";

export const CASES: CaseStudy[] = [
  /* The Grid, from TheGrid_Final.zip (2026-10-07): the designer's HTML case
     study, rebuilt in this template. Copy is theirs, with the tagline's full
     stop made consistent and the logo-variant alt texts corrected to the
     grounds they actually sit on. */
  {
    slug: "the-grid",
    title: "The Grid",
    kind: "Brand identity",
    summary:
      "An identity for Chennai’s first fully electric karting club: the name’s story, the line, the mark, and everything it lands on, from tickets to merchandise.",
    disciplines: ["Brand identity", "Collateral", "Merchandise", "Signage"],
    thumb: `${GRID}/thumb.webp`,
    // 80%, not "right": on a phone the stage shows a narrow strip of this
    // landscape, and "right" showed only the helmet's edge. The face sits at
    // about 74% across; 80% keeps it in that strip and changes nothing on a
    // desktop, where nearly the full width is visible.
    stage: { src: `${GRID}/cover.webp`, position: "80% center" },
    cover: `${GRID}/cover.webp`,
    theme: {
      /* Orbitron stands in for the brand's headline face, Seona, which was
         not in the delivered files. The designer's page names Seona first and
         Orbitron as its fallback, so without the file it renders in Orbitron
         too: the faithful match for what was delivered. Self-hosted here
         under the OFL (licence beside the file). To use Seona, add its file
         and a web licence, and point `src` at it. */
      display: { family: "Grid Orbitron", src: `${GRID}/fonts/orbitron.ttf` },
      body: { family: "DM Sans", cssVar: "--font-dm" },
      ground: "#231f20",
      accent: "#CCDB29",
      glow: "#20BBB4",
      voice: "display",
      secondary: "#20BBB4",
    },
    sections: [
      {
        type: "brief",
        slides: [
          {
            kind: "ask",
            logo: { src: `${GRID}/logo-white.webp`, alt: "The Grid Karting Club" },
            ground: "radial-gradient(ellipse at 70% 30%, #0f6a5e 0%, #064c47 40%, #032f2e 100%)",
            horizon: "rgba(204, 219, 41, 0.75)",
            title: ["Chennai’s first", "*fully electric* karting club."],
            label: "The Client Ask",
            body: "Create a brand that makes electric karting feel fast, clean and open to everyone — kids, adults and corporate teams — with an identity that stands apart from every other track in the room.",
          },
          {
            kind: "story",
            heading: ["Karting, the way it", "used to feel."],
            paragraphs: [
              "Noise, fumes and a venue you visit once. Karting had speed — but it never had a club, a language, or a reason to come back.",
            ],
            image: `${GRID}/story-helmet.webp`,
            mobileImage: `${GRID}/story-helmet-mobile.webp`,
            side: "left",
            shade: "#031414",
            alt: "A driver in a dark helmet, in profile against deep teal.",
          },
          {
            kind: "story",
            heading: ["Then the grid", "goes electric."],
            paragraphs: [
              "No exhaust. No compromise. Instant torque, a circuit powered entirely by charge, and a crew you belong to.",
              "Fast, clean, and open to everyone.",
            ],
            image: `${GRID}/story-kart.webp`,
            mobileImage: `${GRID}/story-kart-mobile.webp`,
            side: "left",
            shade: "#024145",
            alt: "An electric kart racing head-on out of a teal tunnel of light.",
          },
        ],
      },
      {
        type: "naming",
        ground: "radial-gradient(ellipse at 70% 30%, #0f6a5e 0%, #064c47 40%, #032f2e 100%)",
        horizon: "rgba(204, 219, 41, 0.75)",
        items: [
          {
            label: "Name",
            title: "The Grid : Karting Club",
            body: "Two meanings. One name. In racing, the grid is where it all starts — helmets on, engines live, lights about to drop. In the electric world, the grid is the power source.",
          },
          {
            label: "Tagline",
            title: "No Fumes. Just Zooms.",
            body: "Four words. Says everything. What’s gone — fumes. What’s here — zooms. It’s the kind of line that works on a billboard, a bumper sticker, and a seven-year-old’s birthday invite.",
          },
        ],
      },
      {
        type: "logo",
        label: "Logo",
        logo: { src: `${GRID}/logo-color.webp`, alt: "The Grid Karting Club logo", width: 1000, height: 397 },
        body: "Take the checkered flag, tilt it forward, and let it rip. The icon is a grid of parallelogram tiles leaning into the wind — pure speed, standing still. The wordmark pairs “THE” above “GRID”, bolted together like something engineered on a circuit, not sketched in a studio.",
        ground: "#ffffff",
        ink: "#1a1a1a",
        // Charge, not the theme's Surge: Surge on white is 2.4:1.
        labelColor: "#008075",
        variants: [
          { logo: { src: `${GRID}/logo-white.webp`, alt: "The logo in white on charcoal", width: 1000, height: 397 }, ground: "#231f20" },
          { logo: { src: `${GRID}/logo-color.webp`, alt: "The logo in colour on white", width: 1000, height: 397 }, ground: "#ffffff" },
          { logo: { src: `${GRID}/logo-white.webp`, alt: "The logo in white on Blackout teal", width: 1000, height: 397 }, ground: "#024145" },
          {
            logo: { src: `${GRID}/logo-white.webp`, alt: "The logo in white over track photography", width: 1000, height: 397 },
            ground: `#231f20 url('${GRID}/kart-photo.webp') center/cover`,
            plate: true,
          },
        ],
      },
      {
        type: "palette",
        showHex: true,
        swatches: [
          { name: "Blackout", meaning: "The foundation. Dark, rich and atmospheric — pit lane after sundown.", color: "#024145", ink: "#ffffff" },
          { name: "Surge", meaning: "The energy. Brighter, bolder, high-frequency. Pure torque in colour form.", color: "#20BBB4", ink: "#0b2b2b" },
          { name: "Charge", meaning: "The identity. The colour people remember before the name.", color: "#008075", ink: "#ffffff" },
          { name: "Volt", meaning: "The spark. Yellow-green, impossible to miss. For CTAs and taglines.", color: "#CCDB29", ink: "#1a1f05" },
          { name: "Alloy", meaning: "The balance. Cool, neutral, functional — the quiet parts.", color: "#949398", ink: "#111111" },
        ],
      },
      {
        type: "typography",
        label: "Typography",
        ground: "#024145",
        rows: [
          // No face named on the headline row while Orbitron stands in for
          // Seona: naming either would describe something the page is not.
          { label: "Headline", sample: "No Fumes Just Zooms", style: "display" },
          { label: "Subline · DM Sans Semibold", sample: "The Grid : Karting Club", style: "sub" },
          {
            label: "Body · DM Sans Regular",
            sample: "The grid lines up. The lights drop. Everything else disappears. At THE GRID, we’ve traded exhaust for instant torque — no engine roar, no gasoline scent, just the whine of precision engineering and the sound of tyres gripping the apex.",
            style: "body",
          },
        ],
      },
      {
        type: "feature",
        label: "Employee ID Card",
        caption: "One system, two modes — proprietor and team.",
        image: { src: `${GRID}/idcards.webp`, alt: "Two ID cards: the proprietor’s in charcoal, a team member’s in white.", width: 1535, height: 945 },
        ground: "#efefee",
        ink: "#222222",
        labelColor: "#008075",
        frame: "shadow",
        maxWidth: 900,
      },
      {
        type: "feature",
        label: "Entrance Ticket",
        caption: "One person allowed per ticket. Scan to activate.",
        image: { src: `${GRID}/ticket.webp`, alt: "The entrance ticket: logo, QR code and a glowing electric kart.", width: 1600, height: 664 },
        ground: "#231f20",
        ink: "#ffffff",
        labelColor: "#CCDB29",
        frame: "rounded",
      },
      {
        type: "products",
        label: "Merchandise",
        split: ["#ECEDEA", "#ECEDEA"],
        ink: "#1a1a1a",
        shadow: false,
        items: [
          { src: `${GRID}/bottle.webp`, alt: "The Grid insulated bottle in black.", width: 230, caption: ["The paddock essential.", "The Grid Bottle"] },
          { src: `${GRID}/mug.webp`, alt: "Two teal Grid mugs.", width: 298, caption: ["Post-race debrief,", "served hot. The Grid Mug"] },
          { src: `${GRID}/tshirt.webp`, alt: "The Grid team t-shirt, front and back.", width: 296, caption: ["Trackside or street.", "The Grid T-shirt"] },
        ],
      },
      {
        type: "feature",
        label: "Access Wristband",
        caption: "The grid, on your wrist.",
        image: { src: `${GRID}/wristband.webp`, alt: "The access wristband, laid flat, in charcoal with teal checks.", width: 2000, height: 155 },
        ground: "#ffffff",
        ink: "#222222",
        labelColor: "#008075",
        frame: "shadow",
      },
      {
        type: "scene",
        image: { src: `${GRID}/signage.webp`, alt: "The Grid’s illuminated sign mounted outside the venue." },
      },
      {
        type: "closing",
        logo: { src: `${GRID}/logo-white.webp`, alt: "The Grid", width: 1000, height: 397 },
        line: "No Fumes. Just Zooms.",
        ground: "radial-gradient(ellipse at 70% 30%, #0f6a5e 0%, #064c47 40%, #032f2e 100%)",
        horizon: "rgba(204, 219, 41, 0.75)",
      },
    ],
  },

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

  /* Zylo, from Zylo_Folder.zip (2026-10-06): the designer's Illustrator
     package, built here from its PDF (Zylo.pdf, a 1080px artboard). A concept
     brand pitch (the client, 2026-10-07). Copy and images are as delivered,
     at the client's instruction, including two flagged in review: social post
     1 reads "Intelliegence", and the brief's third photograph is a stock
     image whose file name records a watermark removal
     ("wmremove-transformed…"). Replace those files when corrected ones
     arrive; nothing else needs to change. */
  {
    slug: "zylo",
    title: "Zylo",
    kind: "Concept brand pitch",
    summary:
      "A brand for the next generation of intelligent manufacturing: the positioning, the identity, an image style, social posts and a presentation system.",
    disciplines: ["Brand strategy", "Brand identity", "Social media", "Presentation"],
    thumb: `${ZYLO}/thumb.webp`,
    // The robot arm over the chip (review, 2026-10-08: the CNC needle shot was
    // near-black behind the slider's overlays). Its Zylo mark sits top right.
    stage: { src: `${ZYLO}/stage-arm.webp`, position: "40% center" },
    cover: `${ZYLO}/cover.webp`,
    // The cover is a 16:9 slide with "THINK NEXT" at its left edge; the
    // index card crops it narrower, which cut it to "HINK EXT" (review).
    coverPosition: "left center",
    theme: {
      // Inter, as packaged with the artwork (OFL): subset to Latin, weights
      // 300 to 700, 36 KB.
      display: { family: "Zylo Inter", src: `${ZYLO}/fonts/inter.woff2` },
      body: { family: "Zylo Inter", src: `${ZYLO}/fonts/inter.woff2` },
      ground: "#292b3a",
      accent: "#fc6429",
      glow: "#d0e6fd",
      voice: "plain",
      secondary: "#d0e6fd",
    },
    sections: [
      {
        type: "brief",
        slides: [
          {
            kind: "ask",
            ground: "#3b17ff",
            title: ["Technology is everywhere.", "Intelligence isn’t."],
            label: "The Client Ask",
            body: "The brief was to make a brand with the next generation of intelligent manufacturing with a distinctive identity, image style, social media and presentation slides.",
          },
          {
            kind: "story",
            heading: ["We started with", "the industry"],
            paragraphs: [
              "The opportunity was to move the brand beyond being “just another manufacturing company” and establish a distinctive point of view in a rapidly evolving industry.",
            ],
            image: `${ZYLO}/story-industry.webp`,
            mobileImage: `${ZYLO}/story-industry-mobile.webp`,
            valign: "top",
            alt: "A CNC needle descending onto a stack of wafers.",
          },
          {
            kind: "story",
            heading: ["People don’t want", "more technology"],
            paragraphs: [
              "They want technology that understands the problem, makes decisions clearer, removes complexity and improves performance.",
            ],
            image: `${ZYLO}/story-people.webp`,
            mobileImage: `${ZYLO}/story-people-mobile.webp`,
            valign: "top",
            headingColor: "#ffffff",
            // Measured on the PDF: this heading is 0.75 the size of slide 2's
            // (294px wide against 359px), which keeps it to two lines.
            headingScale: 0.75,
            overlay: "linear-gradient(90deg, rgba(59, 23, 255, 0.28) 0%, rgba(59, 23, 255, 0.42) 55%, rgba(30, 20, 110, 0.62) 100%)",
            alt: "Two engineers reviewing a car model on twin monitors.",
          },
        ],
      },
      {
        type: "statement",
        text: [
          "Brand strategy from technology to intelligence.",
          "We positioned ZYLO as the intelligence layer connecting technology with modern manufacturing.",
        ],
        logo: { src: `${ZYLO}/logo-black.webp`, alt: "Zylo: Think Next", width: 600, height: 763 },
        logoWidth: 132,
        ground: "#ffffff",
        ink: "#3b17ff",
      },
      {
        type: "palette",
        swatches: [
          { name: "Ocean Blue", meaning: "Brings a sense of trust, intelligence and forward thinking.", color: "#3b17ff", ink: "#ffffff", width: 2.3 },
          // Charcoal, not the artwork's white: white on this orange is 3.0:1.
          { name: "Sunset Orange", meaning: "Adds energy, creativity and momentum.", color: "#fc6429", ink: "#292b3a" },
          { name: "Charcoal Grey", meaning: "Represents strength, precision and reliability.", color: "#292b3a", ink: "#ffffff" },
          { name: "Cool White", meaning: "Brings clarity, simplicity and openness.", color: "#d0e6fd", ink: "#292b3a" },
        ],
      },
      {
        type: "imagery",
        ground:
          "radial-gradient(ellipse 30% 45% at 40% 100%, rgba(252, 100, 41, 0.55), transparent 70%), radial-gradient(ellipse 35% 70% at 100% 100%, rgba(59, 23, 255, 0.95), transparent 70%), #292b3a",
        mark: { src: `${ZYLO}/z-mark.webp`, alt: "", width: 640, height: 555 },
        items: [
          { src: `${ZYLO}/image-1.webp`, alt: "A robotic arm placing a glowing chip, with the Zylo mark.", width: 700, height: 563 },
          { src: `${ZYLO}/image-2.webp`, alt: "Brushed steel ribbons in motion, with the Zylo mark.", width: 700, height: 563 },
          // The PDF's order: bearing bottom-left, engineer bottom-right.
          { src: `${ZYLO}/image-4.webp`, alt: "Gloved hands holding a bearing on a production line, with the Zylo mark.", width: 700, height: 563 },
          { src: `${ZYLO}/image-3.webp`, alt: "An engineer in a hard hat on a call at a laptop, with the Zylo mark.", width: 700, height: 563 },
        ],
      },
      {
        type: "gallery",
        label: "Social media",
        intro: "Built to capture attention and spark curiosity, using bold visuals and concise messaging to bring the brand story to life.",
        introColor: "#1a1a1a",
        ground: "#ffffff",
        columns: 3,
        shadow: false,
        items: [
          { src: `${ZYLO}/post-1.webp`, alt: "Social post: Intelligence for what’s next.", width: 1000, height: 1250 },
          { src: `${ZYLO}/post-2.webp`, alt: "Social post: Built for a smarter tomorrow, with a robotic gripper.", width: 1000, height: 1250 },
          { src: `${ZYLO}/post-3.webp`, alt: "Social post: The future is built. Powered by AI. Driven by precision.", width: 1000, height: 1250 },
        ],
      },
      {
        type: "gallery",
        label: "Presentation",
        ground: "linear-gradient(to bottom, #ffffff 0, #ffffff 160px, #d1d3d4 160px)",
        columns: 2,
        shadow: false,
        items: [
          { src: `${ZYLO}/slide-1.webp`, alt: "Presentation cover: Think Next, with a robotic arm.", width: 1200, height: 675 },
          { src: `${ZYLO}/slide-2.webp`, alt: "Slide: Who we are. We build what’s next.", width: 1200, height: 675 },
          { src: `${ZYLO}/slide-3.webp`, alt: "Slide: What we do. Intelligence built into industry, in six services.", width: 1200, height: 675 },
          { src: `${ZYLO}/slide-4.webp`, alt: "Slide: Our approach. From complexity to clarity.", width: 1200, height: 675 },
          { src: `${ZYLO}/slide-5.webp`, alt: "Slide: The impact, in three figures.", width: 1200, height: 675 },
          { src: `${ZYLO}/slide-6.webp`, alt: "Closing slide: Think Next.", width: 1200, height: 675 },
        ],
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
