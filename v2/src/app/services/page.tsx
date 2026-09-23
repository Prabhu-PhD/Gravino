import {
  Page,
  PageHead,
  Section,
  Head,
  Statement,
  CtaBand,
} from "@/components/page-shell";
import { GROUPS, BALANCE } from "@/lib/site";

export const metadata = {
  title: "What we cover",
  description:
    "Ten disciplines across capital and corporate narrative, brand and identity, growth and digital, and public and physical experience.",
};

/* Rebuilt from the card-grid version, which had three problems that together
   made it read as filler rather than as an argument:

   - Every discipline carried a running index ("01 / 04") and a second label
     under its title repeating the category. Two pieces of chrome per card,
     neither of which a reader uses.
   - Four full-bleed alternating sections at py-28, one per group, so the page
     was mostly vertical space.
   - Big padded cards for what is really a list.

   It is now one section per group at normal rhythm, and each discipline is a
   row: title, one line, the things it covers. The numbering that survives is
   the group's, because four groups is a structure worth seeing. */

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
          <div className="flex items-baseline gap-5">
            <span className="mt-1 text-sm font-mono text-[#a78bfa]">{g.n}</span>
            <Head lede={g.premise}>{g.name}</Head>
          </div>

          <div className="mt-10 grid gap-x-12 gap-y-9 md:grid-cols-2">
            {g.disciplines.map((d) => (
              <article
                key={d.n}
                className="border-l border-white/10 pl-6 transition-colors hover:border-[#a78bfa]/50"
              >
                <h3 className="text-[1.35rem] font-normal leading-snug tracking-[-0.015em] text-white">
                  {d.title}
                </h3>
                <p className="mt-2.5 text-[0.95rem] font-light leading-relaxed text-slate-400">
                  {d.blurb}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {d.items.map((it) => (
                    <li key={it} className="text-xs text-slate-500">
                      {it}
                    </li>
                  ))}
                </ul>
              </article>
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
