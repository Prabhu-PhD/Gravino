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
 *     come from page-shell, passed in by the page. No box round the visual
 *     (the client, 2026-09-30): the particles sit on the section.
 *   SIZE. The principle's description opens under its title in the list,
 *     not under the visual, so the particles get the whole column.
 *   TYPE. Titles at the size of the "How the work works" steps; slate body
 *     text; mono labels as in SectionMark.
 *   COLOUR. Lavender #a78bfa and blue #60a5fa, particles included; the
 *     chosen principle takes the heading-accent gradient.
 *   HOVER. The file's hover (#f5f5f2 to #fff) was invisible. Inactive titles
 *     now sit at slate-300 and brighten to white, the number turning lavender.
 *   TOUCH. Hold and drag turns the cloud 360 degrees (engine.ts). It is no
 *     longer captioned: "Drag to turn it" and the "01 / Learning" state
 *     label were removed, with the glow behind the particles (2026-10-01).
 *   NO DASHES. "01 — Learning" became "01 / Learning", per the site rule.
 *   SEMANTICS. The principles are buttons with aria-pressed, each followed
 *     by the description it opens; closed descriptions are aria-hidden.
 *   LOADING. All text renders on the server; three.js and the engine load in
 *     the browser as their own chunk, only when this component mounts.
 * ======================================================================== */

import { useEffect, useRef, useState } from "react";
import type { Morph } from "./engine";
import { SHELL } from "@/lib/shell";

export type Principle = { title: string; body: string };

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

  return (
    /* Below lg the visual sits ABOVE the list at a fixed size, and the chosen
       principle's description shows in a fixed band under the list, so
       choosing a principle moves nothing (the client, 2026-10-01). This
       replaced a one-screen-tall layout in which the particles took only what
       the text left: on a real phone that was about 160px, below the fold,
       and it shrank further as the descriptions changed (measured at
       360x640). */
    <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#09090f] py-16 md:py-20">
      <div className={`${SHELL} relative`}>
        {mark}
        {/* Heading above both columns, as in every other section. */}
        {head}
        <div className="mt-6 flex flex-col lg:mt-10 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-10">
          {/* ---- the principles ----------------------------------------------
              Titles at the size of the "How the work works" steps below. On
              desktop the chosen principle opens to show what it means. */}
          <div>
          <ol className="border-b border-white/10">
            {principles.map((item, i) => {
              const on = i === active;
              return (
                <li key={item.title} className="border-t border-white/10">
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-controls={`embedded-body-${i}`}
                    onClick={() => choose(i)}
                    className="group grid min-h-11 w-full cursor-pointer grid-cols-[3rem_1fr] items-baseline pt-3 text-left md:grid-cols-[4rem_1fr] lg:pt-6"
                  >
                    <span
                      className={`font-mono text-sm transition-colors duration-300 md:text-base ${
                        on ? "text-[#a78bfa]" : "text-slate-400 group-hover:text-[#a78bfa]"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`text-[1.15rem] leading-tight transition-colors duration-300 sm:text-[1.3rem] lg:text-[clamp(1.35rem,2.2vw,1.9rem)] ${
                        on
                          ? "bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] bg-clip-text font-normal text-transparent"
                          : "font-light text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                  </button>
                  <div
                    id={`embedded-body-${i}`}
                    aria-hidden={!on}
                    className={`grid transition-[grid-template-rows] duration-500 ease-out max-lg:hidden ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`ml-12 max-w-xl pt-3 text-[1rem] font-light leading-relaxed text-slate-400 transition-opacity duration-500 md:ml-16 ${
                          on ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                  <div className="h-3 lg:h-6" />
                </li>
              );
            })}
          </ol>
          {/* Phones and tablets: the chosen principle's description, in a band
              tall enough for the longest of the four, so the page below never
              moves when a principle is chosen. Labelled with the principle's
              number and title (review, 2026-10-08): as bare text under the
              whole list it read as detached from the item it belongs to. */}
          <div aria-live="polite" className="mt-4 min-h-[9.5rem] rounded-2xl border border-white/10 bg-white/[0.03] p-4 max-[359px]:min-h-[11rem] sm:min-h-[7.5rem] lg:hidden">
            <p className="flex items-baseline gap-2.5 text-[0.95rem] text-white">
              <span className="font-mono text-xs text-[#a78bfa]">{String(active + 1).padStart(2, "0")}</span>
              {principles[active].title}
            </p>
            <p className="mt-1.5 text-[0.95rem] font-light leading-relaxed text-slate-300">{principles[active].body}</p>
          </div>
          </div>

          {/* ---- the visual ---------------------------------------------------
              No frame and no glow (the client, 2026-10-01): the particles sit
              on the section itself. Below lg it comes first, at a fixed,
              near-square size, because the camera frames the shapes by
              height: a square canvas shows each one whole at every phone
              width. The canvas runs past the column edges so a turned shape
              is never cut off. Hold and drag still turns it (engine.ts). */}
          <div className="relative max-lg:order-first max-lg:mb-4 max-lg:h-[min(92vw,26rem)] lg:h-[660px] xl:h-[740px]">
            <div ref={canvas} aria-hidden className="absolute -inset-x-6 inset-y-0 sm:-inset-x-10 lg:-left-10 lg:-right-20" />
          </div>
        </div>
      </div>
    </section>
  );
}
