import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Page, PageHead, Section, CtaBand } from "@/components/page-shell";
import { CASES } from "@/lib/work";

export const metadata = pageMeta({
  path: "/portfolio/",
  title: "Portfolio | Case studies | Gravino",
  description:
    "Case studies told from the first brief to the finished work: the idea, the identity, the packaging, the campaign.",
});

/* ===========================================================================
 * The portfolio index: one large card per case study.
 * ---------------------------------------------------------------------------
 * This replaced a page of four invented case studies told in paragraphs.
 * Every project now opens into a full case study in Arun's format
 * (/portfolio/<slug>/), so the index only has to say what each one is and
 * invite the click. The cards are large on purpose: a portfolio is judged on
 * the work, and a thumbnail grid of small tiles undersells it.
 *
 * Each card states the project's `kind` ("Concept brand pitch" and so on) up
 * front. That label is the difference between an honest portfolio and one
 * that implies commissions it did not have.
 * ======================================================================== */

export default function Portfolio() {
  return (
    <Page>
      <JsonLd data={breadcrumbLd("Portfolio", "/portfolio/")} />
      <PageHead
        figure
        eyebrow="Selected work"
        headline="The work, from brief to"
        accent="the finished piece."
        lede="Each project told the way it was made: what was asked, the idea behind it, and everything it became."
      />

      <Section>
        <ul className="grid gap-8">
          {CASES.map((c) => (
            <li key={c.slug}>
              <a
                href={`/portfolio/${c.slug}/`}
                className="group grid overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition-colors hover:border-cyan-300/50 lg:grid-cols-[1.35fr_1fr]"
              >
                <div className="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[420px]">
                  <img
                    src={c.cover}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="flex flex-col justify-end gap-4 p-7 md:p-10">
                  <span className="w-fit rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-slate-300">
                    {c.kind}
                  </span>
                  <h2 className="text-[clamp(2rem,4vw,3rem)] font-light leading-none text-white">{c.title}</h2>
                  <p className="text-[1rem] font-light leading-relaxed text-slate-300">{c.summary}</p>
                  <ul className="flex flex-wrap gap-2" aria-label="Disciplines">
                    {c.disciplines.map((d) => (
                      <li key={d} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-slate-300">
                        {d}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cyan-200">
                    View case study
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        headline="See how we would handle"
        accent="yours."
        body="Tell us about the deck, report, brand, film or campaign in front of you. One of the four of us comes back within a working day with questions, an approach and a clear next step."
      />
    </Page>
  );
}
