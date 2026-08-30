"use client";

import dynamic from "next/dynamic";

/* Client wrapper: both scenes need WebGL, so `ssr: false` — which is only
   legal inside a Client Component. */

const GlassRibbon = dynamic(
  () => import("./glass-ribbon").then((m) => m.GlassRibbon),
  { ssr: false },
);
const LogoSphere = dynamic(
  () => import("./logo-sphere").then((m) => m.LogoSphere),
  { ssr: false },
);

export function LabScenes({ scene }: { scene: "ribbon" | "mark" }) {
  if (scene === "ribbon") {
    return (
      <div className="bg-wash overflow-hidden rounded-2xl">
        <GlassRibbon style={{ width: "100%", aspectRatio: "16 / 9" }} />
      </div>
    );
  }
  return <LogoSphere style={{ width: 300, height: 300 }} />;
}
