/* ===========================================================================
 * Fluted glass, done as refraction rather than as stripes.
 * ---------------------------------------------------------------------------
 * The first attempt was a repeating light/dark gradient laid OVER a surface.
 * That can never read as glass, and over a flat gradient it read as
 * corrugated metal, because painted stripes do not do the one thing fluted
 * glass actually does: bend what is behind them.
 *
 * A cylindrical lens magnifies about its own axis. So each rib here is a
 * SECOND COPY OF THE IMAGE, clipped to that rib's column and scaled
 * horizontally about that column's centre line. The image genuinely breaks
 * and offsets at every rib, which is the effect.
 *
 * TWO THINGS THAT MATTER MORE THAN THEY LOOK:
 *
 * 1. The ribs are sized against the WHOLE band, then masked to one half. Size
 *    them against the half instead and `background-size: cover` crops
 *    differently there, so the glass shows a visibly different photograph
 *    from the bare half beside it and the illusion collapses.
 * 2. Every rib is a CSS background, not an <img>. The browser decodes the
 *    file once and reuses it, so twenty ribs cost one image.
 * ======================================================================== */

export function FlutedPane({
  src,
  side = "right",
  ribs = 20,
  magnify = 1.22,
  objectPosition = "center",
}: {
  src: string;
  /** Which half of the parent the glass covers. */
  side?: "left" | "right";
  /** Ribs across the covered half. */
  ribs?: number;
  /** Lens magnification. 1 = flat glass; real flutes sit around 1.1–1.25. */
  magnify?: number;
  objectPosition?: string;
}) {
  const right = side === "right";
  return (
    <div
      aria-hidden
      className={`absolute inset-y-0 w-1/2 overflow-hidden ${
        right ? "right-0" : "left-0"
      }`}
    >
      {/* Twice the mask's width, offset so it lines up with the full band. */}
      <div
        className="absolute inset-y-0 w-[200%]"
        style={{ left: right ? "-100%" : "0" }}
      >
        {Array.from({ length: ribs }, (_, i) => {
          // Rib bounds as a percentage of the FULL band.
          const span = 50 / ribs;
          const a = (right ? 50 : 0) + i * span;
          const b = a + span;
          return (
            <div
              key={i}
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${src})`,
                backgroundPosition: objectPosition,
                clipPath: `inset(0 ${100 - b}% 0 ${a}%)`,
                transformOrigin: `${(a + b) / 2}% 50%`,
                transform: `scaleX(${magnify})`,
              }}
            />
          );
        })}
      </div>

      {/* Rib shading: a bright crown where each lens catches light, a dark
          seam at the joint. This is the SURFACE of the glass — the slicing
          underneath is the optics. */}
      <div
        className="absolute inset-0"
        style={{
          background: `repeating-linear-gradient(
            to right,
            rgba(255,255,255,0) 0,
            rgba(255,255,255,0.10) calc(var(--rib) * 0.30),
            rgba(255,255,255,0.17) calc(var(--rib) * 0.44),
            rgba(255,255,255,0.02) calc(var(--rib) * 0.72),
            rgba(0,0,0,0.20) calc(var(--rib) * 0.98),
            rgba(0,0,0,0) var(--rib)
          )`,
          ["--rib" as string]: `${(100 / ribs).toFixed(4)}%`,
        }}
      />

      {/* The leading edge, on the side where the sheet begins. One bright line
          does most of the work convincing the eye there is an object here. */}
      <div
        className={`absolute inset-y-0 w-px bg-white/50 ${right ? "left-0" : "right-0"}`}
      />
      <div
        className={`absolute inset-y-0 w-[2px] bg-black/20 ${
          right ? "left-px" : "right-px"
        }`}
      />
    </div>
  );
}
