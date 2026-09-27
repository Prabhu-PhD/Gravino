"use client";

/* ===========================================================================
 * Storyline primitives: the whole animation layer for /about and
 * /why-gravino, in about a hundred lines.
 * ---------------------------------------------------------------------------
 * Deliberately NOT framer-motion, which is installed but unused. It would put
 * 30-40 KB of JavaScript on these pages to do what CSS transitions already do.
 * The diagrams are plain SVG rendered on the server; this file only decides
 * WHEN they animate.
 *
 * The contract, which the CSS in globals.css (search "STORYLINE") relies on:
 *
 *   <Reveal> renders a wrapper and, once mounted, sets data-armed on it. Only
 *   then does the CSS hide the animated parts. When the wrapper scrolls into
 *   view it sets data-in, and the parts transition to their final state.
 *
 *   So with no JavaScript at all, nothing is ever hidden: data-armed is never
 *   set and every diagram renders complete. The worst case is "static", never
 *   "blank". Reduced motion is handled in CSS and skips the hidden state too.
 *
 * Children stagger through a --d custom property set inline on each part.
 * ======================================================================== */

import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  as: Tag = "div",
  threshold = 0.3,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "figure" | "ul" | "ol" | "span";
  /** Fraction of the block that must be visible before it plays. */
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.setAttribute("data-armed", "");
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-in", "");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.setAttribute("data-in", "");
            io.disconnect(); // plays once; scrolling back up does not replay it
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  // The polymorphic tag needs a loose ref type; the element is only ever read
  // for attributes.
  const Any = Tag as unknown as "div";
  return (
    <Any ref={ref as React.RefObject<HTMLDivElement>} className={`st ${className}`}>
      {children}
    </Any>
  );
}

/**
 * A number that counts up when it scrolls into view.
 *
 * The server renders the FINAL value, so the figure is right without
 * JavaScript and right for anything that reads the HTML. Only a browser that
 * runs this and allows motion ever sees it count.
 */
export function CountUp({
  to,
  suffix = "",
  duration = 1400,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let raf = 0;
    setValue(0);
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          setValue(Math.round(to * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {value}
      {suffix}
    </span>
  );
}

/**
 * The spine of a vertical storyline: a line that fills as the reader scrolls
 * through its container. Purely decorative, so it is aria-hidden and simply
 * renders full when JavaScript or motion is off.
 */
export function ScrollSpine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(1);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const measure = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the top of the storyline reaches 70% down the viewport, 1 when
      // its bottom reaches the same line.
      const line = vh * 0.7;
      const next = (line - r.top) / Math.max(1, r.height);
      setP(Math.max(0, Math.min(1, next)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className={`pointer-events-none absolute ${className}`}>
      <div className="h-full w-px bg-white/10" />
      <div
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-[#a78bfa] via-[#60a5fa] to-[#38bdf8]"
        style={{ height: `${p * 100}%` }}
      />
    </div>
  );
}

/**
 * A sentence whose words rise in one after another. Renders as a span so it
 * can sit inside a paragraph (the Statement band puts its children in a <p>).
 * Words are inline-block because transforms do not apply to inline boxes; the
 * spaces stay as real text between them so the sentence still wraps normally
 * and reads correctly to a screen reader.
 */
export function RevealWords({ text, step = 0.07 }: { text: string; step?: number }) {
  const words = text.split(" ");
  return (
    <Reveal as="span" threshold={0.5}>
      {words.map((w, i) => (
        <span key={i}>
          <span
            className="st-fade inline-block"
            style={{ ["--d" as string]: `${(i * step).toFixed(2)}s` } as React.CSSProperties}
          >
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Reveal>
  );
}
