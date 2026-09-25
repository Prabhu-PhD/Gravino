"use client";

/* ===========================================================================
 * The gate in front of <CelestialBody>.
 * ---------------------------------------------------------------------------
 * Two jobs, and both matter more than they look.
 *
 * 1. IT DOES NOT MOUNT BELOW 1024px. Not `hidden lg:block` — that still puts
 *    the component in the tree, which still creates a WebGL context and still
 *    pulls the three.js chunk down a phone's connection to render nothing.
 *    The media query decides whether the element exists at all, so on a phone
 *    three is never fetched. That is the single biggest reason this is cheap.
 *
 * 2. IT LOADS three LAZILY. next/dynamic with ssr: false means the chunk is
 *    requested only once the query passes, and never during the static export.
 *    three is otherwise only used by /lab, so interior pages carried none of
 *    it before and should not start carrying it in the main bundle now.
 *
 * The CSS mask is here rather than in the component because it is a fact about
 * this slot, not about the scene: the canvas is a rectangle and the page head
 * is a soft gradient, so the edges have to dissolve or the figure ends on four
 * visible lines.
 * ======================================================================== */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const CelestialBody = dynamic(
  () => import("./celestial-body").then((m) => m.CelestialBody),
  { ssr: false },
);

/** True once the viewport is wide enough to be worth the GPU. */
function useWideViewport() {
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setWide(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return wide;
}

/* The canvas is a rectangle with particles right up to its edges, so without a
 * mask it ends on visible straight lines.
 *
 * This was a single radial gradient first and that could not work. The sphere's
 * lit limb sits at about 26% of the canvas width, so the mask has to be fully
 * opaque over the crescent and fully transparent 26% later at the left edge --
 * an ellipse wide enough to clear the crescent is still 58% opaque at the edge,
 * and one that fades by the edge dims the crescent. Measured, not guessed: the
 * first attempt left the top and bottom edges at 81% opacity, which is exactly
 * the hard line it was supposed to prevent.
 *
 * Two linear masks intersected instead, so each axis is tuned on its own:
 *   across - transparent at the left edge, opaque by 20%, clearing the crescent
 *   down   - a fast 9% fade top and bottom, enough to kill the line while the
 *            ring still reads as sweeping off frame rather than stopping
 * The right edge is deliberately unfaded: it bleeds past the viewport anyway. */
const MASK_ACROSS = "linear-gradient(to right, transparent 0%, #000 20%)";
const MASK_DOWN =
  "linear-gradient(to bottom, transparent 0%, #000 9%, #000 91%, transparent 100%)";
const MASK_LAYERS = `${MASK_ACROSS}, ${MASK_DOWN}`;

export function CelestialFigure() {
  const wide = useWideViewport();
  if (!wide) return null;

  return (
    <div
      aria-hidden
      /* Bleeds past the shell's right edge so it reads as a figure the page is
       * cropping, not a boxed illustration parked in a column. */
      className="pointer-events-none absolute -right-28 top-1/2 hidden h-[34rem] w-[30rem] -translate-y-1/2 lg:block xl:-right-20 xl:h-[40rem] xl:w-[36rem]"
      style={{
        maskImage: MASK_LAYERS,
        WebkitMaskImage: MASK_LAYERS,
        // Both spellings: Safari only took the -webkit- form until recently.
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
      }}
    >
      <CelestialBody className="h-full w-full" />
    </div>
  );
}
