import { notFound } from "next/navigation";
import { Page, PageHead, ClosingCta, SHELL } from "@/components/page-shell";
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
  const showTable = role === "cfo";

  return (
    <Page>
      <PageHead eyebrow={a.role} headline={a.headline} lede={a.lede} />

      <section className="bg-paper py-24 md:py-32">
        <div className={`${SHELL} grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20`}>
          <p className="text-[1.02rem] leading-relaxed text-on-paper-dim">
            {a.body}
          </p>
          <blockquote className="self-start border-l-2 border-accent pl-7">
            <p className="font-display text-[clamp(1.4rem,2.5vw,2rem)] leading-snug tracking-[-0.02em]">
              {a.pull}
            </p>
          </blockquote>
        </div>
      </section>

      <section className="bg-paper-soft py-24 md:py-32">
        <div className={SHELL}>
          <p className="label text-on-paper-dim">What that looks like</p>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
            {a.points.map((p, i) => (
              <div key={p.title}>
                <p className="font-display text-4xl text-grad-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-5 font-display text-xl font-medium tracking-[-0.02em]">
                  {p.title}
                </h2>
                <p className="mt-4 text-[0.97rem] leading-relaxed text-on-paper-dim">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-16 max-w-3xl font-display text-[clamp(1.3rem,2.2vw,1.8rem)] leading-snug tracking-[-0.02em]">
            {a.close}
          </p>
        </div>
      </section>

      {showTable ? (
        <section className="bg-ink py-24 text-on-ink md:py-32">
          <div className={SHELL}>
            <p className="label text-on-ink-dim">The real cost of each option</p>
            <div className="mt-12 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
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
                          i === COMPARISON.columns.length - 1
                            ? "text-accent-on-ink"
                            : "text-on-ink-dim"
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
                            i === COMPARISON.columns.length - 1
                              ? "text-on-ink"
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
      ) : null}

      <ClosingCta
        headline={
          role === "cfo" ? "See where it's leaking." : "See it before you commit."
        }
        body={a.offer}
        cta={role === "cfo" ? "Book a call" : "Send us a deck"}
      />
    </Page>
  );
}
