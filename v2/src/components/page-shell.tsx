import { CosmicNav, CosmicFooter } from "./cosmic-chrome";
import { IntakeModal } from "./intake-form";
import { CelestialFigure } from "./celestial-figure";

/* ===========================================================================
 * Interior page furniture, in the cosmic idiom.
 * ---------------------------------------------------------------------------
 * This replaces the editorial set it grew out of: a pale hero wash, visible
 * measure lines, corner crop marks, hairline section rules, a fluted-glass
 * statement band. That system was coherent on its own terms and belonged to a
 * different site. Kept beside the adopted home page it produced pages that
 * were dark but not cosmic, and the seams showed.
 *
 * Two faults it was called out for, fixed here rather than patched:
 *
 * 1. SPACE. Sections ran py-20 to py-36 with mt-14 inside them. On a reading
 *    page that is a lot of nothing between a heading and its content, and it
 *    is most of why the pages felt padded out. Sections here are py-16 /
 *    md:py-20, close to what the home page runs.
 *
 * 2. EYEBROWS EVERYWHERE. A mono kicker above every section is a template
 *    rather than a decision, and it reads as filler. There is exactly ONE per
 *    page now, on the page head, where it says what kind of page this is.
 *    `Section` and `Head` do not accept one.
 * ======================================================================== */

import { SHELL } from "@/lib/shell";
export { SHELL };

/** The brand-hue glow discs the cosmic sections sit on.
 *
 *  Faded out towards the section's top and bottom edges. The discs sit
 *  partly outside the section (-top-24, -bottom-32) and the section clips
 *  them, so without the fade each one ended in a hard straight line across
 *  the page (review, 2026-10-08). */
function Orbs() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_65%,transparent)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[12%] h-[420px] w-[420px] rounded-full bg-[#7b3fe4]/18 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[10%] h-[380px] w-[380px] rounded-full bg-[#20c4f4]/10 blur-[130px]"
      />
    </div>
  );
}

export function PageHead({
  eyebrow,
  headline,
  accent,
  lede,
  figure = false,
  compact = false,
  children,
}: {
  /** The one kicker on the page. */
  eyebrow: string;
  headline: string;
  /** The single word or phrase carrying the gradient. */
  accent?: string;
  lede?: string;
  /** Put the celestial body to the right of the head.
   *
   *  Off by default, so adding a page does not silently add a WebGL context.
   *  On for about / services / portfolio. Off for privacy and terms, where a
   *  moving animation beside legal text is odd, and off for contact, where it
   *  would compete with the form the visitor came to fill in. One word to
   *  change your mind on any of them. */
  figure?: boolean;
  /** A shorter head, for pages whose job sits right under it (the contact
   *  form). Review, 2026-10-08: the full head pushed the form to the bottom
   *  of the first screen. */
  compact?: boolean;
  /** Anything that belongs to the head, under the lede (the Services jump
   *  links). Inside the section, so it can never be painted over by it. */
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "pt-28 pb-8 md:pt-32 md:pb-10" : "pt-36 pb-16 md:pt-44 md:pb-20"} ${
        // Room for the figure, which is taller than this head would otherwise be.
        figure ? "lg:min-h-[44rem] xl:min-h-[52rem]" : ""
      }`}
      style={{
        background:
          "radial-gradient(circle at 50% 0%, #171033 0%, #0b0917 55%, #09090f 100%)",
      }}
    >
      <Orbs />
      {figure ? <CelestialFigure /> : null}
      <div className={`${SHELL} relative`}>
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa]">
          {eyebrow}
        </p>
        <h1
          className={`mt-5 ${compact ? "text-[clamp(2rem,4.4vw,3.4rem)]" : "text-[clamp(2.4rem,5.8vw,4.5rem)]"} font-light leading-[1.08] tracking-[-0.03em] text-white ${
            /* Yield width to the figure rather than running under the sphere.
             * Only from lg, which is the only place the figure exists. */
            figure ? "max-w-4xl lg:max-w-[33rem] xl:max-w-[40rem]" : "max-w-4xl"
          }`}
        >
          {headline}
          {accent ? (
            <>
              {" "}
              <span className="bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] bg-clip-text font-normal text-transparent">
                {accent}
              </span>
            </>
          ) : null}
        </h1>
        {lede ? (
          <p
            className={`${compact ? "mt-4" : "mt-7"} text-[1.0625rem] font-light leading-[1.65] text-slate-300 sm:text-lg ${
              figure ? "max-w-2xl lg:max-w-[31rem]" : "max-w-2xl"
            }`}
          >
            {lede}
          </p>
        ) : null}
        {children ? <div className={compact ? "mt-6" : "mt-9"}>{children}</div> : null}
      </div>
    </section>
  );
}

/** A plain content section. `tone` alternates the ground so a long page has
 *  rhythm without a device announcing each change. */
export function Section({
  children,
  tone = "base",
  orbs = false,
  id,
}: {
  children: React.ReactNode;
  tone?: "base" | "raised";
  orbs?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden border-t border-white/[0.07] py-16 md:py-20 ${
        tone === "raised" ? "bg-[#0d0b18]" : "bg-[#09090f]"
      }`}
    >
      {orbs ? <Orbs /> : null}
      <div className={`${SHELL} relative`}>{children}</div>
    </section>
  );
}

/** Section heading. No kicker, by design. */
export function Head({
  children,
  accent,
  lede,
}: {
  children: React.ReactNode;
  accent?: string;
  lede?: string;
}) {
  return (
    <div className="max-w-3xl">
      <h2 className="text-[clamp(1.6rem,3vw,2.4rem)] font-light leading-[1.18] tracking-tight text-white">
        {children}
        {accent ? (
          <>
            {" "}
            <span className="bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] bg-clip-text font-normal text-transparent">
              {accent}
            </span>
          </>
        ) : null}
      </h2>
      {lede ? (
        <p className="mt-4 text-[0.95rem] font-light leading-relaxed text-slate-400">
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Surfaces
 * ---------------------------------------------------------------------------
 * The interior pages were text on a flat ground with hairline rules: one
 * surface for the whole page, so nothing read as an object and the eye had
 * nothing to land on. The home page does not work that way. Its panels are
 * translucent black over the starfield with a blur behind them, which is why
 * they sit ON the page rather than in it.
 *
 * Same construction here, at the smaller scale a reading page needs: a low
 * alpha lift, a 1px border, a lit top edge, and a blur so the glow orbs
 * behind actually come through. The hover state brightens the border rather
 * than moving anything, because a page of cards that all lift on hover is
 * noise.
 * ------------------------------------------------------------------------ */

const CARD_BASE =
  "relative overflow-hidden rounded-2xl border border-white/10 " +
  "bg-gradient-to-b from-white/[0.055] to-white/[0.015] backdrop-blur-sm " +
  "shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] transition-colors duration-300";

/** The lit top edge. One bright hairline is most of what says "glass". */
function Lip() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
    />
  );
}

export function Card({
  children,
  className = "",
  interactive = true,
}: {
  children: React.ReactNode;
  className?: string;
  /** Off for cards that are not links and should not suggest they are. */
  interactive?: boolean;
}) {
  return (
    <div
      className={`${CARD_BASE} ${
        interactive ? "hover:border-[#a78bfa]/40" : ""
      } ${className}`}
    >
      <Lip />
      {children}
    </div>
  );
}

/** A larger surface for one big thing: a table, a form, a figure. */
export function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0a14]/80 backdrop-blur-sm shadow-[0_24px_60px_-30px_rgba(0,0,0,0.95)] ${className}`}
    >
      <Lip />
      {children}
    </div>
  );
}

/** Section opener with an index, so a long page has visible structure. */
export function SectionMark({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-7 flex items-center gap-4">
      <span className="text-sm font-mono text-[#a78bfa]">{n}</span>
      <span aria-hidden className="h-px flex-1 bg-white/12" />
      <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-slate-400">
        {label}
      </span>
    </div>
  );
}

/**
 * A statement band: the one loud line on a page.
 *
 * The first version set it left-aligned at roughly heading size with a small
 * label underneath, which meant it read as another paragraph rather than as
 * the thing the page is saying. Emphasis is not just size; it is what the
 * eye lands on first and how much room it is given.
 *
 * So: the label moves ABOVE, where it introduces rather than footnotes. A
 * gradient rule runs down the left edge and marks the whole block as one
 * utterance. The type is larger, the measure is narrower so the lines break
 * where a person would pause, and the band is given real vertical room. One
 * per page, or the emphasis is worth nothing.
 */
export function Statement({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <section
      className="relative overflow-hidden border-t border-white/[0.07] py-24 md:py-32"
      style={{
        background:
          "radial-gradient(90% 120% at 12% 50%, #1b1140 0%, #0c0a1a 55%, #09090f 100%)",
      }}
    >
      <Orbs />
      <div className={`${SHELL} relative`}>
        <div className="relative max-w-3xl pl-7 sm:pl-10">
          {/* The rule that binds the block together. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-gradient-to-b from-[#a78bfa] via-[#60a5fa] to-transparent"
          />
          {attribution ? (
            <p className="mb-5 text-[11px] font-mono uppercase tracking-[0.22em] text-[#a78bfa]">
              {attribution}
            </p>
          ) : null}
          <p className="text-[clamp(1.75rem,4.2vw,3.15rem)] font-light leading-[1.22] tracking-[-0.025em] text-white">
            {children}
          </p>
        </div>
      </div>
    </section>
  );
}

/** The closing band every interior page ends on. One route out: the form. */
export function CtaBand({
  headline,
  accent,
  body,
}: {
  headline: string;
  accent?: string;
  body: string;
}) {
  return (
    <section
      className="relative overflow-hidden border-t border-white/10 py-20 md:py-24"
      style={{
        background:
          "linear-gradient(to bottom, #09090f 0%, #13172e 55%, #050507 100%)",
      }}
    >
      <Orbs />
      <div className={`${SHELL} relative`}>
        <div className="max-w-2xl">
          <h2 className="text-[clamp(1.7rem,3.2vw,2.6rem)] font-light leading-[1.16] tracking-tight text-white">
            {headline}
            {accent ? (
              <>
                {" "}
                <span className="bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] bg-clip-text font-normal text-transparent">
                  {accent}
                </span>
              </>
            ) : null}
          </h2>
          <p className="mt-5 text-base font-light leading-relaxed text-slate-300">
            {body}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            {/* Opens the form rather than navigating to the page that has
                the form on it. One fewer step to the thing being asked for. */}
            {/* Same look as the header's Start a Project (black glass, cyan
                edge, mono capitals, live dot), a size up because here it is
                the section's one action rather than a header control. */}
            <button className="trigger-intake group flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-black/75 px-6 py-3 font-mono text-xs uppercase tracking-wider text-cyan-200 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-cyan-300 hover:bg-black/95 hover:text-white">
              <span aria-hidden className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse transition-transform group-hover:scale-125" />
              <span>Start a project</span>
              <span aria-hidden className="text-cyan-300 transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </button>
            {/* The bare create@gravino.in link that sat here was removed
                (client request, 2026-09-27): it offered a second, competing
                action beside the one this band exists for, and the address is
                already in the footer's Contact column just below and on
                /contact. */}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CosmicNav />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <CosmicFooter />
      {/* Site wide, so "Start a Project" has somewhere to open. */}
      <IntakeModal />
    </>
  );
}
