"use client";

import dynamic from "next/dynamic";
import { CornerMarks } from "./editorial";

/* Client wrapper so the page stays a Server Component: `ssr: false` is only
   legal inside a Client Component, and the scene needs WebGL and a canvas.

   No loading placeholder — the pale wash below is the scene's own backdrop
   colour, so an empty box is the correct intermediate state. */
const GlassRibbon = dynamic(
  () => import("./glass-ribbon").then((m) => m.GlassRibbon),
  { ssr: false },
);

export function RibbonFigure({ caption }: { caption?: string }) {
  return (
    <figure className="relative">
      <CornerMarks className="text-on-paper" />
      <div className="bg-wash overflow-hidden rounded-2xl">
        <GlassRibbon style={{ width: "100%", aspectRatio: "16 / 10" }} />
      </div>
      {caption ? (
        <figcaption className="label mt-4 text-on-paper-dim">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
