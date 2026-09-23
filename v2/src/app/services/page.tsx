import {
  Page,
  PageHead,
  ClosingCta,
  StatementBand,
  SHELL,
} from "@/components/page-shell";
import { SectionHead } from "@/components/editorial";
import { GROUPS, SITE } from "@/lib/site";

export const metadata = {
  title: "What we cover",
  description:
    "Ten disciplines across capital and corporate narrative, brand and identity, growth and digital, and public and physical experience.",
};

const TOTAL = String(GROUPS.length).padStart(2, "0");

export default function Services() {
  return (
    <Page>
      <PageHead
        eyebrow="Comprehensive Capability"
        headline="The full surface, ten disciplines"
        accent="deep."
        lede="Organised around the outcome each produces, not the department it would sit in — so you can see how much of your communications surface one team covers."
      />

      {GROUPS.map((g, i) => (
        <section
          key={g.n}
          className={i % 2 ? "bg-paper-soft" : "bg-paper"}
        >
          <div className={`${SHELL} py-20 md:py-28`}>
            <SectionHead lede={g.premise}>
              {g.name}
            </SectionHead>

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {g.disciplines.map((d) => (
                <article key={d.n} className="card flex flex-col p-8">
                  <div className="flex items-baseline justify-between">
                    <span className="label text-accent-on-ink">{d.n}</span>
                    <span className="label text-on-paper-dim">
                      {g.n}
                      <span className="opacity-40"> / {TOTAL}</span>
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-[1.3rem] font-medium leading-snug tracking-[-0.02em]">
                    {d.title}
                  </h3>
                  <p className="label mt-2 text-accent-on-ink">{d.kind}</p>
                  <p className="mt-5 text-[0.95rem] leading-relaxed text-on-paper-dim">
                    {d.blurb}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2 border-t border-paper-line pt-5">
                    {d.items.map((it) => (
                      <li
                        key={it}
                        className="label rounded-full border border-paper-line px-3 py-2 text-on-paper-dim"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <StatementBand
        src="/brand/glass-stack.jpeg"
        objectPosition="60% center"
        fluteOn="left"
      >
        Ten disciplines, one team, and a{" "}
        single brief to write.
      </StatementBand>

      <ClosingCta
        headline="Not sure which of these you"
        accent="need?"
        body="Send us what you have — a deck, a report, a brand piece. We'll come back with a one-page read on what's working, what isn't, and which of the ten actually applies."
      />
    </Page>
  );
}
