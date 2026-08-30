/* ===========================================================================
 * Editorial furniture.
 * ---------------------------------------------------------------------------
 * The pieces that made the reference set read as DESIGNED rather than
 * templated, and which a clean grotesk on white does not supply by itself:
 * a running index, hairline rules, corner marks, and micro-labels carrying
 * structure. opac, TQA, Rostelecom and Beyond XP all lean on exactly this.
 *
 * They are small on purpose. The point is a visible underlying grid, not
 * decoration competing with the headline.
 * ======================================================================== */

export const SHELL = "mx-auto max-w-[88rem] px-6 md:px-10";

/** A corner tick. Four of these frame a section the way opac frames a page. */
function Tick({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 12 12"
      className={`absolute h-3 w-3 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M6 0v12M0 6h12" opacity="0.35" />
    </svg>
  );
}

export function CornerMarks({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${className}`}
    >
      <Tick className="-top-1.5 -left-1.5" />
      <Tick className="-top-1.5 -right-1.5" />
      <Tick className="-bottom-1.5 -left-1.5" />
      <Tick className="-bottom-1.5 -right-1.5" />
    </div>
  );
}

/**
 * Section head: running index on the left, label and headline on the right,
 * separated by a hairline that runs the full measure. The index is what makes
 * a long page feel like a document rather than a stack of blocks.
 */
export function SectionHead({
  index,
  total,
  label,
  children,
  dark = false,
  lede,
}: {
  index: string;
  total: string;
  label: string;
  children: React.ReactNode;
  dark?: boolean;
  lede?: string;
}) {
  const dim = dark ? "text-on-ink-dim" : "text-on-paper-dim";
  return (
    <div>
      <div className={`flex items-center gap-6 border-t ${dark ? "border-ink-line" : "border-paper-line"} pt-5`}>
        <span className={`label ${dim}`}>
          {index}
          <span className="opacity-40"> / {total}</span>
        </span>
        <span className={`label ${dim}`}>{label}</span>
      </div>
      <h2 className="display mt-10 max-w-4xl text-[clamp(1.9rem,3.7vw,3.2rem)]">
        {children}
      </h2>
      {lede ? (
        <p className={`mt-7 max-w-2xl text-[1.02rem] leading-relaxed ${dim}`}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/** Pull quote with the accent rule and framing ticks. */
export function Pull({
  children,
  dark = false,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <figure className="relative max-w-3xl pl-7">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0.5"
        style={{
          background:
            "linear-gradient(180deg, var(--color-grad-2), var(--color-grad-4))",
        }}
      />
      <CornerMarks className={dark ? "text-on-ink" : "text-on-paper"} />
      <blockquote
        className={`font-display text-[clamp(1.3rem,2.3vw,1.9rem)] leading-snug tracking-[-0.02em] ${
          dark ? "text-on-ink" : "text-on-paper"
        }`}
      >
        {children}
      </blockquote>
    </figure>
  );
}
