import { Page, PageHead, Section, Head, CtaBand } from "@/components/page-shell";
import { MODEL, COMPARISON, SECTORS, SITE } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `A senior ${SITE.teamSize}-person team with ${SITE.experienceYears}+ years between them, covering ten communications disciplines under one point of contact.`,
};

/* Rebuilt. The previous version opened with an abstract "balancing act"
   section and a brand render, then restated the tagline in large type. It
   looked like an About page without arguing anything.

   What a buyer actually wants here, in order: what this company is, why it
   exists in this shape, how it works, and what proof there is. So the
   comparison table leads the argument. It was the strongest thing in the
   collateral and it was previously buried on /for/cfo, which has now been
   removed, so this also stops that content being lost.

   NOTHING HERE IS INVENTED. No named biographies, no client logos, no
   funding-stage claims. The brochure says "a senior four-person core team"
   and nothing more about who they are, so that is what this says. When real
   names, photos and case studies arrive they belong in the section marked
   below. */

const FACTS = [
  [String(SITE.teamSize), "Senior practitioners at the core"],
  [`${SITE.experienceYears}+`, "Years between them"],
  ["10", "Disciplines covered in house"],
  ["1", "Point of contact, whatever the format"],
] as const;

export default function About() {
  return (
    <Page>
      <PageHead
        eyebrow="About Gravino"
        headline="Most companies have two bad options. We are the"
        accent="third."
        lede="Freelancers give you craft in one format at a time. An in-house hire gives you one person's range, paid for whether the work is there or not. Gravino is a senior team you embed instead."
      />

      <Section orbs>
        <Head lede={COMPARISON.intro}>Three ways to solve it.</Head>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="w-[22%] pb-4" />
                {COMPARISON.columns.map((c, i) => (
                  <th
                    key={c}
                    className={`pb-4 text-sm font-medium ${
                      i === 2 ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((r) => (
                <tr key={r.k} className="border-t border-white/10">
                  <th className="py-5 pr-6 align-top text-xs font-mono uppercase tracking-[0.14em] font-normal text-slate-500">
                    {r.k}
                  </th>
                  {r.v.map((v, i) => (
                    <td
                      key={v + i}
                      className={`py-5 pr-6 align-top text-sm font-light leading-relaxed ${
                        i === 2 ? "text-white" : "text-slate-400"
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="raised">
        <Head accent="works." lede="Three things hold across every engagement, whatever the format.">
          How the work
        </Head>

        <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-3">
          {MODEL.map((m) => (
            <div key={m.n} className="border-t border-white/12 pt-5">
              <span className="text-sm font-mono text-[#a78bfa]">{m.n}</span>
              <h3 className="mt-3 text-lg font-medium text-white">{m.title}</h3>
              <p className="mt-2.5 text-[0.95rem] font-light leading-relaxed text-slate-400">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Head accent="small." lede="Senior people doing the work themselves, rather than a large team where the people who sold it are not the people who make it.">
              The team is deliberately
            </Head>
            {/* TODO(confirm): names, roles, photos and short bios for the four.
                The brochure gives the count and nothing else, so this stays a
                statement of the model until the client supplies them. */}
            <p className="mt-6 text-[0.95rem] font-light leading-relaxed text-slate-400">
              {SITE.experienceYears}+ years between {SITE.teamSize} people, in
              the rooms where communication decides the outcome: funding
              conversations, boardrooms, and the reporting that follows. Based
              in {SITE.location}, working across {SITE.markets}.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-7">
              {FACTS.map(([n, label]) => (
                <div key={label}>
                  <dt className="text-3xl font-light text-white">{n}</dt>
                  <dd className="mt-1.5 text-xs leading-relaxed text-slate-500">
                    {label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:pt-2">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
              Sectors we work in
            </h3>
            <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
              {SECTORS.map((s) => (
                <li key={s} className="py-4 text-base font-light text-slate-300">
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm font-light leading-relaxed text-slate-500">
              The work is the same shape in each: something important has to be
              explained to people who decide with it.
            </p>
          </div>
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
