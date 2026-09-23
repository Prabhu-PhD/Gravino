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

/* ONE EDIT EXISTS IN ui.js, and it is the only one: the portfolio's second
   image reference moved from .png to .jpg. That file was a photograph saved
   as a 949KB PNG; it is 41KB as a JPEG. It had been handled by a Next
   rewrite so his file could stay byte-identical, but `output: export` does
   not support rewrites, and coupling a content path to an Apache .htaccess
   rule is worse than changing one filename in a JS file. app4.js,
   capabilities.js and three.min.js remain byte-identical. */
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

      /* app4.js calls renderer.setSize(innerWidth, innerHeight) the moment it
         initialises. As a plain script in his <body> that runs during parse,
         against a settled viewport. Here it runs from an effect after
         hydration, so if the viewport changed while the page was loading -
         an orientation change, or a mobile browser collapsing its URL bar -
         the renderer sizes against the stale value and the canvas ends up
         WIDER than the viewport, which gives the whole page horizontal
         scroll once the pinned hero releases.

         Honest note on provenance: the case that prompted this turned out to
         be the preview pane's own emulation settling late, and his build
         reproduces it identically, so it was NOT a defect in this port. The
         kick is kept anyway because the exposure is real and asymmetric -
         his scripts run during parse, ours run after hydration, which is a
         strictly wider window for the viewport to change underneath them.
         It costs one event, and his resize handler was always fine; it just
         never fired. */
      requestAnimationFrame(() => window.dispatchEvent(new Event("resize")));
    })().catch((err) => console.error("[arun-runtime]", err));

    /* app4.js pins the hero by putting `hero-locked` on <html> and <body>,
       and has no teardown of its own. If this component ever unmounts
       without a document load - a <Link> added to the home page later -
       that class would survive onto the next page and stop it scrolling.
       Cheap insurance against a failure that is silent when it happens. */
    return () => {
      document.documentElement.classList.remove("hero-locked");
      document.body.classList.remove("hero-locked");
    };
  }, []);

  return null;
}
