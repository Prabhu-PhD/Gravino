import {
  Page,
  PageHead,
  Section,
  Head,
  Card,
  Panel,
  SectionMark,
  Statement,
  CtaBand,
} from "@/components/page-shell";
import { MODEL, COMPARISON, SITE, PROBLEM, BALANCE } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `A senior ${SITE.teamSize}-person team with ${SITE.experienceYears}+ years between them, covering ten communications disciplines under one point of contact.`,
};

/* The page opens on the idea the firm was built around, then uses the
   comparison as evidence one section down. That order was the other way
   round and the comparison is an argument about other people, which is the
   wrong first thing to say about yourself. The table itself was previously
   buried on /for/cfo, now removed, and it is still the strongest thing in
   the collateral.

   NOTHING HERE IS INVENTED. No named biographies, no client logos, no
   funding-stage claims.

   THE TEAM SECTION WAS REMOVED at the client's request. It was a heading, a
   row of four stat cards and a strip of sectors, and it said less than the
   two sections above it already do: the comparison establishes why the firm
   has this shape, and the model says how it works. The figures it carried
   (four people, 75+ years, ten disciplines, one contact) are all still on
   the page in the copy. When real names, photos and bios arrive, that is a
   reason to bring a team section back, not a reason to keep an empty one. */

export default function About() {
  return (
    <Page>
      {/* The page used to open on the competitive comparison: "most
          companies have two bad options, we are the third". That is an
          argument about other people, and it is the wrong first thing to say
          about yourself. It still runs, one section down, where it belongs
          as evidence rather than as an introduction.

          It opens instead on the idea the firm was built around. BALANCE in
          site.ts calls it "the discipline we built the firm around", so this
          is the company's own words, not a new position invented here. */}
      <PageHead
        eyebrow="About Gravino"
        headline="Every high-stakes communication is a"
        accent="balancing act."
        lede={BALANCE.body}
      />

      <Section orbs>
        <SectionMark n="01" label="Why we exist in this shape" />
        <Head lede={COMPARISON.intro}>
          Most companies have two bad options.
        </Head>

        {/* The table sits on its own surface rather than bleeding into the
            page, and the Gravino column is tinted so the answer is visible
            before the rows are read. */}
        <Panel className="mt-9 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[22%] px-6 pt-6 pb-4" />
                {COMPARISON.columns.map((c, i) => (
                  <th
                    key={c}
                    className={`px-6 pt-6 pb-4 text-sm font-medium ${
                      i === 2
                        ? "bg-[#7b3fe4]/[0.09] text-white"
                        : "text-slate-400"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((r) => (
                <tr key={r.k} className="border-t border-white/[0.08]">
                  <th className="px-6 py-5 align-top text-[11px] font-mono font-normal uppercase tracking-[0.14em] text-slate-500">
                    {r.k}
                  </th>
                  {r.v.map((v, i) => (
                    <td
                      key={v + i}
                      className={`px-6 py-5 align-top text-sm font-light leading-relaxed ${
                        i === 2
                          ? "bg-[#7b3fe4]/[0.09] text-white"
                          : "text-slate-400"
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </Section>

      <Statement attribution="What we actually are">{PROBLEM.pull}</Statement>

      <Section tone="raised">
        <SectionMark n="02" label="How we work" />
        <Head accent="works." lede="Three things hold across every engagement, whatever the format.">
          How the work
        </Head>

        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {MODEL.map((m) => (
            <Card key={m.n} className="p-6">
              <span className="text-sm font-mono text-[#a78bfa]">{m.n}</span>
              <h3 className="mt-3 text-[1.2rem] font-normal leading-snug text-white">
                {m.title}
              </h3>
              <p className="mt-2.5 text-[0.925rem] font-light leading-relaxed text-slate-400">
                {m.body}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <CtaBand
        headline="See how we would handle"
        accent="yours."
        body="Send one thing you already have. We come back with a single page on what is working, what it is costing you, and what we would change. No cost, no pitch."
      />
    </Page>
  );
}
