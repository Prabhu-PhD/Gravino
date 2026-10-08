import { pageMeta, breadcrumbLd, servicesLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Page, PageHead, CtaBand, SHELL } from "@/components/page-shell";
import { CAPABILITIES, GLYPHS } from "@/content/capabilities";

export const metadata = pageMeta({
  path: "/services/",
  title: "What we cover | Business communication, brand, marketing, experience | Gravino",
  description:
    "Business Communication, Brand Identity, Marketing & Growth, and Experience & Engagement: four capabilities from one embedded partner.",
});

/* WHAT WE COVER, IN FULL (rebuilt 2026-10-08, review).
 * ---------------------------------------------------------------------------
 * The client: one set of capability names across the site, fewer words, and
 * the deliverables shown visually rather than as bullets. So this page reads
 * from content/capabilities.ts, the same source as the home page section,
 * and each deliverable is a small drawing of its format with its name and
 * one short line. The double titles ("Win the room: High-stakes corporate
 * communications"), the paragraphs and the bullets are gone.
 *
 * The header no longer carries the planet (it was the same 44-52rem block
 * on four pages); jump links to the four capabilities sit under it instead.
 */

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
      />

      <nav aria-label="Capabilities" className={`${SHELL} -mt-4 pb-12 md:pb-16`}>
        {/* One swipeable row on phones; stacked, the four took four lines. */}
        <ul className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
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

      {CAPABILITIES.map((c, i) => (
        <section
          key={c.id}
          id={c.id}
          aria-labelledby={`${c.id}-title`}
          className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.07] py-14 md:py-20"
          style={{
            background:
              i % 2
                ? "radial-gradient(circle at 70% 30%, #120d26 0%, #09090f 70%)"
                : "radial-gradient(circle at 25% 35%, #0f0c1d 0%, #06060a 75%)",
          }}
        >
          <div
            aria-hidden
            className={`pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-[150px] ${
              i % 2 ? "right-[8%] bottom-0 bg-[#20c4f4]/10" : "left-[8%] top-0 bg-[#7b3fe4]/14"
            }`}
          />
          <div className={`${SHELL} relative`}>
            <div className="flex items-end gap-5 md:gap-7">
              <span
                aria-hidden
                className="bg-gradient-to-b from-[#f0abfc] via-[#a855f7] to-[#38bdf8] bg-clip-text text-[clamp(3rem,8vw,5.5rem)] font-extralight leading-[0.85] tracking-tight text-transparent"
              >
                {c.n}
              </span>
              <div className="pb-1">
                <h2 id={`${c.id}-title`} className="text-2xl font-medium leading-tight tracking-tight text-[#c084fc] sm:text-[28px] md:text-[32px]">
                  {c.name}
                </h2>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-slate-200 md:text-[15px]">{c.line}</p>
              </div>
            </div>

            {/* Phones: three compact tiles across, drawing and name (the note
                made each deliverable a full-width row: 7 screens, measured).
                From sm: wide tiles, drawing beside name and note. */}
            <ul className="mt-8 grid grid-cols-3 gap-2 sm:mt-9 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3" aria-label={`${c.name}: what we make`}>
              {c.deliverables.map((d) => (
                <li
                  key={d.name}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-white/[0.015] px-1.5 py-3 text-center text-slate-300 transition-colors hover:border-[#a78bfa]/40 hover:text-white sm:flex-row sm:gap-4 sm:rounded-2xl sm:p-4 sm:text-left"
                >
                  <span
                    aria-hidden
                    className="grid h-10 w-full shrink-0 place-items-center rounded-xl bg-[radial-gradient(closest-side,rgba(123,63,228,0.24),transparent)] sm:h-16 sm:w-20"
                  >
                    <svg viewBox="0 0 64 48" focusable="false" className="h-[37px] w-[50px] sm:h-12 sm:w-16" dangerouslySetInnerHTML={{ __html: GLYPHS[d.glyph] }} />
                  </span>
                  <span>
                    <span className="block text-[11.5px] leading-tight text-slate-100 sm:text-[15px] sm:font-medium sm:leading-snug sm:text-white">{d.name}</span>
                    <span className="mt-0.5 hidden text-[13px] leading-snug text-slate-400 sm:block">{d.note}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <CtaBand
        headline="Not sure which of these you"
        accent="need?"
        body="Tell us what you are working on and when it is due. A senior member of our team replies within a working day with how we would approach it."
      />
    </Page>
  );
}
