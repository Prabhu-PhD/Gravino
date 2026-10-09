"use client";

import { useEffect } from "react";
import { decodeDots, drawDots, DEFAULT_LIGHT, ASSEMBLE_S, ASSEMBLE_LAG_S, type Dot } from "@/lib/dot-icons";
import { GLYPH_DOTS } from "@/content/glyph-dots";
import type { GlyphKey } from "@/content/capabilities";

/* ===========================================================================
 * Draws every [data-glyph] icon on the page as particles (lib/dot-icons.ts).
 * ---------------------------------------------------------------------------
 * Each icon's markup is a span naming its drawing in data-glyph, around the
 * original line drawing. The dots themselves (content/glyph-dots.ts, ~19 KB)
 * come with this script, not in the page: embedded per icon they appeared
 * twice in every page (in the markup and in React's hydration data), +20 KB
 * gzipped on each of the home and Services pages; here they are one cached
 * file for both. The drawing stays in the page: it is what a visitor
 * without JavaScript sees, and it gives the icon its size. With JavaScript,
 * CSS hides it (html.js, set in the layout before first paint) and a canvas
 * is laid over it here.
 *
 * motion={true} (the home page's "What we cover"):
 *   - each panel's icons ASSEMBLE the first time that panel is on screen
 *     (desktop: when it becomes the active one; phones: as each card
 *     scrolls in), staggered across the twelve;
 *   - the LIGHT follows a mouse pointer over the section (desktop only:
 *     there is no hover on a phone);
 *   - the scatter DRIFTS while the section is on screen.
 *   The loop runs only while an icon is on screen and the tab is visible.
 * motion={false} (the Services page, which is for reading): the dots, lit
 * from the top left, still. Reduced motion gets the same, everywhere.
 * ======================================================================== */

type Tile = {
  box: HTMLElement;
  ref: Element | null;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  dots: Dot[];
  group: HTMLElement;
  /** Position within its group, for the stagger. */
  k: number;
  w: number;
  h: number;
  /** When it began assembling (performance.now ms); null = not yet shown. */
  start: number | null;
  /** Whether the last frame drew it mid-assembly (dots anywhere on the canvas). */
  wide: boolean;
  /** The drawing's own dots, rendered once per light angle and shimmer step. */
  cache: HTMLCanvasElement | null;
  cacheKey: string;
  onScreen: boolean;
};

/** Room around each drawing for the dots to fly in from, as a fraction of its size. */
const MARGIN_MOTION = 0.55;
const MARGIN_STILL = 0.06;
/** Seconds between one icon's assembly and the next's, across a panel. */
const STAGGER_S = 0.05;
/** How often a resting icon's own dots are re-rendered for the shimmer. */
const SHIMMER_FPS = 4;
/** The idle drift's frame interval (24 fps): it moves about a pixel over
 *  several seconds, so more frames only cost. Measured on the home page in
 *  headless Chrome: ~47 ms of main thread a second at 30 fps / 6 shimmer. */
const IDLE_FRAME_MS = 41;

export function DotIcons({ motion = false }: { motion?: boolean }) {
  useEffect(() => {
    // ?icons=lines: the previous line icons, for comparison (see layout.tsx)
    if (document.documentElement.classList.contains("icons-lines")) return;
    const boxes = [...document.querySelectorAll<HTMLElement>("[data-glyph]")].filter((b) => b.dataset.glyph! in GLYPH_DOTS);
    if (!boxes.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const live = motion && !reduce;
    const hover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const margin = live ? MARGIN_MOTION : MARGIN_STILL;

    const tiles: Tile[] = boxes.map((box, n) => {
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.className = "dot-canvas";
      if (getComputedStyle(box).position === "static") box.style.position = "relative";
      box.appendChild(canvas);
      const group = box.closest<HTMLElement>(".cap-content-panel") ?? box.closest<HTMLElement>("ul") ?? box;
      return {
        box, ref: box.querySelector("svg"), canvas, ctx: canvas.getContext("2d")!,
        dots: decodeDots(GLYPH_DOTS[box.dataset.glyph as GlyphKey], n + 1), group,
        k: [...group.querySelectorAll("[data-glyph]")].indexOf(box),
        w: 0, h: 0, start: live ? null : -1e9, onScreen: !live, wide: true, cache: null, cacheKey: "",
      };
    });
    const groups = [...new Set(tiles.map((t) => t.group))];

    /* ---- size ------------------------------------------------------------- */
    let dpr = 1;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      for (const T of tiles) {
        const r = T.ref?.getBoundingClientRect();
        T.w = r?.width ?? 0; T.h = r?.height ?? 0;
        if (!T.w) continue;                         // hidden (phones show six per panel)
        const cw = T.w * (1 + 2 * margin), ch = T.h * (1 + 2 * margin);
        T.canvas.style.width = `${cw}px`; T.canvas.style.height = `${ch}px`;
        T.canvas.width = Math.round(cw * dpr); T.canvas.height = Math.round(ch * dpr);
      }
    };

    /* ---- pointer (the light) ---------------------------------------------- */
    let pointer: [number, number] | null = null, presence = 0, presenceTarget = 0;
    const section = boxes[0].closest("section");
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer = [e.clientX, e.clientY];
      lastMove = performance.now();
      const r = section?.getBoundingClientRect();
      presenceTarget = r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom ? 1 : 0;
      kick();
    };
    const onLeave = (e: PointerEvent) => { if (!e.relatedTarget) { presenceTarget = 0; kick(); } };

    /* ---- draw ------------------------------------------------------------- */
    const draw = (T: Tile, now: number) => {
      const { ctx, canvas } = T;
      const s = T.w / 64;
      const cw = canvas.width / dpr, ch = canvas.height / dpr;
      const ox = ((cw - 64 * s) / 2) * dpr, oy = ((ch - 48 * s) / 2) * dpr;
      const since = T.start === null ? 0 : (now - T.start) / 1000 - T.k * STAGGER_S;
      const assembling = live && T.start !== null && since < ASSEMBLE_S + ASSEMBLE_LAG_S + 0.05;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      // Once assembled, the dots stay within a few units of the drawing (drift
      // 1.1, the pointer's push 3.2), so only that area needs clearing; the
      // whole canvas is three times larger, for the flight in.
      const pad = 9 * s * dpr, rx = ox - pad, ry = oy - pad, rw = 64 * s * dpr + 2 * pad, rh = 48 * s * dpr + 2 * pad;
      if (T.wide || assembling) ctx.clearRect(0, 0, canvas.width, canvas.height);
      else ctx.clearRect(rx, ry, rw, rh);
      T.wide = assembling;
      if (!T.w || T.start === null) return;      // not shown yet: nothing, until it assembles
      ctx.setTransform(s * dpr, 0, 0, s * dpr, ox, oy);

      let light = DEFAULT_LIGHT, local: [number, number] | null = null;
      if (live && pointer && presence > 0.001) {
        const r = T.ref!.getBoundingClientRect();
        const px = (pointer[0] - (r.left + r.width / 2)) / s, py = (pointer[1] - (r.top + r.height / 2)) / s;
        const len = Math.hypot(px, py) || 1;
        const lx = DEFAULT_LIGHT[0] + (px / len - DEFAULT_LIGHT[0]) * presence;
        const ly = DEFAULT_LIGHT[1] + (py / len - DEFAULT_LIGHT[1]) * presence;
        const n = Math.hypot(lx, ly) || 1;
        light = [lx / n, ly / n];
        local = [px + 32, py + 24];
      }
      // Mid-assembly, under the pointer, or still: draw every dot.
      const near = local !== null && Math.hypot(local[0] - 32, local[1] - 24) < 50;
      if (!live || assembling || near) {
        drawDots(ctx, T.dots, { assemble: assembling ? since : null, light, pointer: local, presence, drift: live ? now / 1000 : null });
        return;
      }
      // At rest: the drawing's own dots only change with the light's angle
      // and the slow shimmer, so they are rendered into a cache (2 degree
      // light steps, SHIMMER_FPS shimmer steps) and copied; only the scatter
      // is drawn every frame. Profiled: drawing every dot of all twelve every
      // frame cost ~120 ms of main thread a second.
      const ang = Math.round((Math.atan2(light[1], light[0]) * 90) / Math.PI);
      const step = Math.round((now / 1000) * SHIMMER_FPS) / SHIMMER_FPS;
      const key = `${ang}|${step}`;
      const C = (T.cache ??= document.createElement("canvas"));
      if (C.width !== canvas.width || C.height !== canvas.height) { C.width = canvas.width; C.height = canvas.height; T.cacheKey = ""; }
      if (T.cacheKey !== key) {
        const c = C.getContext("2d")!;
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.clearRect(0, 0, C.width, C.height);
        c.setTransform(s * dpr, 0, 0, s * dpr, ox, oy);
        const a = (ang * Math.PI) / 90;
        drawDots(c, T.dots, { assemble: null, light: [Math.cos(a), Math.sin(a)], pointer: null, presence: 0, drift: step, only: "body" });
        T.cacheKey = key;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(C, rx, ry, rw, rh, rx, ry, rw, rh);
      ctx.setTransform(s * dpr, 0, 0, s * dpr, ox, oy);
      drawDots(ctx, T.dots, { assemble: null, light, pointer: null, presence: 0, drift: now / 1000, only: "halo" });
    };

    /* ---- assemble: the first time each group is on screen and shown ------- */
    const seen = new Set<HTMLElement>(), inView = new Set<HTMLElement>();
    const check = () => {
      if (!live) return;
      const now = performance.now();
      for (const g of groups) {
        if (seen.has(g) || !inView.has(g) || getComputedStyle(g).visibility === "hidden") continue;
        seen.add(g);
        for (const T of tiles) if (T.group === g) T.start = now;
      }
      kick();
    };

    /* ---- loop: only while something is on screen -------------------------- */
    let raf = 0, last = performance.now(), lastDraw = 0, lastMove = 0;
    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      presence += (presenceTarget - presence) * (1 - Math.exp(-dt * 6));
      // Full rate while something is moving (an assembly, the pointer, the
      // light settling); the idle drift is slow (IDLE_FRAME_MS).
      const busy = now - lastMove < 300 || Math.abs(presenceTarget - presence) > 0.01 ||
        tiles.some((T) => T.onScreen && T.start !== null && now - T.start < (ASSEMBLE_S + ASSEMBLE_LAG_S + 1) * 1000);
      let any = false;
      for (const T of tiles) if (T.onScreen && T.w) any = true;
      if (any && (busy || now - lastDraw >= IDLE_FRAME_MS)) {
        lastDraw = now;
        for (const T of tiles) if (T.onScreen && T.w) draw(T, now);
      }
      if (live && any && !document.hidden) raf = requestAnimationFrame(frame);
    };
    function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

    size();
    let ioTiles: IntersectionObserver | null = null, ioGroups: IntersectionObserver | null = null, mo: MutationObserver | null = null;
    if (live) {
      ioTiles = new IntersectionObserver((es) => { for (const e of es) { const T = tiles.find((t) => t.box === e.target); if (T) T.onScreen = e.isIntersecting; } kick(); }, { rootMargin: "80px" });
      tiles.forEach((T) => ioTiles!.observe(T.box));
      ioGroups = new IntersectionObserver((es) => { for (const e of es) (e.isIntersecting ? inView.add(e.target as HTMLElement) : inView.delete(e.target as HTMLElement)); check(); }, { threshold: 0.3 });
      groups.forEach((g) => ioGroups!.observe(g));
      // Arun's panels switch by class; a panel becoming active is "shown"
      mo = new MutationObserver(check);
      groups.forEach((g) => mo!.observe(g, { attributes: true, attributeFilter: ["class"] }));
      if (hover) { window.addEventListener("pointermove", onMove, { passive: true }); document.addEventListener("pointerout", onLeave); }
      document.addEventListener("visibilitychange", kick);
    } else {
      for (const T of tiles) draw(T, 0);
    }
    let resizeT = 0;
    const onResize = () => { window.clearTimeout(resizeT); resizeT = window.setTimeout(() => { size(); if (live) kick(); else tiles.forEach((T) => draw(T, 0)); }, 120); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      ioTiles?.disconnect(); ioGroups?.disconnect(); mo?.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onLeave);
      document.removeEventListener("visibilitychange", kick);
      window.removeEventListener("resize", onResize);
      tiles.forEach((T) => T.canvas.remove());
    };
  }, [motion]);
  return null;
}
