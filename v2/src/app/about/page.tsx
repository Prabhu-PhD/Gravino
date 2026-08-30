import {
  Page,
  PageHead,
  ClosingCta,
  StatementBand,
  Figure,
  SHELL,
} from "@/components/page-shell";
import { SectionHead } from "@/components/editorial";
import { MODEL, SECTORS, SITE, BALANCE } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `A senior ${SITE.teamSize}-person core team with ${SITE.experienceYears}+ years of combined experience, working across ${SITE.markets}.`,
};

const TOTAL = "04";

/* TODO(confirm): the four team members — names, roles, bios, photos. The
   brochure only says "a senior 〔4-person〕 core team", so this section is the
   shape of the facts we actually have rather than invented biographies. */
const FACTS = [
  [`${SITE.teamSize}`, "Senior practitioners at the core"],
  [`${SITE.experienceYears}+`, "Years of combined experience"],
  ["10", "Disciplines covered in-house"],
  ["1", "Point of contact, whatever the format"],
] as const;

export default function About() {
  return (
    <Page>
      <PageHead
        headline="A senior team, built around one"
        accent="discipline."
        lede={`${SITE.experienceYears}+ years of combined experience in the rooms where communication decides the outcome — seed rounds, boardrooms, IPO roadshows, and the reporting that follows.`}
      />

      <section className="bg-paper py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead>
            Every high-stakes communication is a{" "}
            balancing act.
          </SectionHead>

          <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <div>
              <p className="text-[1.02rem] leading-relaxed text-on-paper-dim">
                {BALANCE.body}
              </p>
              <p className="mt-10 font-display text-[clamp(1.5rem,2.7vw,2.2rem)] leading-snug tracking-[-0.025em]">
                {SITE.tagline.split(" ").slice(0, 2).join(" ")}{" "}
                {SITE.tagline.split(" ").slice(2).join(" ")}
                .
              </p>
              <p className="mt-10 text-[1.02rem] leading-relaxed text-on-paper-dim">
                {BALANCE.close}
              </p>
            </div>
            <Figure
              src="/brand/glass-ribbon-balance.jpeg"
              alt="A glass sphere resting in balance on a folded glass ribbon"
              caption={SITE.lockupLine}
            />
          </div>
        </div>
      </section>

      <section className="bg-paper-soft py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead>
            How the work holds up.
          </SectionHead>
          <div className="mt-14">
            {MODEL.map((m) => (
              <div
                key={m.n}
                className="grid gap-4 border-t border-paper-line py-9 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <p className="font-display text-4xl leading-none text-grad-2">
                  {m.n}
                </p>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.97rem] leading-relaxed text-on-paper-dim">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StatementBand
        src="/brand/glass-sphere-swirl.jpeg"
        objectPosition="20% center"
        fluteOn="left"
      >
        We understood the business faster, and covered more of it, than anyone
        else they&rsquo;d worked with.
      </StatementBand>

      <section className="bg-paper py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead>
            Small on purpose, senior by{" "}
            design.
          </SectionHead>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map(([v, k]) => (
              <div key={k} className="card p-7">
                <p className="font-display text-4xl tracking-tight">{v}</p>
                <p className="mt-4 border-t border-paper-line pt-4 text-sm leading-relaxed text-on-paper-dim">
                  {k}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <p className="label text-on-paper-dim">Sectors</p>
            <ul className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
              {SECTORS.map((s) => (
                <li key={s} className="bg-paper px-6 py-8">
                  <span className="label text-on-paper-dim">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <ClosingCta
        headline="The fastest way to see how we"
        accent="think."
        body="Send us your current deck, report or brand piece. We'll return a one-page teardown — what's working, what's costing you, and what we'd change."
      />
    </Page>
  );
}
