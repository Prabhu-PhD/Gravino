import { Reveal } from "./reveal";

const POINTS = [
  {
    t: "Systemic, not freelance",
    d: "A repeatable process and a single point of contact. The same quality, on time, every time.",
  },
  {
    t: "A senior bench",
    d: "75+ years of combined experience. No juniors learning the craft on your budget.",
  },
  {
    t: "Balanced value",
    d: "Premium output at competitive rates. Transparent “from” pricing, custom quotes after a quick chat.",
  },
];

export function Positioning() {
  return (
    <section id="about" className="relative">
      <div className="section mx-auto max-w-6xl px-5">
        <Reveal>
          <p className="eyebrow">The Gravino model</p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="mt-5 max-w-3xl font-display text-[clamp(2rem,4.8vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
            Built like an in-house team.{" "}
            <span className="italic text-gradient">Priced</span> like a smart
            decision.
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Most teams have more design work than they can justify hiring for.
            Gravino plugs in as your design department — a senior, structured crew
            that runs presentations, documentation, print and digital at volume,
            without the overhead of full-time hires.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {POINTS.map((p, i) => (
            <Reveal key={p.t} delay={0.15 + i * 0.08}>
              <div className="glass lift h-full rounded-glass p-6">
                <div className="font-mono text-xs text-violet">0{i + 1}</div>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">
                  {p.t}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
