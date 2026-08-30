"use client";

import dynamic from "next/dynamic";

/* Thin client wrapper so the page itself stays a Server Component.
   `ssr: false` is only legal inside a Client Component, and the mark must be
   client-only: it needs WebGL, document.fonts and a canvas.

   No loading placeholder on purpose — the hero's pale wash sits behind this
   slot already, so an empty box IS the correct intermediate state and a
   spinner would only add a flash. */
const LogoSphere = dynamic(
  () => import("./logo-sphere").then((m) => m.LogoSphere),
  { ssr: false },
);

export function HeroMark({ style }: { style?: React.CSSProperties }) {
  return <LogoSphere style={style} />;
}
