/* ===========================================================================
 * Where we fit: Gravino at the centre, the client's people revolving round
 * it, each joined to it by a forcefield.
 * ---------------------------------------------------------------------------
 * The orb is Gravino; the three moons are the people it works with. The
 * client (2026-10-01) took away the dashed "your team" boundary, its shading
 * and the orbit ring: three moons revolving round the orb, and a visible
 * forcefield flowing from each moon into the centre (force-streams.tsx),
 * which is what says Gravino is embedded among them.
 *
 * Geometry, in % of the square: orbit radius 39; moons 19 across, so their
 * outer edge reaches 48.5 < 50 and nothing is clipped on any lap; the orb's
 * disc is 72% of its 50% canvas, radius 18, which is where the streams end.
 *
 * The moons say "Leadership", not "Your leadership": at 320px the longer
 * labels ran out of the moons (measured). The accessible description keeps
 * the full titles.
 *
 * The layer turns once every 60s and each moon turns back at the same rate,
 * so the labels stay upright. Still under reduced motion.
 * ======================================================================== */

import { LiquidOrb } from "./liquid-orb";
import { ForceStreams, type Stream } from "./force-streams";

const ORBIT = 39;
const MOON = 19;
const CORE = 18;

// Seats: top, lower left, lower right. Colours: cyan, pink, violet.
const SEATS = [-90, 150, 30];
const STREAMS: Stream[] = [
  { deg: -90, rgb: [130, 244, 255] },
  { deg: 150, rgb: [255, 123, 213] },
  { deg: 30, rgb: [142, 108, 255] },
];

export function FitOrbit({ moons }: { moons: readonly { title: string }[] }) {
  const list = moons.slice(0, 3).map((m, i) => ({
    label: m.title.replace(/^Your\s+/i, "").replace(/^./, (c) => c.toUpperCase()).split(" "),
    deg: SEATS[i],
    rgb: STREAMS[i].rgb.join(","),
  }));
  const pos = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  };

  return (
    <div
      role="img"
      aria-label={`Gravino at the centre, with ${moons.map((m) => m.title.toLowerCase()).join(", ")} revolving round it, each connected to it.`}
      className="relative aspect-square w-full [container-type:inline-size]"
    >
      {/* Gravino, at the centre, under the streams so they flow into it. */}
      <div aria-hidden className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2">
        <LiquidOrb />
      </div>

      {/* the revolving layer: forcefields and moons turn together */}
      <div aria-hidden className="absolute inset-0 animate-[spin_60s_linear_infinite] motion-reduce:animate-none">
        <ForceStreams streams={STREAMS} orbit={ORBIT} moon={MOON} core={CORE} />

        {list.map((m) => {
          const c = pos(m.deg, ORBIT);
          return (
            <div
              key={m.deg}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${MOON}%`, height: `${MOON}%` }}
            >
              <div
                className="flex h-full w-full animate-[spin_60s_linear_infinite_reverse] items-center justify-center rounded-full text-center motion-reduce:animate-none"
                style={{
                  background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.14), transparent 40%), radial-gradient(circle at 50% 50%, #120e26 55%, rgba(${m.rgb},.55) 140%)`,
                  boxShadow: `inset 0 0 0 1px rgba(255,255,255,.16), 0 0 24px rgba(${m.rgb},.22)`,
                }}
              >
                <span className="px-[8%] text-[clamp(9px,2.3cqw,12px)] leading-[1.15] text-white">
                  {m.label.map((w, j) => (
                    <span key={j} className="block">{w}</span>
                  ))}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[clamp(11px,3cqw,15px)] font-normal tracking-wide text-white [text-shadow:0_1px_8px_rgba(0,0,0,.7)]"
      >
        Gravino
      </span>
    </div>
  );
}
