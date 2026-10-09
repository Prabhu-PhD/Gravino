import { pageMeta, breadcrumbLd, servicesLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Page, PageHead, CtaBand, SHELL } from "@/components/page-shell";
import { CAPABILITIES, GLYPHS } from "@/content/capabilities";
import { DotIcons } from "@/components/dot-icons";
import { getCase, type CaseStudy } from "@/lib/work";

export const metadata = pageMeta({
  path: "/services/",
  title: "What we cover | Business communication, brand, marketing, experience | Gravino",
  description:
    "Business Communication, Brand Identity, Marketing & Growth, and Experience & Engagement: four capabilities from one embedded partner, and the work each one covers.",
});

/* WHAT WE COVER, IN DETAIL (rebuilt again 2026-10-08, the client: "there is
 * nothing 'in detail' about the service, it is the same box again").
 * ---------------------------------------------------------------------------
 * The home page is the summary: each capability's drawings and names. This
 * page is what its "See ... in detail" links promise, so per capability it
 * adds what the summary leaves out:
 *
 *   - what the capability is for, in two sentences (content/capabilities.ts
 *     `detail`, drawn from the site's earlier copy);
 *   - all twelve deliverables, each with the line saying what it is;
 *   - the case studies that show it (`work`), with their covers.
 *
 * Layout: the intro column holds still (sticky) while the twelve scroll
 * past it on desktop; stacked on phones. The deliverables sit on the same
 * hairline grid as the home page, not in boxes. Sections clip with
 * overflow:clip, not hidden, because hidden makes a scroll container and
 * sticky stops working inside one.
 */

const GRID_LINE = "rgba(255,255,255,0.075)";

function Related({ cases }: { cases: CaseStudy[] }) {
  if (!cases.length) return null;
  return (
    <div className="mt-8 md:mt-10">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">Seen in</p>
      <ul className="mt-3 grid gap-1">
        {cases.map((w) => (
          <li key={w.slug}>
            <a
              href={`/portfolio/${w.slug}/`}
              className="group -mx-2 flex items-center gap-3.5 rounded-xl p-2 transition-colors hover:bg-white/[0.045]"
            >
              {/* Decorative: the title beside it names the project. */}
              <img
                src={w.cover}
                alt=""
                loading="lazy"
                className="h-12 w-[4.75rem] shrink-0 rounded-lg object-cover ring-1 ring-white/10"
                style={{ objectPosition: w.coverPosition ?? "center" }}
              />
              <span className="min-w-0">
                <span className="block text-[15px] leading-tight text-white">{w.title}</span>
                <span className="mt-0.5 block text-[12.5px] text-slate-400">{w.kind}</span>
              </span>
              <span aria-hidden className="ml-auto pr-1 text-slate-500 transition-colors group-hover:text-white">
                &rarr;
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Services() {
  return (
    <Page>
      <JsonLd data={breadcrumbLd("What we cover", "/services/")} />
      <JsonLd data={servicesLd()} />
      <PageHead
        eyebrow="What we cover"
        headline="Four capabilities,"
        accent="one embedded partner."
        lede="The same people across every format, from the board deck to the launch film."
      >
        <nav aria-label="Capabilities">
          {/* One swipeable row on phones; stacked, the four took four lines. */}
          <ul className="-mx-6 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {CAPABILITIES.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="inline-flex min-h-11 items-center gap-2.5 whitespace-nowrap rounded-full border border-white/12 bg-white/[0.04] px-4 text-sm text-slate-200 transition-colors hover:border-[#a78bfa]/50 hover:text-white"
                >
                  <span className="font-mono text-[11px] text-[#a78bfa]">{c.n}</span>
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHead>

      {CAPABILITIES.map((c, i) => {
        const cases = c.work.map(getCase).filter((w): w is CaseStudy => Boolean(w));
        return (
          <section
            key={c.id}
            id={c.id}
            aria-labelledby={`${c.id}-title`}
            className="relative scroll-mt-20 overflow-clip border-t border-white/[0.07] py-16 md:py-24"
            style={{
              background:
                i % 2
                  ? "radial-gradient(circle at 75% 30%, #110d22 0%, #09090f 70%)"
                  : "radial-gradient(circle at 20% 30%, #0f0c1d 0%, #07070c 75%)",
            }}
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-[150px] ${
                i % 2 ? "right-[6%] top-[20%] bg-[#20c4f4]/[0.08]" : "left-[4%] top-[12%] bg-[#7b3fe4]/[0.13]"
              }`}
            />
            <div className={`${SHELL} relative grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16`}>
              {/* The intro: holds still beside the twelve on desktop. */}
              <div className="lg:sticky lg:top-28 lg:self-start">
                <span
                  aria-hidden
                  className="block bg-gradient-to-b from-[#f0abfc] via-[#a855f7] to-[#38bdf8] bg-clip-text pb-1 text-[clamp(3.25rem,7vw,5rem)] font-extralight leading-none tracking-tight text-transparent"
                >
                  {c.n}
                </span>
                <h2
                  id={`${c.id}-title`}
                  className="mt-3 text-[1.75rem] font-medium leading-tight tracking-tight text-[#c084fc] md:text-[2.125rem]"
                >
                  {c.name}
                </h2>
                <p className="mt-3 text-[17px] font-light leading-snug text-white md:text-lg">{c.line}</p>
                <p className="mt-4 max-w-md text-[15px] font-light leading-relaxed text-slate-300">{c.detail}</p>
                <Related cases={cases} />
              </div>

              {/* The twelve, each with what it is. Two across from sm, on the
                  hairline grid: a rule between the columns, and under every
                  row but the last. */}
              <ul className="grid sm:grid-cols-2" aria-label={`${c.name}: what we make`}>
                {c.deliverables.map((d, k) => {
                  const last = k === c.deliverables.length - 1;
                  const lastRowSm = k >= c.deliverables.length - 2;
                  const left = k % 2 === 0;
                  return (
                    <li
                      key={d.name}
                      className={`group flex items-start gap-4 py-4 sm:py-5 ${left ? "sm:pr-5 sm:border-r" : "sm:pl-5"} ${
                        last ? "" : "border-b"
                      } ${lastRowSm ? "sm:border-b-0" : ""}`}
                      style={{ borderColor: GRID_LINE }}
                    >
                      {/* The icon as dots, drawn still here (this page is for
                          reading); the line drawing is the no-JS fallback. */}
                      <span aria-hidden data-glyph={d.glyph} className="mt-0.5 shrink-0">
                        <svg
                          viewBox="0 0 64 48"
                          focusable="false"
                          className="block h-[44px] w-[58px] overflow-visible text-slate-300"
                          dangerouslySetInnerHTML={{ __html: GLYPHS[d.glyph] }}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium leading-snug text-white">{d.name}</span>
                        <span className="mt-1 block text-[13.5px] leading-snug text-slate-400">{d.note}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        );
      })}

      <DotIcons />
      <CtaBand
        headline="Not sure which of these you"
        accent="need?"
        body="Tell us what you are working on and when it is due. A senior member of our team replies within a working day with how we would approach it."
      />
    </Page>
  );
}
