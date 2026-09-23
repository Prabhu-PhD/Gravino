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
import { MODEL, COMPARISON, SECTORS, SITE, PROBLEM, BALANCE } from "@/lib/site";

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
   funding-stage claims. The brochure says "a senior four-person core team"
   and nothing more, so that is what this says, with the TODO below marking
   where real names and photos go. */

const FACTS = [
  [String(SITE.teamSize), "Senior practitioners at the core"],
  [`${SITE.experienceYears}+`, "Years between them"],
  ["10", "Disciplines covered in house"],
  ["1", "Point of contact, whatever the format"],
] as const;

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

      {/* The sectors card sat beside a four-cell stat grid and held four
          short lines, so it was mostly empty space pretending to be a
          column. There are only four sectors and inventing more would be a
          lie, so the LAYOUT changed instead: the team argument runs full
          width, the figures become a four-across row beneath it, and the
          sectors are a single inline strip rather than a tall box with
          nothing in it. */}
      <Section>
        <SectionMark n="03" label="The team" />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Head accent="small." lede="Senior people doing the work themselves, rather than a large team where the people who sold it are not the people who make it.">
            The team is deliberately
          </Head>
          {/* TODO(confirm): names, roles, photos and short bios for the four.
              The brochure gives the count and nothing else, so this stays a
              statement of the model until the client supplies them. */}
          <p className="text-[0.95rem] font-light leading-relaxed text-slate-400 lg:pt-2">
            {SITE.experienceYears}+ years between {SITE.teamSize} people, in
            the rooms where communication decides the outcome: funding
            conversations, boardrooms, and the reporting that follows. Based
            in {SITE.location}, working across {SITE.markets}.
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FACTS.map(([n, label]) => (
            <Card key={label} interactive={false} className="p-5 sm:p-6">
              <dt className="text-[clamp(2.1rem,5vw,3.25rem)] font-light leading-none tracking-[-0.04em] text-white">
                {n}
              </dt>
              <dd className="mt-3 text-xs leading-relaxed text-slate-400">
                {label}
              </dd>
            </Card>
          ))}
        </dl>

        <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 sm:px-6">
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
            Sectors
          </span>
          {SECTORS.map((sec) => (
            <span
              key={sec}
              className="rounded-md bg-white/[0.05] px-3 py-1.5 text-sm font-light text-slate-200"
            >
              {sec}
            </span>
          ))}
          <span className="w-full text-sm font-light leading-relaxed text-slate-500 sm:w-auto sm:flex-1 sm:pl-2">
            The work is the same shape in each: something important has to be
            explained to people who decide with it.
          </span>
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
