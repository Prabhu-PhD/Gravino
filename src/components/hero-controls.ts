"use client";

import { useRef } from "react";
import { useControls, folder, button } from "leva";

/* ---------------------------------------------------------------------------
 * Live tuning controls for the hero scene.
 *
 * The panel is hidden unless the URL carries `?tune` — so it never ships to
 * visitors, but is one query-param away in any environment.
 *
 * Everything here is *authored* state: presets are just bundles of the same
 * values the sliders expose, so switching a preset and then nudging a slider
 * behaves exactly as expected.
 * ------------------------------------------------------------------------- */

export type GlassParams = ReturnType<typeof useHeroControls>["glass"];
export type EnvParams = ReturnType<typeof useHeroControls>["env"];
export type BackdropParams = ReturnType<typeof useHeroControls>["backdrop"];

/** Material bundles. Applied by the buttons in the Glass folder. */
const GLASS_PRESETS = {
  Tinted: {
    roughness: 0.03,
    ior: 1.5,
    chromaticAberration: 0.05,
    anisotropy: 0.15,
    distortion: 0,
    distortionScale: 0.3,
    temporalDistortion: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.03,
    attenuationColor: "#6ea8ee",
    attenuationDistance: 2.2,
    bodyColor: "#ffffff",
    envIntensityPane: 2.2,
    envIntensitySphere: 1,
    thicknessPane: 0.6,
    thicknessSphere: 1.1,
  },
  Crystal: {
    roughness: 0,
    ior: 1.52,
    chromaticAberration: 0.09,
    anisotropy: 0.1,
    distortion: 0,
    distortionScale: 0.3,
    temporalDistortion: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    attenuationColor: "#bcdcff",
    attenuationDistance: 18,
    bodyColor: "#ffffff",
    envIntensityPane: 4.5,
    envIntensitySphere: 3.2,
    thicknessPane: 0.6,
    thicknessSphere: 1.1,
  },
  Prism: {
    roughness: 0,
    ior: 1.62,
    chromaticAberration: 0.28,
    anisotropy: 0.45,
    distortion: 0,
    distortionScale: 0.3,
    temporalDistortion: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0,
    attenuationColor: "#cbd9ff",
    attenuationDistance: 22,
    bodyColor: "#ffffff",
    envIntensityPane: 5.5,
    envIntensitySphere: 4,
    thicknessPane: 0.6,
    thicknessSphere: 1.1,
  },
  Frosted: {
    roughness: 0.32,
    ior: 1.45,
    chromaticAberration: 0.02,
    anisotropy: 0.2,
    distortion: 0.25,
    distortionScale: 0.5,
    temporalDistortion: 0.15,
    clearcoat: 1,
    clearcoatRoughness: 0.25,
    attenuationColor: "#a9c8f2",
    attenuationDistance: 3.5,
    bodyColor: "#f4f8ff",
    envIntensityPane: 1.4,
    envIntensitySphere: 1,
    thicknessPane: 0.9,
    thicknessSphere: 1.4,
  },
  Liquid: {
    roughness: 0.02,
    ior: 1.33,
    chromaticAberration: 0.14,
    anisotropy: 0.6,
    distortion: 0.4,
    distortionScale: 0.7,
    temporalDistortion: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    attenuationColor: "#8fd0f0",
    attenuationDistance: 9,
    bodyColor: "#ffffff",
    envIntensityPane: 3.4,
    envIntensitySphere: 2.6,
    thicknessPane: 0.7,
    thicknessSphere: 1.2,
  },
} as const;

/** Environment bundles — the world the glass reflects and refracts. */
const ENV_PRESETS = {
  Brand: {
    skyColor: "#4d6ebe",
    horizonColor: "#ffffff",
    groundColor: "#7e508a",
    skyStrength: 1,
    horizonStrength: 1,
    groundStrength: 1,
    horizonPos: 0.46,
    horizonWidth: 0.1,
    drift: 0.12,
    exposure: 1,
    stripIntensity: 1,
    stripSharpness: 1,
    dotIntensity: 1,
  },
  Studio: {
    skyColor: "#8ea3c4",
    horizonColor: "#ffffff",
    groundColor: "#6d6f7a",
    skyStrength: 0.85,
    horizonStrength: 1.15,
    groundStrength: 0.7,
    horizonPos: 0.5,
    horizonWidth: 0.14,
    drift: 0.04,
    exposure: 1.05,
    stripIntensity: 1.3,
    stripSharpness: 1.4,
    dotIntensity: 0.8,
  },
  Dusk: {
    skyColor: "#3c4d94",
    horizonColor: "#ffd9b0",
    groundColor: "#8c4a6b",
    skyStrength: 1.1,
    horizonStrength: 0.95,
    groundStrength: 1.05,
    horizonPos: 0.42,
    horizonWidth: 0.08,
    drift: 0.2,
    exposure: 0.95,
    stripIntensity: 0.9,
    stripSharpness: 1.1,
    dotIntensity: 1.2,
  },
  Mono: {
    skyColor: "#9a9a9a",
    horizonColor: "#ffffff",
    groundColor: "#6a6a6a",
    skyStrength: 0.9,
    horizonStrength: 1,
    groundStrength: 0.9,
    horizonPos: 0.46,
    horizonWidth: 0.12,
    drift: 0,
    exposure: 1,
    stripIntensity: 1,
    stripSharpness: 1,
    dotIntensity: 1,
  },
  Contrast: {
    skyColor: "#101a3a",
    horizonColor: "#ffffff",
    groundColor: "#1a1030",
    skyStrength: 1,
    horizonStrength: 1.3,
    groundStrength: 1,
    horizonPos: 0.46,
    horizonWidth: 0.05,
    drift: 0.1,
    exposure: 1.1,
    stripIntensity: 2.2,
    stripSharpness: 2,
    dotIntensity: 1.5,
  },
} as const;

/**
 * ============================ REMOVE BEFORE LAUNCH ============================
 * TEMPORARY: the tuning panel is shown to EVERYONE, so the hero can be tuned
 * directly on the deployed site without remembering a query param.
 *
 * To take it down for the public release, flip this one constant to `false`.
 * That is the only change required — the panel disappears and leva's bundle
 * is no longer rendered. (Removing the dependency entirely is a bigger job:
 * hero-wave.tsx reads every parameter from here, so the values would need
 * to be inlined as plain constants first.)
 *
 * Meanwhile `?tune=0` hides it ad-hoc — handy for checking how the hero
 * actually looks, or screenshotting it, without redeploying.
 * =============================================================================
 */
const SHOW_PANEL_BY_DEFAULT = true;

export function useHeroControls() {
  const tuning = (() => {
    if (typeof window === "undefined") return false; // never during SSR
    const p = new URLSearchParams(window.location.search);
    if (p.get("tune") === "0") return false; // explicit opt-out
    return SHOW_PANEL_BY_DEFAULT || p.has("tune");
  })();

  /* ------------------------------------------------------------- material */
  const [glass, setGlass] = useControls("Glass", () => ({
    roughness: { value: 0.14, min: 0, max: 1, step: 0.005 },
    ior: { value: 2.02, min: 1, max: 2.5, step: 0.01 },
    chromaticAberration: { value: 0.02, min: 0, max: 1, step: 0.005 },
    anisotropy: { value: 0.6, min: 0, max: 1, step: 0.01 },
    "Body + absorption": folder(
      {
        bodyColor: "#73bfff",
        attenuationColor: "#f1b4ff",
        attenuationDistance: { value: 3.85, min: 0.05, max: 60, step: 0.05 },
      },
      { collapsed: true },
    ),
    "Coat + distortion": folder(
      {
        clearcoat: { value: 0.59, min: 0, max: 1, step: 0.01 },
        clearcoatRoughness: { value: 0.35, min: 0, max: 1, step: 0.005 },
        distortion: { value: 0.14, min: 0, max: 1, step: 0.01 },
        distortionScale: { value: 0.41, min: 0, max: 2, step: 0.01 },
        temporalDistortion: { value: 0.28, min: 0, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
    "Per-object": folder(
      {
        thicknessPane: { value: 0.95, min: 0.05, max: 4, step: 0.05 },
        thicknessSphere: { value: 2.65, min: 0.05, max: 6, step: 0.05 },
        envIntensityPane: { value: 1.9, min: 0, max: 12, step: 0.1 },
        envIntensitySphere: { value: 0.9, min: 0, max: 12, step: 0.1 },
      },
      { collapsed: true },
    ),
    "Quality (perf)": folder(
      {
        samples: { value: 10, min: 1, max: 24, step: 1 },
        resolution: { value: 2048, options: [256, 512, 1024, 2048] },
      },
      { collapsed: true },
    ),
  }));

  /* ---------------------------------------------------------- environment */
  const [env, setEnv] = useControls("Environment", () => ({
    skyColor: "#27c8de",
    horizonColor: "#ffffff",
    groundColor: "#30102c",
    skyStrength: { value: 1.2, min: 0, max: 3, step: 0.02 },
    horizonStrength: { value: 0.72, min: 0, max: 3, step: 0.02 },
    groundStrength: { value: 1, min: 0, max: 3, step: 0.02 },
    horizonPos: { value: 0.46, min: 0, max: 1, step: 0.01 },
    horizonWidth: { value: 0.05, min: 0.01, max: 0.5, step: 0.005 },
    drift: { value: 0.21, min: 0, max: 1, step: 0.01 },
    exposure: { value: 1.6, min: 0.1, max: 3, step: 0.02 },
    "Strip lights": folder(
      {
        stripIntensity: { value: 2.2, min: 0, max: 4, step: 0.05 },
        stripSharpness: { value: 2, min: 0.2, max: 4, step: 0.05 },
        stripTint: "#f79cf4",
        strip1U: { value: 0.32, min: 0, max: 1, step: 0.01 },
        strip1V: { value: 0.24, min: 0, max: 1, step: 0.01 },
        strip2U: { value: 0.68, min: 0, max: 1, step: 0.01 },
        strip2V: { value: 0.52, min: 0, max: 1, step: 0.01 },
        strip3U: { value: 0.5, min: 0, max: 1, step: 0.01 },
        strip3V: { value: 0.08, min: 0, max: 1, step: 0.01 },
      },
      { collapsed: true },
    ),
    "Accents": folder(
      {
        dotIntensity: { value: 1.3, min: 0, max: 4, step: 0.05 },
        dotSize: { value: 1.7, min: 0.2, max: 4, step: 0.05 },
      },
      { collapsed: true },
    ),
    "Texture size (perf)": folder(
      { envWidth: { value: 1024, options: [256, 512, 1024, 2048] } },
      { collapsed: true },
    ),
  }));

  /* ------------------------------------------------- refraction backdrop */
  const backdrop = useControls(
    "Backdrop (seen through glass)",
    {
      bd0: { value: "#a9cdfa", label: "stop 0" },
      bd1: { value: "#dfe4fb", label: "stop 1" },
      bd2: { value: "#e9d9f6", label: "stop 2" },
      bd3: { value: "#f6d3e6", label: "stop 3" },
      spotStrength: { value: 1.2, min: 0, max: 2, step: 0.02 },
    },
    { collapsed: true },
  );

  /* ---------------------------------------------------------- geometry */
  const geom = useControls(
    "Geometry",
    {
      paneDepthMul: { value: 1.8, min: 0.1, max: 8, step: 0.05 },
      paneThicknessPx: { value: 3.5, min: 0.5, max: 60, step: 0.5 },
      sphereScale: { value: 1.16, min: 0.2, max: 3, step: 0.02 },
      smoothSigma: { value: 17.2, min: 0.1, max: 30, step: 0.1 },
      "Depth sweep (Z)": folder(
        {
          depthAmp: { value: 3.1, min: 0, max: 8, step: 0.05 },
          depthFreq: { value: 0.14, min: 0, max: 1, step: 0.005 },
          depthPhase: { value: -1.0, min: -Math.PI, max: Math.PI, step: 0.01 },
        },
        { collapsed: true },
      ),
      "Tessellation": folder(
        {
          faceSegs: { value: 20, min: 2, max: 60, step: 1 },
          wallSegs: { value: 3, min: 1, max: 20, step: 1 },
          lengthStride: { value: 1, min: 1, max: 8, step: 1 },
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  );

  /* ------------------------------------------------------ camera + lights */
  const scene = useControls(
    "Scene",
    {
      camX: { value: -2.0, min: -20, max: 20, step: 0.1 },
      camY: { value: 0.2, min: -20, max: 20, step: 0.1 },
      camZ: { value: 12.9, min: 0.5, max: 40, step: 0.1 },
      fov: { value: 36, min: 10, max: 100, step: 1 },
      lookAtY: { value: 1.05, min: -8, max: 8, step: 0.05 },
      "Lights": folder(
        {
          ambient: { value: 0.3, min: 0, max: 3, step: 0.02 },
          keyIntensity: { value: 1.6, min: 0, max: 6, step: 0.05 },
          fillIntensity: { value: 0.4, min: 0, max: 6, step: 0.05 },
          rimIntensity: { value: 1, min: 0, max: 6, step: 0.05 },
          fillColor: "#bcd6ff",
          rimColor: "#eef4ff",
        },
        { collapsed: true },
      ),
      "Contact shadow": folder(
        {
          shadowOpacity: { value: 0.3, min: 0, max: 1, step: 0.01 },
          shadowBlur: { value: 2.6, min: 0, max: 10, step: 0.1 },
          shadowScale: { value: 16, min: 1, max: 60, step: 0.5 },
          shadowY: { value: 970, min: 400, max: 1400, step: 5 },
          shadowColor: "#2e2658",
        },
        { collapsed: true },
      ),
    },
    { collapsed: true },
  );

  /* ---------------------------------------------------------------- motion */
  const motion = useControls(
    "Motion",
    {
      followLerp: { value: 0.09, min: 0.01, max: 1, step: 0.01 },
      rippleDuration: { value: 1.1, min: 0.2, max: 4, step: 0.05 },
      rippleRings: { value: 3, min: 1, max: 8, step: 1 },
      rippleDots: { value: 28, min: 6, max: 96, step: 1 },
      rippleSpread: { value: 2.4, min: 0.5, max: 10, step: 0.1 },
      rippleColorA: "#0544ff",
      rippleColorB: "#7c2669",
    },
    { collapsed: true },
  );

  /* --------------------------------------------------- presets + export */
  // Always-current snapshot for the export button (see the note on it below).
  const latest = useRef({ glass, env, backdrop, geom, scene, motion });
  latest.current = { glass, env, backdrop, geom, scene, motion };

  useControls("Presets", () => ({
    Glass: folder(
      Object.fromEntries(
        Object.entries(GLASS_PRESETS).map(([name, vals]) => [
          name,
          button(() => setGlass(vals as never)),
        ]),
      ),
    ),
    World: folder(
      Object.fromEntries(
        Object.entries(ENV_PRESETS).map(([name, vals]) => [
          name,
          button(() => setEnv(vals as never)),
        ]),
      ),
    ),
    // Reads through a ref, NOT the values captured in this closure. leva
    // memoises this schema function so it only runs on mount — a direct
    // reference to `glass`/`env`/... would freeze at the mount-time defaults
    // and this button would always emit those, silently discarding whatever
    // was actually tuned.
    "Copy all settings": button(() => {
      const text = JSON.stringify(latest.current, null, 2);
      navigator.clipboard?.writeText(text).catch(() => {});
      console.log("[hero settings]\n" + text);
    }),
  }));

  return { tuning, glass, env, backdrop, geom, scene, motion };
}
