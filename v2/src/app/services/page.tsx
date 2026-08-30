import { Page, PageHead, ClosingCta, SHELL } from "@/components/page-shell";
import { GROUPS } from "@/lib/site";

export const metadata = {
  title: "What we cover",
  description:
    "Ten disciplines across capital and corporate narrative, brand and identity, growth and digital, and public and physical experience.",
};

export default function Services() {
  return (
    <Page>
      <PageHead
        eyebrow="What we cover"
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
            <div className="flex items-baseline gap-5">
              <span className="label text-accent">{g.n}</span>
              <h2 className="display text-[clamp(1.6rem,3vw,2.4rem)]">
                {g.name}
              </h2>
            </div>
            <p className="mt-4 max-w-2xl text-[1.02rem] leading-relaxed text-on-paper-dim">
              {g.premise}
            </p>

            <div className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {g.disciplines.map((d) => (
                <article key={d.n}>
                  <p className="label text-on-paper-dim">{d.n}</p>
                  <h3 className="mt-4 font-display text-[1.35rem] font-medium leading-snug tracking-[-0.02em]">
                    {d.title}
                  </h3>
                  <p className="label mt-2 text-accent">{d.kind}</p>
                  <p className="mt-5 text-[0.97rem] leading-relaxed text-on-paper-dim">
                    {d.blurb}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
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

      <ClosingCta
        headline="Not sure which of these you need?"
        body="Send us what you have — a deck, a report, a brand piece. We'll come back with a one-page read on what's working, what isn't, and which of the ten actually applies."
      />
    </Page>
  );
}
