import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Page, PageHead, Section, Head, SectionMark, Statement, CtaBand } from "@/components/page-shell";
import { Reveal, RevealWords, ScrollSpine } from "@/components/story";
import { FitOrbit } from "@/components/liquid-orb/fit-orbit";
import { EmbeddedMorph } from "@/components/embedded-morph/embedded-morph";
import { d } from "@/lib/stagger";
import { MODEL, EMBEDDED, ALONGSIDE } from "@/lib/site";

export const metadata = pageMeta({
  path: "/why-gravino/",
  title: "Why Gravino | Embedded business communications partner",
  description:
    "An embedded business communications partner: we work as part of your team on the decks, reports and narratives your business is judged by.",
});

/* ===========================================================================
 * /why-gravino -- the case for working with Gravino, told as a storyline.
 * ---------------------------------------------------------------------------
 * This content used to be the About page. It is really an answer to "why
 * you", so it has its own page and About now says who the company is.
 *
 * It makes the case WITHOUT comparing Gravino with anyone. Every diagram is
 * about what working with Gravino is like, never about what someone else does
 * worse. That was the brief: an embedded partner has no need to compete with
 * the people it works alongside.
 *
 * "What embedded means" morphs one particle figure through its four points,
 * and "where we fit" draws the client's people revolving round Gravino, each
 * joined to it by a forcefield, which is the literal meaning of embedded. The diagrams carry no data
 * and no invented numbers: they draw the shape of a claim, not a measurement.
 * ======================================================================== */


export default function WhyGravino() {
  return (
    <Page>
      <JsonLd data={breadcrumbLd("Why Gravino", "/why-gravino/")} />
      <PageHead
        figure
        eyebrow="Why Gravino"
        headline="We work as part of"
        accent="your team."
        lede="On the communication your business is judged by: the investor deck, the board paper, the annual report, the story you take to market."
      />

      {/* 01 -- what embedded means: the client's morphing particle panel
          (components/embedded-morph), which replaced four cards with a
          diagram each. One visual that transforms between the principles. */}
      <EmbeddedMorph
        principles={EMBEDDED.points}
        mark={<SectionMark n="01" label="What embedded means" />}
        head={<Head accent="practice.">What that means in</Head>}
      />

      <Statement attribution="The whole idea">
        <RevealWords text={EMBEDDED.statement} />
      </Statement>

      {/* 02 -- where we fit: the diagram IS the argument. */}
      <Section tone="raised">
        <SectionMark n="02" label={ALONGSIDE.label} />
        <Head accent={ALONGSIDE.accent} lede={ALONGSIDE.lede}>
          {ALONGSIDE.headline}
        </Head>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          {/* Gravino (the client's liquid orb) at the centre, the three
              people below revolving round it, each joined to it by a
              forcefield (2026-10-01). */}
          <Reveal className="mx-auto w-full max-w-[540px]">
            <FitOrbit moons={ALONGSIDE.points} />
          </Reveal>

          <Reveal as="ul" className="space-y-4">
            {ALONGSIDE.points.map((p, i) => (
              <li
                key={p.title}
                className="st-fade rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:p-6"
                style={d(i + 1, 0.18)}
              >
                <h3 className="text-[1.1rem] font-normal text-white">{p.title}</h3>
                <p className="mt-2 text-[0.925rem] font-light leading-relaxed text-slate-400">{p.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* 03 -- how the work works: three steps side by side on desktop,
          joined by a line that fills as the row comes up the screen; stacked
          on phones, joined by a vertical spine (the client, 2026-10-01, in
          place of a single left-aligned column that left most of a wide
          screen empty). */}
      <Section>
        <SectionMark n="03" label="How we work" />
        <Head accent="works." lede="Three things hold across every engagement, whatever the format.">
          How the work
        </Head>

        <div className="relative mt-12 md:mt-14">
          {/* Desktop: from the first step's numeral to the last one's. */}
          <ScrollSpine axis="x" className="left-7 right-[calc((100%-3rem)/3-1.75rem)] top-7 max-lg:hidden" />
          {/* Phones and tablets: down through the numerals. */}
          <ScrollSpine className="bottom-10 left-[22px] top-6 lg:hidden" />

          <Reveal as="ol" className="relative grid gap-5 lg:grid-cols-3 lg:gap-6">
            {MODEL.map((m, i) => (
              <li key={m.n} className="flex gap-4 lg:block">
                <span
                  aria-hidden
                  className="st-pop relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#a78bfa]/50 bg-[#120d26] font-mono text-xs text-[#c4b5fd] shadow-[0_0_0_6px_#09090f] lg:h-14 lg:w-14 lg:text-sm"
                  style={d(i, 0.15)}
                >
                  {m.n}
                </span>
                <div
                  className="st-fade group relative flex-1 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.055] to-white/[0.015] p-5 sm:p-6 transition-colors duration-300 hover:border-[#a78bfa]/40 lg:mt-6 lg:min-h-[15rem] lg:p-8"
                  style={d(i + 1, 0.15)}
                >
                  <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  {/* The step's numeral, large and faint, as a watermark. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-6 -right-2 select-none text-[7.5rem] font-light leading-none text-white/[0.035] transition-colors duration-300 group-hover:text-[#a78bfa]/[0.08] lg:text-[9rem]"
                  >
                    {m.n}
                  </span>
                  <h3 className="relative text-[clamp(1.3rem,2vw,1.6rem)] font-light leading-tight text-white">{m.title}</h3>
                  <p className="relative mt-3 text-[1rem] font-light leading-relaxed text-slate-400">{m.body}</p>
                </div>
              </li>
            ))}
          </Reveal>
        </div>
      </Section>

      <CtaBand
        headline="See how we would handle"
        accent="yours."
        body="Tell us about the deck, report, brand, film or campaign in front of you. A senior member of our team comes back within a working day with questions, an approach and a clear next step."
      />
    </Page>
  );
}
