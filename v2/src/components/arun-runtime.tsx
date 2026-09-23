"use client";

import { useEffect, useRef } from "react";

/* ===========================================================================
 * Arun's scripts, loaded in his order, from one place.
 * ---------------------------------------------------------------------------
 * index4.html loads these as four plain <script> tags in this exact sequence:
 *
 *   three.min.js      r128, defines window.THREE
 *   ui.js             portfolio slider, teardown modal, smooth scroll
 *   capabilities.js   the inline <script> from his head, lifted out verbatim
 *   app4.js           the 3D hero engine
 *
 * The order is load-bearing: ui.js and app4.js both read window.THREE at
 * module scope, so three has to be evaluated first. `async = false` on an
 * injected script preserves execution order the way a plain tag does.
 *
 * Loading is centralised here rather than split across the hero and sections
 * components, because two components racing to append scripts cannot
 * guarantee that sequence.
 *
 * All four files run their work inside a DOMContentLoaded listener. That
 * event fired long before React mounted anything, so one is dispatched after
 * the last script lands. This is what lets every file stay byte-identical to
 * his - none of them needed rewriting into an init function.
 * ======================================================================== */

const SCRIPTS = [
  "/arun/three.min.js",
  "/arun/ui.js",
  "/arun/capabilities.js",
  "/arun/app4.js",
];

export function ArunRuntime() {
  const started = useRef(false);

  useEffect(() => {
    // React 18 StrictMode mounts effects twice in dev. These scripts append a
    // canvas and bind window listeners, so a second run would stack a
    // duplicate renderer on top of the first.
    if (started.current) return;
    started.current = true;

    const load = (src: string) =>
      new Promise<void>((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const el = document.createElement("script");
        el.src = src;
        el.async = false;
        el.onload = () => resolve();
        el.onerror = () => reject(new Error(`failed to load ${src}`));
        document.body.appendChild(el);
      });

    (async () => {
      for (const src of SCRIPTS) await load(src);
      document.dispatchEvent(new Event("DOMContentLoaded"));
    })().catch((err) => console.error("[arun-runtime]", err));
  }, []);

  return null;
}
