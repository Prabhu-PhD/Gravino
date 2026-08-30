import Link from "next/link";
import { FlutedGlass } from "./fluted-glass";
import { SITE, NAV } from "@/lib/site";

/* Glass geometry, per breakpoint (see FlutedGlass — it reads these as CSS
   vars so the two compositions can genuinely differ):
     mobile  — a horizontal band across the headline only. There is no room
               for a copy column beside a full-height pane at 375px, and
               letting the pane slice the body copy makes it unreadable.
     desktop — a full-height wall on the right that only the headline crosses. */
const GLASS_VARS =
  "[--glass-from:26%] [--glass-top:15%] [--glass-bottom:66%] " +
  "md:[--glass-from:50%] md:[--glass-top:0%] md:[--glass-bottom:0%] " +
  "lg:[--glass-from:44%]";

const FACTS = [
  { v: "75+", k: "Years combined" },
  { v: "04", k: "Specialisms" },
  { v: "1 wk", k: "Typical turnaround" },
] as const;

export function Hero() {
  return (
    <section className="relative min-h-svh overflow-hidden bg-ink text-on-ink">
      {/* --- Ground: the single saturated gradient, blooming from behind the
              glass edge so the pane has something to refract. ------------- */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(70% 55% at 88% 12%, color-mix(in oklab, var(--color-grad-1) 62%, transparent) 0%, transparent 68%),
            radial-gradient(55% 45% at 99% 88%, color-mix(in oklab, var(--color-grad-4) 42%, transparent) 0%, transparent 62%),
            radial-gradient(95% 85% at 42% 108%, color-mix(in oklab, var(--color-grad-0) 75%, transparent) 0%, transparent 72%),
            var(--color-ink)
          `,
        }}
      />
      <div aria-hidden className="grain-layer" />

      {/* --- Glass + the copy that passes behind it --------------------- */}
      <FlutedGlass
        ribs={18}
        magnify={1.17}
        className={`absolute inset-0 ${GLASS_VARS}`}
      >
        <div className="mx-auto flex h-full max-w-[92rem] flex-col justify-center px-6 pt-28 pb-20 md:px-12">
          <p className="label text-on-ink-dim">
            Design department on tap
          </p>

          {/* The headline deliberately runs past the 50% mark — that crossing
              IS the hero. "value." lands inside the glass. */}
          <h1 className="display mt-7 max-w-[14ch] text-[clamp(2.9rem,9.1vw,8.6rem)]">
            Where balance
            <br />
            meets value.
          </h1>

          {/* Everything below stays left of the glass edge. */}
          <div className="md:max-w-[42%] lg:max-w-[38%]">
            <p className="mt-9 max-w-[46ch] text-[0.98rem] leading-relaxed text-on-ink-dim sm:text-base">
              A senior design team you don&rsquo;t have to hire. Presentations,
              documentation, print and digital &mdash; shipped on a steady
              monthly cadence, at a rate that makes the decision easy.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-on-ink px-6 py-3 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start a project
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
              <Link
                href="#work"
                className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm text-on-ink transition-colors duration-300 hover:border-white/60"
              >
                See the work
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
              {FACTS.map((f) => (
                <div key={f.k}>
                  <div className="font-display text-2xl tracking-tight">
                    {f.v}
                  </div>
                  <div className="label mt-2 text-on-ink-dim">{f.k}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </FlutedGlass>

      {/* --- Nav sits ON the glass, not behind it (SWI puts its lockup on top
              of the pane too), so it stays crisp and clickable. ---------- */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between px-6 py-7 md:px-12">
          <Link href="#top" className="font-display text-xl tracking-tight">
            {SITE.wordmark}
          </Link>
          <nav className="hidden items-center gap-9 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="label text-on-ink/75 transition-colors hover:text-on-ink"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href="#contact"
            className="label rounded-full border border-white/25 px-4 py-2.5 transition-colors hover:border-white/60"
          >
            Start a project
          </Link>
        </div>
      </header>

      {/* Corner marks — the opac / TQA grid furniture. */}
      <div className="label absolute bottom-7 left-6 z-20 hidden text-on-ink-dim sm:block md:left-12">
        {SITE.location}
      </div>
      <div className="label absolute right-6 bottom-7 z-20 text-on-ink-dim md:right-12">
        Est. 2026 &nbsp;/&nbsp; {SITE.domain}
      </div>
    </section>
  );
}
