/* ===========================================================================
 * Editorial furniture.
 * ---------------------------------------------------------------------------
 * Deliberately thin. An earlier version of this file gave every section a
 * running index and a label above its heading; both are category defaults
 * rather than decisions — the sequence carried no information a reader needed,
 * and a heading that needs a label above it to announce itself is a heading
 * that is not doing its job. Removing them is most of why the page stopped
 * reading as a template.
 *
 * What survives is the part that earns its place: a rule that opens a section,
 * and corner ticks that frame an artefact.
 * ======================================================================== */

export const SHELL = "mx-auto max-w-[88rem] px-6 md:px-10";

/** A corner tick. Four of these frame an artefact the way a crop mark does. */
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
 * Section opening: a hairline the full measure, then the heading at full
 * strength. No label above it — the heading says what the section is.
 */
export function SectionHead({
  children,
  dark = false,
  lede,
  size = "md",
}: {
  children: React.ReactNode;
  dark?: boolean;
  lede?: string;
  /** `lg` for the one section that is meant to be the page's peak. */
  size?: "md" | "lg";
}) {
  const dim = dark ? "text-on-ink-dim" : "text-on-paper-dim";
  return (
    <div>
      <div
        className={`h-px w-full ${dark ? "bg-ink-line" : "bg-paper-line"}`}
      />
      <h2
        className={`display mt-10 max-w-4xl ${
          size === "lg"
            ? "text-[clamp(2.6rem,6vw,5.5rem)]"
            : "text-[clamp(1.9rem,3.7vw,3.2rem)]"
        }`}
      >
        {children}
      </h2>
      {lede ? (
        <p className={`mt-7 max-w-[62ch] text-[1.02rem] leading-relaxed ${dim}`}>
          {lede}
        </p>
      ) : null}
    </div>
  );
}

/** Pull quote. Hairline rule, not a coloured slab. */
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
        className={`absolute inset-y-0 left-0 w-px ${
          dark ? "bg-on-ink/35" : "bg-on-paper/30"
        }`}
      />
      <blockquote
        className={`font-display text-[clamp(1.35rem,2.4vw,2rem)] font-medium leading-snug tracking-[-0.03em] ${
          dark ? "text-on-ink" : "text-on-paper"
        }`}
      >
        {children}
      </blockquote>
    </figure>
  );
}
