import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Page, PageHead, Section, Head, SectionMark, Statement, CtaBand } from "@/components/page-shell";
import { Reveal, RevealWords, ScrollSpine } from "@/components/story";
import { LearnOnce, YourCalendar, OneContact, SizedToWork, EmbeddedMap } from "@/components/infographics";
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
 * Each point of "what embedded means" gets a diagram of its claim, and the
 * "where we fit" section draws Gravino inside the boundary of the client's
 * team, which is the literal meaning of embedded. The diagrams carry no data
 * and no invented numbers: they draw the shape of a claim, not a measurement.
 * ======================================================================== */

const DIAGRAMS = [LearnOnce, YourCalendar, OneContact, SizedToWork];

export default function WhyGravino() {
  return (
    <Page>
      <JsonLd data={breadcrumbLd("Why Gravino", "/why-gravino/")} />
      <PageHead
        figure
        eyebrow="Why Gravino"
        headline="An embedded business communications"
        accent="partner."
        lede={EMBEDDED.lede}
      />

      {/* 01 -- what embedded means: four claims, four diagrams. */}
      <Section orbs>
        <SectionMark n="01" label="What embedded means" />
        <Head accent="in practice." lede="Four things change when the communications team is part of yours.">
          What that means
        </Head>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {EMBEDDED.points.map((p, i) => {
            const Diagram = DIAGRAMS[i];
            return (
              <Reveal
                key={p.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 backdrop-blur-sm md:p-8"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                />
                <div className="st-fade flex items-baseline gap-3" style={d(0)}>
                  <span className="text-sm font-mono text-[#a78bfa]">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="text-[1.3rem] font-normal leading-snug text-white">{p.title}</h3>
                </div>
                <div className="mt-6 rounded-2xl border border-white/[0.06] bg-black/25 p-4 md:p-5">
                  <Diagram />
                </div>
                <p className="st-fade mt-6 text-[0.95rem] font-light leading-relaxed text-slate-300" style={d(3)}>
                  {p.body}
                </p>
              </Reveal>
            );
          })}
        </div>
      </Section>

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
          <Reveal className="mx-auto w-full max-w-[460px]">
            <EmbeddedMap />
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

      {/* 03 -- how the work works: a storyline with a spine that fills as you
          read down it. */}
      <Section>
        <SectionMark n="03" label="How we work" />
        <Head accent="works." lede="Three things hold across every engagement, whatever the format.">
          How the work
        </Head>

        <ol className="relative mt-12 space-y-14 pl-12 md:pl-20">
          <ScrollSpine className="bottom-4 left-[18px] top-4 md:left-[30px]" />
          {MODEL.map((m) => (
            <li key={m.n}>
              <Reveal className="relative">
                <span
                  aria-hidden
                  className="st-pop absolute -left-12 top-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#a78bfa]/50 bg-[#120d26] text-xs font-mono text-[#c4b5fd] md:-left-20 md:h-[3.75rem] md:w-[3.75rem] md:text-sm"
                >
                  {m.n}
                </span>
                <h3 className="st-fade text-[clamp(1.35rem,2.4vw,1.9rem)] font-light leading-tight text-white" style={d(1)}>
                  {m.title}
                </h3>
                <p className="st-fade mt-3 max-w-2xl text-[1rem] font-light leading-relaxed text-slate-400" style={d(2)}>
                  {m.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <CtaBand
        headline="See how we would handle"
        accent="yours."
        body="Send one thing you already have. We come back with a single page on what is working, what it is costing you, and what we would change. No cost, no pitch."
      />
    </Page>
  );
}
