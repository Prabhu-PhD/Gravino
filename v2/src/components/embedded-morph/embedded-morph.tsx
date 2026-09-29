"use client";

/* ===========================================================================
 * "What embedded means": the four principles, one morphing particle visual.
 * ---------------------------------------------------------------------------
 * The client's design (gravino_embedded_particles_pages.html, 2026-09-29),
 * replacing the four cards and their SVG diagrams on /why-gravino. The client
 * chose one panel over four cards (2026-09-29): the shape transforming from
 * one principle to the next is the point of it.
 *
 * Layout, type sizes, colours and spacing are the file's own values. The
 * departures, each for a reason:
 *
 *   CONTRAST. The item numbers (#666a72, 3.67:1), the state label (#575a62,
 *     2.89:1) and the hint (#4f5259, 2.55:1) failed the 4.5:1 floor on this
 *     ground. They take the file's own secondary grey, #777a82 (4.64:1), so
 *     the fix stays inside its palette.
 *   NO DASHES. "01 — Learning" became "01 / Learning", per the site rule.
 *   SEMANTICS. The principles are buttons with aria-pressed, and the caption
 *     under the visual is a polite live region, so a screen reader hears the
 *     principle it just chose.
 *   LOADING. All text renders on the server; three.js and the engine load in
 *     the browser as their own chunk, only when this component mounts.
 * ======================================================================== */

import { useEffect, useRef, useState } from "react";
import type { Morph } from "./engine";

export type Principle = { title: string; body: string };

const STATE_LABELS = ["01 / Learning", "02 / Clock", "03 / Planet", "04 / Scale"];

export function EmbeddedMorph({ principles }: { principles: readonly Principle[] }) {
  const [active, setActive] = useState(0);
  const canvas = useRef<HTMLDivElement>(null);
  const engine = useRef<Morph | null>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let disposed = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("./engine").then(({ mount }) => {
      if (disposed) return;
      engine.current = mount(el, { still });
    });
    return () => {
      disposed = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  const choose = (i: number) => {
    setActive(i);
    engine.current?.choose(i);
  };

  const p = principles[active];

  return (
    <section
      aria-labelledby="embedded-heading"
      /* line-height: normal, as in the file; the site base of 1.5 otherwise
         loosens every line it does not set (measured: items 60px vs 54px). */
      className="relative grid min-h-screen border-t border-white/[0.07] bg-[#08090b] text-[#f5f5f2] [line-height:normal] max-[800px]:grid-cols-1 min-[801px]:grid-cols-[minmax(330px,43%)_1fr]"
    >
      {/* ---- the principles ------------------------------------------------ */}
      <div className="relative z-[2] flex flex-col justify-center px-[clamp(28px,5vw,78px)] py-[clamp(28px,5vh,58px)] max-[800px]:px-[26px] max-[800px]:pt-12 max-[800px]:pb-0">
        <p className="mb-5 text-[12px] uppercase tracking-[0.13em] text-[#777a82]">01 / What embedded means</p>
        <h2
          id="embedded-heading"
          className="mb-7 max-w-[560px] text-[clamp(38px,4.4vw,68px)] font-semibold leading-[0.98] tracking-[-0.055em]"
        >
          {/* Each line held together: with the page's scrollbar the column is
              4px narrower than in the file, which made "What that means" wrap
              to three lines. The column gap takes the few pixels instead. Desktop
              only: on a 320px phone the held line would overrun the column. */}
          <span className="min-[801px]:whitespace-nowrap">What that means</span>
          <br />
          <span className="min-[801px]:whitespace-nowrap">in practice.</span>
        </h2>
        <div className="flex w-[min(620px,100%)] flex-col">
          {principles.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-pressed={i === active}
              onClick={() => choose(i)}
              className="group grid cursor-pointer grid-cols-[46px_1fr] gap-3 border-t border-[#24262b] bg-transparent pt-[15px] pb-4 text-left transition duration-300 last:border-b"
            >
              <span className={`pt-[3px] text-[12px] tracking-[0.08em] ${i === active ? "text-[#8f93a0]" : "text-[#777a82]"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-[clamp(17px,1.45vw,21px)] font-medium tracking-[-0.025em] transition-colors duration-300 ${
                  i === active ? "text-[#9b55ff]" : "group-hover:text-white"
                }`}
              >
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---- the visual ---------------------------------------------------- */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden max-[800px]:h-[68vh] max-[800px]:min-h-[460px]">
        <div
          aria-hidden
          className="pointer-events-none absolute h-[min(70vw,900px)] w-[min(70vw,900px)] rounded-full blur-[8px]"
          style={{ background: "radial-gradient(circle, rgba(89,86,255,.08), transparent 62%)" }}
        />
        <div ref={canvas} aria-hidden className="absolute left-0 top-[3%] h-[72%] w-full" />

        <div
          aria-live="polite"
          className="pointer-events-none absolute bottom-[21%] left-1/2 z-[3] w-[min(500px,72%)] -translate-x-1/2 text-center"
        >
          <div className="mb-2 text-[clamp(17px,1.6vw,22px)] font-medium tracking-[-0.025em]">{p.title}</div>
          <div className="text-[12.5px] leading-[1.55] text-[#777a82]">{p.body}</div>
        </div>

        <div className="absolute bottom-[34px] left-[clamp(28px,6vw,96px)] text-[11px] tracking-[0.08em] text-[#777a82] max-[800px]:left-[26px]">
          <span
            aria-hidden
            className="mr-2 inline-block h-[5px] w-[5px] rounded-full"
            style={{ background: "linear-gradient(135deg,#4d8dff,#9b55ff)", boxShadow: "0 0 12px rgba(120,100,255,.55)" }}
          />
          Click a principle to transform
        </div>
        <div className="absolute bottom-[34px] right-[clamp(24px,5vw,72px)] text-[11px] uppercase tracking-[0.12em] text-[#777a82] max-[800px]:right-[26px]">
          {STATE_LABELS[active]}
        </div>
      </div>
    </section>
  );
}
