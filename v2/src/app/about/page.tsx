import { Page, PageHead, ClosingCta, SHELL } from "@/components/page-shell";
import { MODEL, SECTORS, SITE, BALANCE } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `A senior ${SITE.teamSize}-person core team with ${SITE.experienceYears}+ years of combined experience, working across ${SITE.markets}.`,
};

export default function About() {
  return (
    <Page>
      <PageHead
        eyebrow="About"
        headline="A senior team, built around one"
        accent="discipline."
        lede={`${SITE.experienceYears}+ years of combined experience in the rooms where communication decides the outcome — seed rounds, boardrooms, IPO roadshows, and the reporting that follows.`}
      />

      <section className="bg-paper py-24 md:py-32">
        <div className={`${SHELL} grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20`}>
          <div>
            <p className="label text-on-paper-dim">{BALANCE.label}</p>
            <h2 className="display mt-6 text-[clamp(1.8rem,3.2vw,2.8rem)]">
              {BALANCE.headline}
            </h2>
          </div>
          <div>
            <p className="text-[1.02rem] leading-relaxed text-on-paper-dim">
              {BALANCE.body}
            </p>
            <p className="mt-10 font-display text-[clamp(1.4rem,2.5vw,2rem)] leading-snug tracking-[-0.025em]">
              {SITE.tagline}.
            </p>
            <p className="mt-10 text-[1.02rem] leading-relaxed text-on-paper-dim">
              {BALANCE.close}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-soft py-24 md:py-32">
        <div className={SHELL}>
          <p className="label text-on-paper-dim">The Gravino model</p>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {MODEL.map((m) => (
              <div key={m.n}>
                <p className="font-display text-4xl text-grad-2">{m.n}</p>
                <h2 className="mt-5 font-display text-xl font-medium tracking-[-0.02em]">
                  {m.title}
                </h2>
                <p className="mt-4 text-[0.97rem] leading-relaxed text-on-paper-dim">
                  {m.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODO(confirm): the four team members — names, roles, bios, photos.
          The brochure only says "a senior 〔4-person〕 core team", so the
          section is the shape of the facts we actually have. */}
      <section className="bg-paper py-24 md:py-32">
        <div className={SHELL}>
          <p className="label text-on-paper-dim">The team</p>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              [`${SITE.teamSize}`, "Senior practitioners at the core"],
              [`${SITE.experienceYears}+`, "Years of combined experience"],
              ["10", "Disciplines covered in-house"],
              ["1", "Point of contact, whatever the format"],
            ].map(([v, k]) => (
              <div key={k} className="border-t border-paper-line pt-6">
                <p className="font-display text-4xl tracking-tight">{v}</p>
                <p className="mt-3 text-sm leading-relaxed text-on-paper-dim">
                  {k}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20">
            <p className="label text-on-paper-dim">Sectors</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {SECTORS.map((s) => (
                <li
                  key={s}
                  className="label rounded-full border border-paper-line px-4 py-2.5 text-on-paper-dim"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[1.02rem] text-on-paper-dim">
              Based in {SITE.location}. Engagements across {SITE.markets}.
            </p>
          </div>
        </div>
      </section>

      <ClosingCta
        headline="The fastest way to see how we think."
        body="Send us your current deck, report or brand piece. We'll return a one-page teardown — what's working, what's costing you, and what we'd change."
      />
    </Page>
  );
}
