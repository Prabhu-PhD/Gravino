/* ===========================================================================
 * Where we fit: Gravino at the centre, the client's people in orbit round it,
 * all inside the boundary of the client's team.
 * ---------------------------------------------------------------------------
 * The EmbeddedMap diagram's argument (2026-09-30, the client), rebuilt around
 * the liquid orb: the orb is Gravino, and the three moons are the people it
 * works with. The moons stay INSIDE "your team" at every point of the orbit,
 * because Gravino being inside that boundary with them is the whole claim.
 *
 * Geometry, in % of the square: boundary radius 48.5; orbit radius 37; moons
 * 19 across, so their outer edge reaches 46.5 < 48.5; the orb's disc is 72%
 * of its 50% canvas, radius 18, so the connecting lines run 18.5 to 27.
 *
 * The moons say "Leadership", not "Your leadership": the boundary already
 * says "Your team", and at 320px the longer labels ran out of the moons
 * (measured). The accessible description keeps the full titles.
 *
 * The ring turns once every 90s and each moon turns back at the same rate,
 * so the labels stay upright. Still under reduced motion.
 * ======================================================================== */

import { LiquidOrb } from "./liquid-orb";

const ORBIT = 37;
const MOON = 19;

type Moon = { label: string[]; deg: number; tint: string };

export function FitOrbit({ moons }: { moons: readonly { title: string }[] }) {
  // Same seats as the old diagram: top, lower left, lower right.
  const seats = [-90, 150, 30];
  const tints = ["rgba(130,244,255,.55)", "rgba(255,123,213,.5)", "rgba(142,108,255,.6)"];
  const list: Moon[] = moons.slice(0, 3).map((m, i) => ({
    label: m.title.replace(/^Your\s+/i, "").replace(/^./, (c) => c.toUpperCase()).split(" "),
    deg: seats[i],
    tint: tints[i],
  }));
  const pos = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a) };
  };

  return (
    <div
      role="img"
      aria-label={`${moons.map((m) => m.title).join(", ")}: all inside your team, with Gravino at the centre, connected to each of them.`}
      className="relative aspect-square w-full [container-type:inline-size]"
    >
      {/* the boundary of the client's team */}
      <div aria-hidden className="absolute inset-[1.5%] rounded-full border border-dashed border-[#a78bfa]/45 bg-[#7b3fe4]/[0.04]" />
      <span
        aria-hidden
        // Below the circle, not inside it: the moons pass the bottom of the
        // boundary on every lap and would run over it.
        className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap font-mono text-[clamp(9px,2.3cqw,11px)] uppercase tracking-[0.2em] text-[#a78bfa]"
      >
        Your team
      </span>

      {/* the orbit: ring, links and moons turn together */}
      <div aria-hidden className="absolute inset-0 animate-[spin_90s_linear_infinite] motion-reduce:animate-none">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="50" cy="50" r={ORBIT} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.25" strokeDasharray="0.8 1.2" />
          {list.map((m) => {
            const a = pos(m.deg, 18.5);
            const b = pos(m.deg, ORBIT - MOON / 2 - 0.5);
            return (
              <line key={m.deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="rgba(96,165,250,0.45)" strokeWidth="0.35" strokeLinecap="round" />
            );
          })}
        </svg>

        {list.map((m) => {
          const c = pos(m.deg, ORBIT);
          return (
            <div
              key={m.deg}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.x}%`, top: `${c.y}%`, width: `${MOON}%`, height: `${MOON}%` }}
            >
              <div
                className="flex h-full w-full animate-[spin_90s_linear_infinite_reverse] items-center justify-center rounded-full text-center motion-reduce:animate-none"
                style={{
                  background: `radial-gradient(circle at 34% 28%, rgba(255,255,255,.14), transparent 40%), radial-gradient(circle at 50% 50%, #120e26 55%, ${m.tint} 140%)`,
                  boxShadow: `inset 0 0 0 1px rgba(255,255,255,.16), 0 0 24px ${m.tint.replace(/[\d.]+\)$/, ".22)")}`,
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

      {/* Gravino, at the centre */}
      <div aria-hidden className="absolute left-1/2 top-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2">
        <LiquidOrb />
      </div>
      <span
        aria-hidden
        className="absolute left-1/2 top-[71%] -translate-x-1/2 text-[clamp(11px,3cqw,15px)] font-normal tracking-wide text-white"
      >
        Gravino
      </span>
    </div>
  );
}
