/* ===========================================================================
 * Infographics for /why-gravino and /about.
 * ---------------------------------------------------------------------------
 * Plain SVG, rendered on the server. None of these carry data: they are
 * diagrams of a claim, not charts of a measurement, so there are no axes with
 * numbers and no invented figures. Where a figure appears it is one the site
 * already states elsewhere.
 *
 * Animation comes from the st- classes (globals.css, "STORYLINE") and only
 * plays inside a <Reveal>. Outside one, every diagram simply renders complete.
 *
 * Every stroke that draws itself carries pathLength="1": the CSS uses one dash
 * of length 1, which only covers the path if the path is told its length is 1.
 * ======================================================================== */

import { d } from "@/lib/stagger";

const VIOLET = "#a78bfa";
const BLUE = "#60a5fa";
const SKY = "#38bdf8";
const PINK = "#f0abfc";
const DIM = "rgba(255,255,255,0.14)";
const LABEL = "rgba(203,213,225,0.72)"; // slate-300 at reading strength

/** Shared defs, so each diagram can use the brand gradient. IDs are suffixed
 *  per diagram because several of these share a page. */
function Grad({ id, from = VIOLET, to = SKY, vertical = false }: { id: string; from?: string; to?: string; vertical?: boolean }) {
  return (
    <linearGradient id={id} x1="0" y1={vertical ? "1" : "0"} x2={vertical ? "0" : "1"} y2="0">
      <stop offset="0" stopColor={from} />
      <stop offset="1" stopColor={to} />
    </linearGradient>
  );
}

const svgBase = "block h-auto w-full overflow-visible [font-family:inherit]";

/* The four "what embedded means" diagrams (LearnOnce, YourCalendar,
 * OneContact, SizedToWork) were removed on 2026-09-29: that section is now the
 * morphing particle panel in components/embedded-morph. They are in git
 * history if ever wanted back. */

/* ---------------------------------------------------------------------------
 * Where we fit: Gravino drawn INSIDE the boundary of the client's team.
 * That is what "embedded" means, so it is the one diagram on the page that is
 * doing more than decorating a sentence.
 * ------------------------------------------------------------------------ */
export function EmbeddedMap() {
  const cx = 200;
  const cy = 170;
  /* Satellites sit 96 units from the centre with radius 40, so their outer
   * edge is at 136, inside the boundary's 150. The first version put two of
   * them at 131 + 38 = 169, poking out of "your team" -- which contradicted
   * the one thing this diagram exists to say. */
  const SAT_R = 40;
  const at = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return { x: cx + 96 * Math.cos(a), y: cy + 96 * Math.sin(a) };
  };
  const sats = [
    { label: ["Your", "leadership"], ...at(-90) },
    { label: ["Your", "marketing", "team"], ...at(150) },
    { label: ["Your", "agency"], ...at(30) },
  ];
  return (
    <svg viewBox="0 0 400 330" className={svgBase} role="img" aria-label="Your leadership, your marketing team and your agency sit inside the boundary of your team, and Gravino sits inside that boundary with them, connected to all three.">
      <defs>
        <Grad id="em-g" />
        <radialGradient id="em-glow">
          <stop offset="0" stopColor={VIOLET} stopOpacity="0.5" />
          <stop offset="1" stopColor={VIOLET} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* the boundary of the client's team */}
      <circle className="st-draw" style={d(0)} pathLength={1} cx={cx} cy={cy} r="150" fill="rgba(123,63,228,0.05)" stroke="rgba(167,139,250,0.55)" strokeWidth="1.5" strokeDasharray="1" />
      <text className="st-fade" style={d(2)} x={cx} y={cy + 146} fontSize="11" fill={VIOLET} textAnchor="middle" letterSpacing="2">
        YOUR TEAM
      </text>
      {sats.map((s, i) => (
        <g key={i}>
          <path className="st-draw" style={d(i + 5)} pathLength={1} d={`M${cx} ${cy} L${s.x} ${s.y}`} stroke="rgba(96,165,250,0.4)" strokeWidth="1.5" fill="none" />
          <path className="st-flow" pathLength={1} d={`M${cx} ${cy} L${s.x} ${s.y}`} stroke={SKY} strokeWidth="2.4" strokeLinecap="round" fill="none" />
        </g>
      ))}
      {sats.map((s, i) => (
        <g key={i + "n"} className="st-pop" style={d(i + 2)}>
          <circle cx={s.x} cy={s.y} r={SAT_R} fill="#100c22" stroke="rgba(255,255,255,0.22)" />
          {s.label.map((line, j) => (
            <text
              key={j}
              x={s.x}
              y={s.y + 4 + (j - (s.label.length - 1) / 2) * 12.5}
              fontSize="10.5"
              fill="white"
              textAnchor="middle"
            >
              {line}
            </text>
          ))}
        </g>
      ))}
      <circle className="st-breathe" cx={cx} cy={cy} r="54" fill="url(#em-glow)" />
      <g className="st-pop" style={d(8)}>
        <circle cx={cx} cy={cy} r="34" fill="#1a1036" stroke="url(#em-g)" strokeWidth="2.5" />
        <text x={cx} y={cy + 4} fontSize="12.5" fill="white" textAnchor="middle" fontWeight="500">Gravino</text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * About: the balancing act as a beam. It tips, then settles level.
 * The two pans carry the company's own words from BALANCE.
 * ------------------------------------------------------------------------ */
export function BalanceBeam() {
  return (
    <svg viewBox="0 72 400 168" className={svgBase} role="img" aria-label="A balance beam with enough detail to be credible on one side and enough clarity to be understood on the other, settling level.">
      <defs>
        <Grad id="bb-g" />
        <Grad id="bb-v" vertical from={VIOLET} to={BLUE} />
      </defs>
      {/* fulcrum */}
      <path d="M200 120 L176 196 H224 Z" fill="url(#bb-v)" opacity="0.85" />
      <rect x="140" y="196" width="120" height="6" rx="3" fill={DIM} />
      {/* the beam and everything that hangs from it rotate together */}
      <g className="st-beam">
        <rect x="40" y="114" width="320" height="8" rx="4" fill="url(#bb-g)" />
        <circle cx="200" cy="118" r="7" fill="#0b0917" stroke="white" strokeWidth="2" />
        {[{ x: 60, t: ["Enough detail", "to be credible"] }, { x: 340, t: ["Enough clarity", "to be understood"] }].map((p) => (
          <g key={p.x}>
            <line x1={p.x} y1="122" x2={p.x - 34} y2="160" stroke={DIM} />
            <line x1={p.x} y1="122" x2={p.x + 34} y2="160" stroke={DIM} />
            <path d={`M${p.x - 46} 160 H${p.x + 46} Q${p.x} 186 ${p.x - 46} 160 Z`} fill="rgba(167,139,250,0.18)" stroke="rgba(167,139,250,0.6)" />
            <text x={p.x} y="96" fontSize="12" fill="white" textAnchor="middle">{p.t[0]}</text>
            <text x={p.x} y="111" fontSize="12" fill={LABEL} textAnchor="middle" dy="-1">{p.t[1]}</text>
          </g>
        ))}
      </g>
      <text className="st-fade" style={d(12)} x="200" y="232" fontSize="11" fill={VIOLET} textAnchor="middle" letterSpacing="2">
        THE BALANCE IS THE DISCIPLINE
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------------------
 * About: where we work. Chennai, and the markets the site already names.
 * ------------------------------------------------------------------------ */
export function Reach({ home, markets }: { home: string; markets: readonly string[] }) {
  const hx = 250;
  const hy = 150;
  // Rough relative placement, west to east: this is a diagram, not a map.
  const spots: Record<string, { x: number; y: number }> = {
    US: { x: 40, y: 78 },
    Europe: { x: 150, y: 52 },
    Gulf: { x: 196, y: 118 },
    India: { x: 262, y: 104 },
  };
  const pts = markets.map((m, i) => ({ m, ...(spots[m] ?? { x: 40 + i * 60, y: 70 }) }));
  return (
    <svg viewBox="0 0 320 190" className={svgBase} role="img" aria-label={`Based in ${home}, working with clients in ${markets.join(", ")}.`}>
      <defs>
        <Grad id="rc-g" />
      </defs>
      {pts.map((p, i) => {
        const mx = (hx + p.x) / 2;
        const my = Math.min(hy, p.y) - 40;
        const path = `M${hx} ${hy} Q${mx} ${my} ${p.x} ${p.y}`;
        return (
          <g key={p.m}>
            <path className="st-draw" style={d(i + 1, 0.18)} pathLength={1} d={path} stroke="url(#rc-g)" strokeWidth="1.6" fill="none" />
            <path className="st-flow" pathLength={1} d={path} stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            <g className="st-pop" style={d(i + 4, 0.18)}>
              <circle cx={p.x} cy={p.y} r="4.5" fill={SKY} />
              <text x={p.x} y={p.y - 10} fontSize="11" fill="white" textAnchor="middle">{p.m}</text>
            </g>
          </g>
        );
      })}
      <circle className="st-breathe" cx={hx} cy={hy} r="16" fill={PINK} opacity="0.4" />
      <g className="st-pop" style={d(0)}>
        <circle cx={hx} cy={hy} r="6" fill={PINK} />
        <text x={hx} y={hy + 22} fontSize="11.5" fill="white" textAnchor="middle" fontWeight="500">{home}</text>
      </g>
    </svg>
  );
}
