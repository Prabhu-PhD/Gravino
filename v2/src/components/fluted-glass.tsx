import { type ReactNode } from "react";

/* ===========================================================================
 * Fluted glass — the v2 hero motif.
 * ---------------------------------------------------------------------------
 * The reference set (Southern West International, Clarity, the cornflower
 * still, Trupeer) all use the same trick: ordinary content with a sheet of
 * ribbed glass laid over PART of it, so the content continues behind the
 * glass in sliced, magnified form.
 *
 * This is that effect, done as actual optics rather than a simulation of
 * light: a cylindrical lens magnifies about its own axis, so each rib is a
 * second copy of the same content, clipped to the rib's column and scaled
 * horizontally about that column's centre line.
 *
 * No WebGL, no canvas, no requestAnimationFrame — so it renders identically
 * in a screenshot, in Safari, and with JS disabled. It is also a server
 * component: zero client JS ships for the hero.
 *
 * GEOMETRY IS CSS, NOT PROPS. The pane's edge and vertical extent are read
 * from `--glass-from` / `--glass-top` / `--glass-bottom`, so a caller can
 * move the glass per breakpoint with ordinary Tailwind variants. That matters
 * because the desktop and mobile compositions are genuinely different: on
 * desktop the pane is a full-height wall on the right that only the headline
 * crosses; on mobile there is no room for a copy column beside it, so it
 * becomes a horizontal band over the headline alone.
 * ======================================================================== */

type Props = {
  children: ReactNode;
  /** Number of vertical ribs across the glass. */
  ribs?: number;
  /** Lens magnification. 1 = flat pane; the references sit around 1.1–1.25. */
  magnify?: number;
  className?: string;
};

/** Left edge of rib `i`, as a CSS length expression. */
const ribLeft = (i: number, ribs: number) =>
  `calc(var(--glass-from) + ${i} * (100% - var(--glass-from)) / ${ribs})`;

export function FlutedGlass({
  children,
  ribs = 18,
  magnify = 1.17,
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      {/* 1 — the content, unrefracted. In normal flow, so it defines the
             container's height; the glass layers are absolute over it. */}
      <div className="relative">{children}</div>

      {/* 2 — the refracted copies, one per rib.
             aria-hidden: this is the same text again, and a screen reader
             announcing the headline eighteen times would be a disaster. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
        style={{ filter: "blur(0.35px)" }}
      >
        {Array.from({ length: ribs }, (_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              clipPath: `inset(
                var(--glass-top)
                calc(100% - ${ribLeft(i + 1, ribs)})
                var(--glass-bottom)
                ${ribLeft(i, ribs)}
              )`,
              transformOrigin: `${ribLeft(i + 0.5, ribs)} 50%`,
              transform: `scaleX(${magnify})`,
            }}
          >
            {children}
          </div>
        ))}
      </div>

      {/* 3 — the glass itself: rib shading, tint, and the leading edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0"
        style={{
          left: "var(--glass-from)",
          top: "var(--glass-top)",
          bottom: "var(--glass-bottom)",
        }}
      >
        {/* Per-rib specular shading: a bright crown where the lens catches
            light, a dark seam at the joint between ribs. */}
        <div
          className="absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              to right,
              rgba(255,255,255,0.00) 0px,
              rgba(255,255,255,0.10) calc(var(--rib) * 0.30),
              rgba(255,255,255,0.16) calc(var(--rib) * 0.44),
              rgba(255,255,255,0.02) calc(var(--rib) * 0.72),
              rgba(0,0,0,0.22) calc(var(--rib) * 0.98),
              rgba(0,0,0,0.00) var(--rib)
            )`,
            ["--rib" as string]: `${(100 / ribs).toFixed(4)}%`,
          }}
        />
        {/* Tint — the single saturated gradient, at low strength. */}
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background:
              "linear-gradient(160deg, var(--color-grad-1) 0%, var(--color-grad-2) 45%, var(--color-grad-4) 100%)",
            mixBlendMode: "soft-light",
          }}
        />
        {/* The leading edge. A real sheet of glass has a bright, hard edge
            where it begins — this one line does most of the work convincing
            the eye that there is a physical object here. */}
        <div className="absolute inset-y-0 left-0 w-px bg-white/45" />
        <div className="absolute inset-y-0 left-px w-[2px] bg-black/25" />
      </div>
    </div>
  );
}
