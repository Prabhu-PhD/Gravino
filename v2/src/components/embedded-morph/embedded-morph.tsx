"use client";

/* ===========================================================================
 * "What embedded means": the four principles, one morphing particle visual.
 * ---------------------------------------------------------------------------
 * The client's design (gravino_embedded_particles_pages.html, 2026-09-29),
 * replacing the four cards and their SVG diagrams on /why-gravino. The client
 * chose one panel over four cards (2026-09-29): the shape transforming from
 * one principle to the next is the point of it.
 *
 * The particle model and its transitions are the file's. The frame around
 * them is the site's (2026-09-30): the file was styled as a standalone page
 * (68px semibold heading, full-bleed, a screen tall, #9b55ff) and did not
 * sit with the sections either side of it. So:
 *
 *   FRAME. Site section padding and the 76rem column; SectionMark and Head
 *     come from page-shell, passed in by the page; the visual sits on a
 *     rounded stage in the site's card border and raised ground.
 *   TYPE. Light-weight titles and slate body text, as in the site's cards;
 *     mono labels as in SectionMark.
 *   COLOUR. Lavender #a78bfa and blue #60a5fa, particles included; the
 *     chosen principle takes the heading-accent gradient.
 *   HOVER. The file's hover (#f5f5f2 to #fff) was invisible. Inactive titles
 *     now sit at slate-300 and brighten to white, the number turning lavender.
 *   NO DASHES. "01 — Learning" became "01 / Learning", per the site rule.
 *   SEMANTICS. The principles are buttons with aria-pressed, and the caption
 *     under the visual is a polite live region, so a screen reader hears the
 *     principle it just chose.
 *   LOADING. All text renders on the server; three.js and the engine load in
 *     the browser as their own chunk, only when this component mounts.
 * ======================================================================== */

import { useEffect, useRef, useState } from "react";
import type { Morph } from "./engine";
import { SHELL } from "@/lib/shell";

export type Principle = { title: string; body: string };

const STATE_LABELS = ["01 / Learning", "02 / Clock", "03 / Planet", "04 / Scale"];

export function EmbeddedMorph({
  principles,
  mark,
  head,
}: {
  principles: readonly Principle[];
  /** The section mark and heading, rendered by the page with the site's own
      components so this section reads like every other one. */
  mark: React.ReactNode;
  head: React.ReactNode;
}) {
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
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#09090f] py-16 md:py-20">
      <div className={`${SHELL} relative`}>
        {mark}
        {/* Heading above both columns, as in every other section. */}
        {head}
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
          {/* ---- the principles ---------------------------------------------- */}
          <div>
            <div className="flex flex-col border-b border-white/10">
              {principles.map((item, i) => {
                const on = i === active;
                return (
                  <button
                    key={item.title}
                    type="button"
                    aria-pressed={on}
                    onClick={() => choose(i)}
                    className="group grid cursor-pointer grid-cols-[3rem_1fr] items-baseline border-t border-white/10 py-4 text-left md:py-5"
                  >
                    <span
                      className={`font-mono text-sm transition-colors duration-300 ${
                        on ? "text-[#a78bfa]" : "text-slate-400 group-hover:text-[#a78bfa]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[1.1rem] leading-snug transition-colors duration-300 md:text-[1.2rem] ${
                        on
                          ? "bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] bg-clip-text font-normal text-transparent"
                          : "font-light text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---- the visual: a stage in the site's card language --------------- */}
          {/* The canvas takes the stage above a band reserved for the caption,
              so no shape can run into the text at any width (the planet did,
              at 1024px and 320px, when the canvas ran under the caption).
              Heights measured: at xl the four shapes cover 0.172 / 0.095 /
              0.069 / 0.112 of their boxes, against the file's full-screen
              0.163 / 0.089 / 0.065 / 0.105, so the particles read as in the
              file, only smaller. */}
          <div className="relative h-[540px] overflow-hidden rounded-2xl border border-white/10 bg-[#0d0b18] sm:h-[560px] lg:h-[620px] xl:h-[680px]">
            <div
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[40%] h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(167,139,250,.10), transparent 60%)" }}
            />
            <div ref={canvas} aria-hidden className="absolute inset-x-0 top-0 bottom-[190px] sm:bottom-[160px] lg:bottom-[150px]" />

            <div aria-live="polite" className="absolute inset-x-5 bottom-14 text-center sm:inset-x-8 md:inset-x-12">
              <div className="text-[1.1rem] font-normal text-white md:text-[1.2rem]">{p.title}</div>
              <p className="mx-auto mt-2 max-w-md text-[0.925rem] font-light leading-relaxed text-slate-400">{p.body}</p>
            </div>

            <div className="absolute inset-x-6 bottom-5 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.2em] text-slate-400">
              <span className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-[#60a5fa] to-[#a78bfa] shadow-[0_0_10px_rgba(167,139,250,.6)]" />
                <span className="hidden sm:inline">Choose a principle</span>
              </span>
              <span>{STATE_LABELS[active]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
