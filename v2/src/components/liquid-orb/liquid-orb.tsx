"use client";

/* ===========================================================================
 * The Liquid Orb: the client's WebGPU glass orb (2026-09-30), on /why-gravino
 * beside "Where we fit", in place of the EmbeddedMap diagram.
 * ---------------------------------------------------------------------------
 * The render loop is the page's own, in its "thinking" state, with what a
 * page section needs around it:
 *
 *   - The shader (and its 50 kB of source) loads only when this mounts.
 *   - Pauses off screen; one still frame under reduced motion.
 *   - The GPU device is destroyed on unmount.
 *   - Not carried over: the audio-reactive hooks (nothing feeds them here),
 *     the state switcher (one state is used), and the particle-ribbon passes
 *     (style 24 only; see shader.ts).
 *
 * WebGPU is not everywhere yet (older Safari, most Firefox). Where it is
 * missing, or fails, the CSS orb underneath stays: the same palette, still.
 * ======================================================================== */

import { useEffect, useRef, useState } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any -- WebGPU types are not
   in TypeScript's DOM lib, and the package that has them is not worth adding
   for one component. */

export function LiquidOrb({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gpu = (navigator as any).gpu;
    if (!canvas || !gpu) return;

    let stopped = false;
    let raf = 0;
    let device: any = null;
    let visible = true;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let io: IntersectionObserver | null = null;

    const stop = () => {
      stopped = true;
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
      device?.destroy();
    };

    (async () => {
      const { WGSL, THINKING } = await import("./shader");
      const adapter = await gpu.requestAdapter();
      if (!adapter || stopped) return;
      device = await adapter.requestDevice();
      if (stopped) { device.destroy(); return; }
      const context = canvas.getContext("webgpu") as any;
      if (!context) return stop();

      const format = gpu.getPreferredCanvasFormat();
      context.configure({ device, format, alphaMode: "premultiplied" });
      const shader = device.createShaderModule({ code: WGSL });
      const info = await shader.getCompilationInfo();
      const errors = info.messages.filter((m: any) => m.type === "error");
      if (errors.length) {
        console.error("Liquid orb shader:", errors.map((m: any) => `${m.lineNum}:${m.linePos} ${m.message}`).join("\n"));
        return stop();
      }

      const blend = {
        color: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
        alpha: { srcFactor: "one", dstFactor: "one-minus-src-alpha", operation: "add" },
      };
      const pipeline = device.createRenderPipeline({
        layout: "auto",
        vertex: { module: shader, entryPoint: "vs_main" },
        fragment: { module: shader, entryPoint: "fs_main", targets: [{ format, blend }] },
        primitive: { topology: "triangle-list" },
      });
      const values = new Float32Array(THINKING);
      const GPUBufferUsage = (window as any).GPUBufferUsage;
      const uniformBuffer = device.createBuffer({
        size: values.byteLength,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });
      const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
      });
      device.lost.then(() => { if (!stopped) setLive(false); });
      device.addEventListener("uncapturederror", (e: any) => {
        e.preventDefault();
        console.error("Liquid orb:", e.error?.message);
        setLive(false);
        stop();
      });

      // As in the page: time advances by frame delta times speed, so a paused
      // tab resumes where it left off instead of jumping.
      let last: number | null = null;
      let phase = 0;
      let shown = false;
      const speed = values[3];
      const frame = (now: number) => {
        raf = 0;
        if (stopped) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
        const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
        const dt = last === null ? 0 : Math.min(0.1, Math.max(0, (now - last) / 1000));
        last = now;
        phase += dt * Math.max(speed, 0);
        values[0] = w;
        values[1] = h;
        values[2] = phase / Math.max(speed, 0.001);
        device.queue.writeBuffer(uniformBuffer, 0, values);

        const encoder = device.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [{
            view: context.getCurrentTexture().createView(),
            clearValue: { r: 0, g: 0, b: 0, a: 0 },
            loadOp: "clear",
            storeOp: "store",
          }],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3);
        pass.end();
        device.queue.submit([encoder.finish()]);
        if (!shown) { shown = true; setLive(true); }
        if (visible && !still) raf = requestAnimationFrame(frame);
      };
      const kick = () => { if (!raf && !stopped) raf = requestAnimationFrame(frame); };

      io = new IntersectionObserver((es) => {
        visible = es.some((e) => e.isIntersecting);
        if (visible) { last = null; kick(); }
      });
      io.observe(canvas);
      kick();
    })().catch((err) => {
      console.error("Liquid orb:", err);
      stop();
    });

    return stop;
  }, []);

  return (
    <div className={`relative aspect-square ${className}`}>
      {/* The still orb: what shows before the GPU draws, and instead of it
          where WebGPU is missing. The page's own colours. */}
      <div
        aria-hidden
        className={`absolute inset-[14%] rounded-full transition-opacity duration-700 ${live ? "opacity-0" : "opacity-100"}`}
        style={{
          background:
            "radial-gradient(circle at 34% 28%, rgba(255,255,255,.28), transparent 32%)," +
            "linear-gradient(170deg, transparent 38%, rgba(130,244,255,.55) 47%, rgba(255,123,213,.5) 52%, rgba(142,108,255,.55) 57%, transparent 66%)," +
            "radial-gradient(circle at 50% 50%, #0a0d1f, #030409 72%)",
          boxShadow: "inset 0 0 0 1px rgba(155,244,255,.25), 0 0 60px rgba(142,108,255,.18)",
        }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
