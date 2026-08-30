import Image from "next/image";

/* ===========================================================================
 * The Gravino lockup.
 * ---------------------------------------------------------------------------
 * "Grav" + the bubble carrying "ino" + the satellite dot.
 *
 * The bubble is the BRAND ARTWORK (the render lifted from the brochure, with
 * its alpha mask composited back on), not a live <LogoSphere> and not a
 * gradient-text approximation. Reasons, in order:
 *   - Every live sphere is its own WebGL context. In persistent site chrome
 *     that means a context on every page, for a mark ~22px tall where the
 *     iridescence collapses to grey anyway.
 *   - It is the actual mark rather than something that resembles it.
 *
 * "ino" is set at the SAME font size as "Grav" — they are one word, and the
 * bubble is a container around the second half, not a reason to shrink it.
 * Everything else scales off that one number.
 * ======================================================================== */

/** Bubble diameter as a multiple of the wordmark's font size. */
const BUBBLE = 1.92;
/** Satellite dot diameter, same basis. */
const DOT = 0.2;

export function Logomark({
  px = 22,
  dark = false,
  className = "",
}: {
  /** Font size of the wordmark, in px. Everything else derives from it. */
  px?: number;
  dark?: boolean;
  className?: string;
}) {
  const bubble = px * BUBBLE;
  const dot = px * DOT;

  return (
    <span
      aria-hidden
      className={`inline-flex items-center ${className}`}
      style={{ lineHeight: 1 }}
    >
      <span
        className="font-display font-medium tracking-[-0.03em]"
        style={{ fontSize: px, color: dark ? "var(--color-on-ink)" : "var(--color-on-paper)" }}
      >
        Grav
      </span>

      <span
        className="relative inline-block shrink-0"
        style={{ width: bubble, height: bubble, marginLeft: -px * 0.1 }}
      >
        <Image
          src="/brand/logo-bubble.png"
          alt=""
          fill
          sizes="96px"
          className="object-contain"
          priority
        />
        <span
          className="absolute inset-0 grid place-items-center font-display font-medium text-white"
          style={{ fontSize: px, letterSpacing: "-0.03em" }}
        >
          ino
        </span>
        {/* The satellite, riding the bubble's upper right. */}
        <span
          className="absolute rounded-full"
          style={{
            width: dot,
            height: dot,
            top: bubble * 0.04,
            right: -dot * 0.35,
            background: dark ? "var(--color-on-ink)" : "var(--color-on-paper)",
          }}
        />
      </span>
    </span>
  );
}
