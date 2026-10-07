/* ===========================================================================
 * One case study, rendered from its data (src/lib/work.ts).
 * ---------------------------------------------------------------------------
 * Server-rendered throughout except the slider and the toolbar, so every
 * word and image of a case study is in the HTML that search engines and AI
 * crawlers read.
 *
 * Layout rule (agreed with the client): content sits in Arun's 1080px column;
 * each section's colour runs full-width behind it.
 * ======================================================================== */

import type { CaseFont, CaseStudy, Section } from "@/lib/work";
import { neighbours } from "@/lib/work";
import { BriefSlider } from "./brief-slider";
import { CaseToolbar } from "./case-toolbar";
import { CosmicFooter } from "@/components/cosmic-chrome";
import { IntakeModal } from "@/components/intake-form";
import { CtaBand } from "@/components/page-shell";

/** The CSS value for a case font: its next/font variable, or its name. */
function familyValue(f: CaseFont) {
  return f.cssVar ? `var(${f.cssVar})` : `"${f.family}"`;
}

export function CaseView({ study }: { study: CaseStudy }) {
  const { prev, next, index, total } = neighbours(study.slug);
  const t = study.theme;

  return (
    <>
      {/* The project's own faces. Declared here rather than in global CSS so
          a case study only downloads its own fonts. */}
      <style>
        {[t.display, t.body]
          .filter((f) => f.src)
          .map((f) => `@font-face { font-family: "${f.family}"; src: url("${f.src}") format("truetype"); font-display: swap; }`)
          .join(" ")}
      </style>

      <CaseToolbar
        title={study.title}
        kind={study.kind}
        index={index}
        total={total}
        prev={prev ? { href: prev.slug, title: prev.title } : null}
        next={next ? { href: next.slug, title: next.title } : null}
      />

      <main
        id="main"
        tabIndex={-1}
        className="cs-root outline-none"
        data-voice={t.voice}
        style={
          {
            ["--cs-display" as string]: familyValue(t.display),
            ["--cs-body" as string]: familyValue(t.body),
            ["--cs-accent" as string]: t.accent,
            ["--cs-secondary" as string]: t.secondary ?? t.accent,
            ["--cs-glow" as string]: t.glow,
            ["--cs-ground" as string]: t.ground,
          } as React.CSSProperties
        }
      >
        {study.sections.map((s, k) => (
          <SectionBlock key={k} section={s} title={study.title} />
        ))}

        {next ? (
          <a
            href={`/portfolio/${next.slug}/`}
            className="group block border-t border-white/10 bg-black py-14 text-center"
          >
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">Next project</span>
            <span className="mt-3 block text-4xl font-light text-white transition-colors group-hover:text-cyan-200 [font-family:var(--font-dm)]">
              {next.title} <span aria-hidden>&rarr;</span>
            </span>
          </a>
        ) : null}

        {/* Inside <main>, so the closing call to action is part of the page's
            content landmark rather than floating between it and the footer. */}
        <CtaBand
          headline="See how we would handle"
          accent="yours."
          body="Tell us about the deck, report, brand, film or campaign in front of you. One of the four of us comes back within a working day with questions, an approach and a clear next step."
        />
      </main>

      <CosmicFooter />
      <IntakeModal />
    </>
  );
}

function SectionBlock({ section: s, title }: { section: Section; title: string }) {
  switch (s.type) {
    case "brief":
      return (
        <div className="cs-band bg-black">
          <div className="cs-col">
            <BriefSlider slides={s.slides} title={title} />
          </div>
        </div>
      );

    case "reveal":
      return (
        <section className="cs-band cs-reveal" style={{ background: s.ground }} aria-label="The brand">
          <div className="cs-col">
            <div className="cs-reveal-head">
              <p className="cs-reveal-intro">
                {s.intro}
                <span>{s.introLine}</span>
              </p>
            </div>
            <div className="cs-reveal-visual">
              {s.moon ? <div aria-hidden className="cs-moon" style={{ background: s.moon.color }} /> : null}
              <img className="cs-reveal-logo" src={s.logo.src} alt={s.logo.alt} width={240} height={120} />
              <img className="cs-reveal-land" src={s.landscape.src} alt={s.landscape.alt} width={1600} height={896} loading="lazy" decoding="async" />
            </div>
          </div>
        </section>
      );

    case "palette": {
      const first = s.swatches[0]?.color;
      const last = s.swatches[s.swatches.length - 1]?.color;
      return (
        <section
          className="cs-band cs-palette-band"
          aria-label="Colour palette"
          // The first colour runs to the left edge and the last to the right,
          // so the row reads as bands on a wide screen, not a strip.
          style={{ background: `linear-gradient(90deg, ${first} 50%, ${last} 50%)` }}
        >
          <div className="cs-col cs-palette" style={{ ["--cs-swatches" as string]: s.swatches.length } as React.CSSProperties}>
            {s.swatches.map((w) => (
              <div key={w.name} className="cs-swatch" style={{ background: w.color, color: w.ink }}>
                <h3>{w.name}</h3>
                <p>{w.meaning}</p>
                {s.showHex ? <span className="cs-swatch-hex">{w.color.toUpperCase()}</span> : null}
              </div>
            ))}
          </div>
        </section>
      );
    }

    case "artwork":
      return (
        <section className="cs-band" style={{ background: s.ground }} aria-label="Label artwork">
          <div className="cs-col cs-artwork">
            <div className="cs-artwork-card">
              <img src={s.image.src} alt={s.image.alt} width={1600} height={1102} loading="lazy" decoding="async" />
            </div>
          </div>
        </section>
      );

    case "products":
      return (
        <section
          className="cs-band"
          aria-label={s.label ?? "Packaging"}
          style={{ background: `linear-gradient(to bottom, ${s.split[0]} 0%, ${s.split[0]} 28%, ${s.split[1]} 28%, ${s.split[1]} 100%)` }}
        >
          <div className="cs-col cs-products">
            {s.label ? (
              <h2 className="cs-label cs-label-center" style={{ color: s.ink }}>
                {s.label}
              </h2>
            ) : null}
            <div
              className={`cs-products-grid ${s.shadow === false ? "cs-products-flat" : ""}`}
              style={{ ["--cs-products" as string]: s.items.length } as React.CSSProperties}
            >
              {s.items.map((p) => (
                <figure key={p.src} className="cs-product">
                  <div className="cs-product-img">
                    <img
                      src={p.src}
                      alt={p.alt}
                      style={{ width: p.width, ["--w" as string]: p.width } as React.CSSProperties}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figcaption className="cs-product-caption" style={{ color: s.ink ?? "#ffffff" }}>
                    {p.caption.map((l, j) => (
                      <span key={j}>
                        {l}
                        {j < p.caption.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case "gallery":
      return (
        <section className="cs-band" style={{ background: s.ground }} aria-label="Campaign">
          <div className="cs-col cs-gallery">
            <div className="cs-gallery-grid">
              {s.items.map((g) => (
                <figure key={g.src}>
                  <img src={g.src} alt={g.alt} width={1000} height={1148} loading="lazy" decoding="async" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      );

    case "scene":
      return (
        <section className="cs-band bg-black" aria-label="In context">
          <div className="cs-col cs-scene">
            <img src={s.image.src} alt={s.image.alt} width={1536} height={1024} loading="lazy" decoding="async" />
          </div>
        </section>
      );

    case "naming":
      return (
        <section className="cs-band cs-horizon" style={horizon(s.ground, s.horizon)} aria-label="The name">
          <div className="cs-col cs-naming">
            {s.items.map((n) => (
              <div key={n.label} className="cs-naming-item">
                <p className="cs-label cs-label-rule">{n.label}</p>
                <h2 className="cs-naming-title">{n.title}</h2>
                <p className="cs-naming-body">{n.body}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case "logo":
      return (
        <section className="cs-band" aria-label={s.label}>
          <div className="cs-band" style={{ background: s.ground, color: s.ink }}>
            <div className="cs-col cs-logo">
              <h2 className="cs-logo-label" style={{ color: s.labelColor ?? s.ink }}>
                {s.label}
              </h2>
              <img className="cs-logo-mark" src={s.logo.src} alt={s.logo.alt} width={s.logo.width} height={s.logo.height} loading="lazy" decoding="async" />
              <p className="cs-logo-body">{s.body}</p>
            </div>
          </div>
          {/* Full-width, unlike the column: each tile IS a ground, so a tile
              the colour of the page ground would vanish inside a column. */}
          <div className="cs-logo-variants">
            {s.variants.map((v, k) => (
              <div key={k} className="cs-logo-variant" style={{ background: v.ground }}>
                <img
                  className={v.plate ? "cs-logo-plate" : undefined}
                  src={v.logo.src}
                  alt={v.logo.alt}
                  width={v.logo.width}
                  height={v.logo.height}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </section>
      );

    case "typography":
      return (
        <section className="cs-band" style={{ background: s.ground }} aria-label={s.label}>
          <div className="cs-col cs-type">
            <h2 className="cs-label cs-label-rule">{s.label}</h2>
            {s.rows.map((r) => (
              <div key={r.label} className="cs-type-row">
                <p className="cs-type-name">{r.label}</p>
                <p className={`cs-type-${r.style}`}>{r.sample}</p>
              </div>
            ))}
          </div>
        </section>
      );

    case "feature":
      return (
        <section className="cs-band" style={{ background: s.ground, color: s.ink }} aria-label={s.label}>
          <div className="cs-col cs-feature">
            <h2 className="cs-label" style={s.labelColor ? { color: s.labelColor } : undefined}>
              {s.label}
            </h2>
            {s.caption ? <p className="cs-feature-caption">{s.caption}</p> : null}
            <img
              className={s.frame ? `cs-frame-${s.frame}` : undefined}
              style={s.maxWidth ? { maxWidth: s.maxWidth } : undefined}
              src={s.image.src}
              alt={s.image.alt}
              width={s.image.width}
              height={s.image.height}
              loading="lazy"
              decoding="async"
            />
          </div>
        </section>
      );

    case "closing":
      return (
        <section className="cs-band cs-horizon" style={horizon(s.ground, s.horizon)} aria-label="Sign-off">
          <div className="cs-col cs-closing">
            <img src={s.logo.src} alt={s.logo.alt} width={s.logo.width} height={s.logo.height} loading="lazy" decoding="async" />
            <p>{s.line}</p>
          </div>
        </section>
      );
  }
}

/** A ground, plus the colour of the light rising from its bottom edge. */
function horizon(ground: string, light?: string) {
  return { background: ground, ["--cs-horizon" as string]: light ?? "transparent" } as React.CSSProperties;
}
