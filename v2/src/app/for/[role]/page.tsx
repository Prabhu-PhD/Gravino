import { notFound } from "next/navigation";
import {
  Page,
  PageHead,
  ClosingCta,
  StatementBand,
  SHELL,
} from "@/components/page-shell";
import { SectionHead, Pull } from "@/components/editorial";
import { AUDIENCES, COMPARISON } from "@/lib/site";

type Role = keyof typeof AUDIENCES;
const ROLES = Object.keys(AUDIENCES) as Role[];

export function generateStaticParams() {
  return ROLES.map((role) => ({ role }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const a = AUDIENCES[role as Role];
  if (!a) return {};
  return { title: a.role, description: a.headline };
}

export default async function AudiencePage({
  params,
}: {
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  const a = AUDIENCES[role as Role];
  if (!a) notFound();

  /* The cost table belongs to the CFO's argument specifically — it is the
     whole case on that page, and a distraction on the CEO's. */
  const isCfo = role === "cfo";
  const total = isCfo ? "04" : "03";
  const last = COMPARISON.columns.length - 1;

  return (
    <Page>
      <PageHead
        index="01"
        eyebrow={a.role}
        headline={a.headline}
        lede={a.lede}
      />

      <section className="bg-paper py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead index="02" total={total} label="The position">
            {isCfo ? (
              <>
                The third <span className="text-gradient">option.</span>
              </>
            ) : (
              <>
                Where it is won and{" "}
                <span className="text-gradient">lost.</span>
              </>
            )}
          </SectionHead>

          <div className="mt-14 grid gap-14 border-t border-paper-line pt-12 md:grid-cols-[1fr_1fr] md:gap-20">
            <p className="text-[1.02rem] leading-relaxed text-on-paper-dim">
              {a.body}
            </p>
            <div className="self-start">
              <Pull>{a.pull}</Pull>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-soft py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead index="03" total={total} label="What that looks like">
            {isCfo ? (
              <>
                What that gives <span className="text-gradient">you.</span>
              </>
            ) : (
              <>
                Built like an in-house team. Positioned like a{" "}
                <span className="text-gradient">market leader.</span>
              </>
            )}
          </SectionHead>

          <div className="mt-14">
            {a.points.map((p, i) => (
              <div
                key={p.title}
                className="grid gap-4 border-t border-paper-line py-9 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <p className="font-display text-4xl leading-none text-grad-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.97rem] leading-relaxed text-on-paper-dim">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-12 max-w-3xl font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-snug tracking-[-0.02em]">
            {a.close}
          </p>
        </div>
      </section>

      {isCfo ? (
        <section className="bg-ink py-24 text-on-ink md:py-32">
          <div className={SHELL}>
            <SectionHead
              index="04"
              total={total}
              label="The real cost of each option"
              dark
            >
              Three ways to solve it. One{" "}
              <span className="text-gradient">that adds up.</span>
            </SectionHead>

            <div className="mt-14 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
              <table className="w-full min-w-[46rem] border-collapse text-left">
                <thead>
                  <tr>
                    <th className="label pb-5 font-normal text-on-ink-dim">
                      &nbsp;
                    </th>
                    {COMPARISON.columns.map((c, i) => (
                      <th
                        key={c}
                        className={`pb-5 font-display text-lg font-medium tracking-[-0.02em] ${
                          i === last ? "text-accent-on-ink" : "text-on-ink-dim"
                        }`}
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.rows.map((r) => (
                    <tr key={r.k} className="border-t border-ink-line">
                      <th
                        scope="row"
                        className="label py-5 pr-8 font-normal text-on-ink-dim"
                      >
                        {r.k}
                      </th>
                      {r.v.map((v, i) => (
                        <td
                          key={i}
                          className={`py-5 pr-8 text-[0.97rem] ${
                            i === last
                              ? "bg-white/[0.04] text-on-ink"
                              : "text-on-ink-dim"
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
          </div>
        </section>
      ) : (
        <StatementBand
          src="/brand/glass-sphere-swirl.jpeg"
          objectPosition="30% center"
          eyebrow="Seed rounds through IPO roadshows"
          fluteOn="left"
        >
          A brilliant strategy told badly loses to an average one told{" "}
          <span className="text-gradient">well.</span>
        </StatementBand>
      )}

      <ClosingCta
        headline={isCfo ? "See where it's" : "See it before you"}
        accent={isCfo ? "leaking." : "commit."}
        body={a.offer}
        cta={isCfo ? "Book a call" : "Send us a deck"}
      />
    </Page>
  );
}
