"use client";

/* ===========================================================================
 * The forcefield between each moon and Gravino, on /why-gravino "Where we fit".
 * ---------------------------------------------------------------------------
 * The client (2026-10-01): no orbit ring, no boundary, just three moons
 * revolving round the Gravino orb, with a visible forcefield running from
 * each moon into the centre: Gravino is embedded, and fits.
 *
 * Drawn on one 2D canvas inside the same spinning layer as the moons, so the
 * geometry is fixed in that layer's frame (each moon sits at its seat angle)
 * and the CSS rotation carries canvas and moons round together. Per moon:
 *
 *   FIELD. A soft funnel, as wide as the moon at its end and narrowing into
 *     the orb, in the moon's colour, with a glow where it meets the orb.
 *     Translucent: it reads as a field, not a beam.
 *   STREAM. Fine particles leave the moon's facing side and converge on the
 *     orb along curved paths, brightening as they arrive, in the moon's
 *     colour.
 *
 * Additive blending, so overlaps glow rather than muddy. Paused off screen;
 * one still frame under reduced motion. Sized by ResizeObserver, at device
 * pixel ratio (capped at 2).
 * ======================================================================== */

import { useEffect, useRef } from "react";

export type Stream = {
  /** Seat angle in degrees, in the spinning layer's frame. */
  deg: number;
  /** Moon colour, as r,g,b. */
  rgb: [number, number, number];
};

/** All geometry in % of the square's side. */
export function ForceStreams({
  streams,
  orbit,
  moon,
  core,
}: {
  streams: readonly Stream[];
  /** Radius of the moons' centres. */
  orbit: number;
  /** Diameter of a moon. */
  moon: number;
  /** Radius of the orb's visible disc, where the streams end. */
  core: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Seeded, so the still frame is the same on every load.
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

    const PER = 70;
    type P = { t: number; v: number; a: number; s: number };
    const flows = streams.map(() =>
      Array.from({ length: PER }, (): P => ({
        t: rnd(),
        v: 0.22 + rnd() * 0.2, // trips per second: a particle crosses in 2.5-4.5s
        a: (rnd() - 0.5) * 1.5, // where on the moon's facing side it leaves, radians
        s: 0.55 + rnd() * 0.7, // size factor
      })),
    );

    let size = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
    };
    resize();

    const draw = (dt: number) => {
      const W = canvas.width;
      if (!W) return;
      const u = W / 100; // one % of the side, in device pixels
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, W);
      ctx.globalCompositeOperation = "lighter";
      const cx = 50 * u, cy = 50 * u;
      const mr = (moon / 2) * u;

      streams.forEach((st, k) => {
        const [r, g, b] = st.rgb;
        const ang = (st.deg * Math.PI) / 180;
        const dx = Math.cos(ang), dy = Math.sin(ang); // centre -> moon
        const nx = -dy, ny = dx; // across the axis
        const mx = cx + dx * orbit * u, my = cy + dy * orbit * u; // moon centre
        const ex = cx + dx * core * u, ey = cy + dy * core * u; // where it meets the orb

        /* FIELD: a funnel from the moon's width down to a narrow neck. */
        const wide = mr * 0.95, neck = mr * 0.22;
        const grad = ctx.createLinearGradient(mx, my, ex, ey);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.05)`);
        grad.addColorStop(0.55, `rgba(${r},${g},${b},0.13)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0.24)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(mx + nx * wide, my + ny * wide);
        ctx.quadraticCurveTo(
          (mx + ex) / 2 + nx * neck * 1.4, (my + ey) / 2 + ny * neck * 1.4,
          ex + nx * neck, ey + ny * neck,
        );
        ctx.lineTo(ex - nx * neck, ey - ny * neck);
        ctx.quadraticCurveTo(
          (mx + ex) / 2 - nx * neck * 1.4, (my + ey) / 2 - ny * neck * 1.4,
          mx - nx * wide, my - ny * wide,
        );
        ctx.closePath();
        ctx.fill();

        /* Where the field meets the orb: a soft glow, so the stream is seen
           to arrive rather than stop. */
        const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, mr * 0.7);
        glow.addColorStop(0, `rgba(${r},${g},${b},0.28)`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ex, ey, mr * 0.7, 0, Math.PI * 2);
        ctx.fill();

        /* STREAM: each particle leaves a point on the moon's facing side and
           curves in to the neck. */
        for (const p of flows[k]) {
          p.t += p.v * dt;
          if (p.t >= 1) p.t -= 1;
          const t = p.t;
          // Start on the moon's rim, on the side facing the orb.
          const sa = Math.atan2(-dy, -dx) + p.a;
          const sx = mx + Math.cos(sa) * mr * 0.92, sy = my + Math.sin(sa) * mr * 0.92;
          // End across the neck, by the same side the particle started on.
          const side = Math.sin(p.a) * neck;
          const fx = ex + nx * side, fy = ey + ny * side;
          // Control point: on the axis, pulling the path inward.
          const qx = (sx + fx) / 2 * 0.5 + (mx + ex) / 2 * 0.5;
          const qy = (sy + fy) / 2 * 0.5 + (my + ey) / 2 * 0.5;
          const it = 1 - t;
          const x = it * it * sx + 2 * it * t * qx + t * t * fx;
          const y = it * it * sy + 2 * it * t * qy + t * t * fy;
          // Fade in off the moon, brighten on the way, fade into the orb.
          const alpha = Math.min(1, t * 6) * Math.min(1, (1 - t) * 5) * (0.35 + 0.65 * t);
          // Sized from the diagram, not in fixed pixels, so the stream reads
          // the same at 320px and at 540px (1px dots vanished on desktop).
          const rad = (0.16 + 0.2 * t) * p.s * u;
          ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, rad, 0, Math.PI * 2);
          ctx.fill();
          // A brighter core on the leading particles.
          if (t > 0.55) {
            ctx.fillStyle = `rgba(255,255,255,${(alpha * 0.5).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(x, y, rad * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.globalCompositeOperation = "source-over";
    };

    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      draw(dt);
      if (visible && !still) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) {
        last = 0;
        raf = requestAnimationFrame(loop);
      }
    };

    const io = new IntersectionObserver((es) => {
      visible = es.some((e) => e.isIntersecting);
      if (visible) kick();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      if (canvas.clientWidth !== size) {
        resize();
        kick();
      }
    });
    ro.observe(canvas);
    kick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [streams, orbit, moon, core]);

  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
