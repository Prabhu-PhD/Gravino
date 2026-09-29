"use client";

/* ===========================================================================
 * The brief, told as a slider: Arun's hero from the Pivo page.
 * ---------------------------------------------------------------------------
 * His behaviour, kept: 6s autoplay, fade between slides, the previous arrow
 * hidden on the first slide, bar indicators, swipe on touch, and his portrait
 * images on phones.
 *
 * Changed, and why:
 *   - Arrow keys work when the slider has focus, not on the whole document.
 *     His listener was on `document`, which inside a larger site would steal
 *     the arrow keys from everything else on the page.
 *   - A pause button. His autoplay paused only on mouse hover, which a
 *     keyboard or touch user cannot do (WCAG 2.2.2). Focus inside the slider
 *     pauses it too.
 *   - No autoplay under prefers-reduced-motion.
 *   - Inactive slides are aria-hidden, and the region is labelled as a
 *     carousel with a live position, so a screen reader hears one slide at a
 *     time rather than all four at once.
 * ======================================================================== */

import { useCallback, useEffect, useRef, useState } from "react";
import type { BriefSlide } from "@/lib/work";

const DURATION = 6000;

export function BriefSlider({ slides, title }: { slides: BriefSlide[]; title: string }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false); // hover or focus inside
  const root = useRef<HTMLElement>(null);
  const touchX = useRef(0);
  const n = slides.length;

  const go = useCallback((to: number) => setI(((to % n) + n) % n), [n]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPlaying(false);
  }, []);

  useEffect(() => {
    if (!playing || held || n < 2) return;
    const t = window.setTimeout(() => go(i + 1), DURATION);
    return () => window.clearTimeout(t);
  }, [i, playing, held, n, go]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); go(i + 1); }
    else if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); go(i - 1); }
  };

  return (
    <section
      ref={root}
      className="cs-slider"
      aria-roledescription="carousel"
      aria-label={`${title}: the brief`}
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setHeld(false);
      }}
      onTouchStart={(e) => { touchX.current = e.changedTouches[0].screenX; }}
      onTouchEnd={(e) => {
        const dx = e.changedTouches[0].screenX - touchX.current;
        if (dx < -50) go(i + 1);
        else if (dx > 50 && i > 0) go(i - 1);
      }}
    >
      {slides.map((s, k) => {
        const active = k === i;
        const common = {
          role: "group" as const,
          "aria-roledescription": "slide",
          "aria-label": `${k + 1} of ${n}`,
          "aria-hidden": !active,
        };
        if (s.kind === "ask") {
          return (
            <div key={k} {...common} className={`cs-slide cs-slide-ask ${active ? "is-active" : ""}`}>
              <div className="cs-ask">
                <h1 className="cs-ask-title">
                  {s.title.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < s.title.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h1>
                <h2 className="cs-ask-label">{s.label}</h2>
                <p className="cs-ask-body">{s.body}</p>
              </div>
            </div>
          );
        }
        return (
          <div
            key={k}
            {...common}
            className={`cs-slide cs-slide-story ${s.shade ? "cs-slide-shade" : ""} ${active ? "is-active" : ""}`}
            style={
              {
                backgroundImage: `url('${s.image}')`,
                ["--cs-mobile-bg" as string]: `url('${s.mobileImage}')`,
              } as React.CSSProperties
            }
          >
            <span className="sr-only">{s.alt}</span>
            <div className="cs-story">
              {s.heading ? (
                <h2 className="cs-story-heading">
                  {s.heading.map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < s.heading!.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h2>
              ) : null}
              <div className="cs-story-body">
                {s.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      <button type="button" className="cs-arrow cs-arrow-prev" hidden={i === 0} onClick={() => go(i - 1)} aria-label="Previous slide">
        <Chevron dir="left" />
      </button>
      <button type="button" className="cs-arrow cs-arrow-next" onClick={() => go(i + 1)} aria-label="Next slide">
        <Chevron dir="right" />
      </button>

      <div className="cs-dots">
        {slides.map((_, k) => (
          <button
            key={k}
            type="button"
            className="cs-dot"
            aria-label={`Go to slide ${k + 1}`}
            aria-current={k === i ? "true" : undefined}
            onClick={() => go(k)}
          >
            <span />
          </button>
        ))}
      </div>

      <button
        type="button"
        className="cs-pause"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause the slideshow" : "Play the slideshow"}
      >
        {playing ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><rect x="2" y="1" width="3" height="10" rx="1" fill="currentColor" /><rect x="7" y="1" width="3" height="10" rx="1" fill="currentColor" /></svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M3 1.5v9l7.5-4.5z" fill="currentColor" /></svg>
        )}
      </button>
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={dir === "left" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}
