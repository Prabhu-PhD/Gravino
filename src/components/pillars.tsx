import { Reveal } from "./reveal";
import { FromPrice } from "./from-price";
import { PILLARS } from "@/lib/site";

function PillarIcon({ i }: { i: number }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (i) {
    case 0:
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M12 17v3" />
        </svg>
      );
    case 1:
      return (
        <svg {...common}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
          <path d="M10 13h6M10 16.5h6" />
        </svg>
      );
    case 2:
      return (
        <svg {...common}>
          <path d="M7 9V4h10v5" />
          <rect x="4" y="9" width="16" height="7" rx="1.5" />
          <path d="M7 14h10v6H7z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.4L12 17l-1.9-5.6L4.5 10l5.6-1.4z" />
        </svg>
      );
  }
}

export function Pillars() {
  return (
    <section id="services" className="relative px-4 py-6 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-deep">
        <div
          className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(139,123,240,0.35), transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle, rgba(242,198,221,0.22), transparent 70%)",
          }}
        />

        <div className="section relative px-6 sm:px-12">
          <div className="max-w-2xl">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-periwinkle">
                What we do
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-display text-[clamp(2rem,4.8vw,3.6rem)] font-semibold leading-[1.04] tracking-[-0.02em] text-cream">
                Four pillars,{" "}
                <span className="italic text-periwinkle">one</span> steady cadence.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-cream/70">
                From a one-off deck to a full monthly pipeline — take a single
                pillar, or hand us all four and treat us as your team.
              </p>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2">
            {PILLARS.map((p, i) => (
              <Reveal key={p.name} delay={i * 0.08}>
                <article className="glass-deep lift group relative h-full overflow-hidden rounded-glass p-7">
                  <div className="relative flex items-start justify-between">
                    <span className="font-mono text-sm text-cream/50">{p.n}</span>
                    <span className="text-periwinkle">
                      <PillarIcon i={i} />
                    </span>
                  </div>
                  <h3 className="relative mt-5 font-display text-2xl font-semibold text-cream">
                    {p.name}
                  </h3>
                  <p className="relative mt-3 text-sm leading-relaxed text-cream/70">
                    {p.blurb}
                  </p>
                  <ul className="relative mt-5 flex flex-wrap gap-2">
                    {p.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-pill border border-white/10 bg-white/5 px-3 py-1 text-xs text-cream/80"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                  <div className="relative my-6 h-px bg-white/10" />
                  <div className="relative flex items-baseline gap-1.5">
                    <span className="text-xs text-cream/50">from</span>
                    <FromPrice
                      inr={p.fromINR}
                      className="font-display text-xl font-semibold text-cream"
                    />
                    {p.unit && (
                      <span className="text-xs text-cream/50">/ {p.unit}</span>
                    )}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
