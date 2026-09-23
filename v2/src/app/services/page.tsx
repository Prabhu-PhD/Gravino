import {
  Page,
  PageHead,
  Section,
  Head,
  Card,
  SectionMark,
  Statement,
  CtaBand,
} from "@/components/page-shell";
import { GROUPS, BALANCE } from "@/lib/site";

export const metadata = {
  title: "What we cover",
  description:
    "Ten disciplines across capital and corporate narrative, brand and identity, growth and digital, and public and physical experience.",
};

/* Three versions of this page now, and the history matters because it is
   easy to read this one as a return to the first.

   V1 was a card grid. It was wrong, but not because cards are wrong: each
   card carried a running index AND a second label repeating its own
   category, the sections ran at py-28, and the cards were padded boxes that
   said nothing a list would not.

   V2 stripped it to a bordered list. That fixed the clutter and went too far
   the other way: one flat surface for the whole page, nothing for the eye to
   land on.

   V3 is cards again, but as SURFACES rather than containers: the same
   translucent glass the home page uses, at reading scale, with the index
   moved up to the section mark where it belongs and no repeated category
   label. The disciplines are objects on the page; the page is not a list of
   boxes. */

export default function Services() {
  return (
    <Page>
      <PageHead
        eyebrow="What we cover"
        headline="Ten disciplines, one"
        accent="team."
        lede="Grouped by the outcome each produces rather than the department it would sit in, so you can see how much of your communications surface one team covers."
      />

      {GROUPS.map((g, i) => (
        <Section key={g.n} tone={i % 2 ? "raised" : "base"} orbs={i === 0}>
          <SectionMark n={g.n} label={`${g.disciplines.length} disciplines`} />
          <Head lede={g.premise}>{g.name}</Head>

          <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {g.disciplines.map((d) => (
              <Card key={d.n} className="flex flex-col p-6">
                <h3 className="text-[1.3rem] font-normal leading-snug tracking-[-0.015em] text-white">
                  {d.title}
                </h3>
                <p className="mt-3 flex-1 text-[0.925rem] font-light leading-relaxed text-slate-400">
                  {d.blurb}
                </p>
                <ul className="mt-5 flex flex-wrap gap-1.5 border-t border-white/10 pt-4">
                  {d.items.map((it) => (
                    <li
                      key={it}
                      className="rounded-md bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400"
                    >
                      {it}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </Section>
      ))}

      <Statement attribution="Why any of this matters">{BALANCE.pull}</Statement>

      <CtaBand
        headline="Not sure which of these you"
        accent="need?"
        body="Send us what you already have: a deck, a report, a brand piece. We come back with a one-page read on what is working, what is not, and which of the ten actually applies."
      />
    </Page>
  );
}
