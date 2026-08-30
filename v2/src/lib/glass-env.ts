import * as THREE from "three";

/* ===========================================================================
 * Procedural environment maps for the glass scenes.
 * ---------------------------------------------------------------------------
 * For a transmissive, reflective object the environment IS the colour of the
 * object, so this is the most consequential tuning in either scene. Generated
 * rather than loaded: no network fetch, no multi-MB HDR, and full control of
 * the hue sweep.
 *
 * THREE THINGS THIS FILE ENCODES, ALL LEARNED THE HARD WAY:
 *
 * 1. RESOLUTION IS THE SPECULAR SHARPNESS CEILING. three's PMREMGenerator
 *    sizes its cubemap from the source — for an equirectangular texture it
 *    calls `_setSize(texture.image.width / 4)`. At 512 wide that is 128px
 *    cube faces, and every reflection arrives pre-blurred no matter what
 *    roughness or envMapIntensity say. 2048 gives 512px faces.
 *
 * 2. COLOUR RANGE IS AZIMUTHAL, NOT VERTICAL. A mirror sphere maps its
 *    environment radially: the silhouette compresses the whole horizon into
 *    a ring. Hue variation in v averages out across the visible face; hue
 *    variation in u lands as bands at the rim.
 *
 * 3. CONTRAST, NOT SMOOTHNESS. A smooth pale gradient reflects as haze. The
 *    ramp needs somewhere dark to fall to, and the highlights need to be
 *    soft-edged WINDOWS rather than round blobs — round blobs of the same
 *    energy smear into overall brightness instead of becoming streaks.
 * ======================================================================== */

const W = 2048;
const H = 1024;

type Stops = [number, [number, number, number]][];
/** u, v, half-width, half-height, intensity, edge softness. */
type Window_ = [number, number, number, number, number, number];

type Preset = {
  /** Brightness structure, top to bottom. */
  vertical: Stops;
  /** Hue wheel around the horizon; ends must match so the seam is invisible. */
  azimuth: Stops;
  /** How strongly azimuthal hue asserts itself at a given elevation. */
  horizonWeight: (v: number) => number;
  /** Multiplier on the azimuthal tint. */
  chroma: number;
  windows: Window_[];
};

const PRESETS: Record<"mark" | "studio", Preset> = {
  /* The logo bubble: saturated, with a dark floor for reflection contrast. */
  mark: {
    vertical: [
      [0.0, [1.0, 1.05, 1.15]],
      [0.3, [0.62, 0.66, 0.8]],
      [0.55, [0.5, 0.52, 0.62]],
      [0.8, [0.24, 0.22, 0.3]],
      [1.0, [0.08, 0.08, 0.13]],
    ],
    azimuth: [
      [0.0, [0.25, 0.9, 1.0]],
      [0.15, [0.28, 0.55, 1.0]],
      [0.31, [0.45, 0.24, 1.0]],
      [0.46, [0.92, 0.2, 0.86]],
      [0.61, [1.0, 0.55, 0.76]],
      [0.75, [1.0, 0.82, 0.48]],
      [0.88, [0.55, 0.97, 0.86]],
      [1.0, [0.25, 0.9, 1.0]],
    ],
    horizonWeight: (v) => 0.42 + 0.58 * Math.sin(Math.PI * v) ** 1.3,
    chroma: 1.75,
    windows: [
      [0.3, 0.14, 0.2, 0.05, 26, 0.012],
      [0.74, 0.3, 0.045, 0.16, 18, 0.012],
      [0.06, 0.44, 0.03, 0.2, 13, 0.014],
      [0.52, 0.72, 0.16, 0.045, 6, 0.02],
      [0.42, 0.22, 0.012, 0.012, 60, 0.004],
      [0.66, 0.52, 0.009, 0.009, 40, 0.004],
    ],
  },

  /* The ribbon: a pale studio. The subject sits on a near-white ground, so
     the environment is bright overall — but it still needs a dark floor and
     hard-edged softboxes, or the tube reads as a grey noodle. The azimuthal
     hues stay pastel and are there mainly to FEED THE DISPERSION: the
     rainbow fringing along the tube's edges is refracted environment, so if
     the environment has no colour, the fringes have none either. */
  studio: {
    vertical: [
      [0.0, [1.25, 1.3, 1.4]],
      [0.24, [0.9, 0.95, 1.1]],
      [0.5, [0.7, 0.76, 0.95]],
      [0.72, [0.45, 0.46, 0.6]],
      [1.0, [0.1, 0.1, 0.15]],
    ],
    azimuth: [
      [0.0, [0.5, 0.95, 1.0]],
      [0.18, [0.45, 0.66, 1.0]],
      [0.36, [0.62, 0.5, 1.0]],
      [0.54, [1.0, 0.55, 0.9]],
      [0.72, [1.0, 0.75, 0.8]],
      [0.86, [0.75, 1.0, 0.9]],
      [1.0, [0.5, 0.95, 1.0]],
    ],
    horizonWeight: (v) => 0.3 + 0.7 * Math.sin(Math.PI * v) ** 1.2,
    chroma: 1.45,
    windows: [
      [0.26, 0.1, 0.24, 0.07, 30, 0.01], // key, overhead
      [0.68, 0.26, 0.06, 0.22, 20, 0.01], // tall fill
      [0.94, 0.4, 0.04, 0.24, 16, 0.012], // rim, opposite side
      [0.45, 0.66, 0.22, 0.05, 8, 0.018], // bounce
      [0.36, 0.2, 0.012, 0.012, 70, 0.004], // glint
    ],
  },
};

function lerpStops(t: number, stops: Stops): [number, number, number] {
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      const k = (t - t0) / (t1 - t0);
      return [
        c0[0] + (c1[0] - c0[0]) * k,
        c0[1] + (c1[1] - c0[1]) * k,
        c0[2] + (c1[2] - c0[2]) * k,
      ];
    }
  }
  return stops[stops.length - 1][1];
}

/** 1 inside the box, easing to 0 across `soft` beyond its edge. */
function box(d: number, half: number, soft: number) {
  const t = (d - half) / soft;
  if (t <= 0) return 1;
  if (t >= 1) return 0;
  return 1 - t * t * (3 - 2 * t);
}

/* The pixel data is cached per preset; the Texture is not. Generating one is
   ~8M half-float writes, and doing it per component instance made a page with
   several glass scenes stall for seconds before first paint. A Texture belongs
   to the renderer that uploaded it and each <Canvas> has its own context, so
   every instance still gets a cheap wrapper around the shared buffer. */
const cache = new Map<string, Uint16Array>();

function makeEnvData(name: keyof typeof PRESETS) {
  const hit = cache.get(name);
  if (hit) return hit;

  const p = PRESETS[name];
  const data = new Uint16Array(W * H * 4);
  const half = THREE.DataUtils.toHalfFloat;

  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    const [vr, vg, vb] = lerpStops(v, p.vertical);
    const w = p.horizonWeight(v);
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      const [ar, ag, ab] = lerpStops(u, p.azimuth);

      let boost = 0;
      for (const [lu, lv, hw, hh, li, soft] of p.windows) {
        let du = Math.abs(u - lu);
        du = Math.min(du, 1 - du); // wrap, so the seam is continuous
        boost += li * box(du, hw, soft) * box(Math.abs(v - lv), hh, soft);
      }

      const i = (y * W + x) * 4;
      data[i] = half(vr * (1 - w) + ar * vr * w * p.chroma + boost);
      data[i + 1] = half(vg * (1 - w) + ag * vg * w * p.chroma + boost * 0.98);
      data[i + 2] = half(vb * (1 - w) + ab * vb * w * p.chroma + boost * 0.94);
      data[i + 3] = half(1);
    }
  }

  cache.set(name, data);
  return data;
}

export function makeEnvTexture(preset: keyof typeof PRESETS = "mark") {
  const tex = new THREE.DataTexture(
    makeEnvData(preset),
    W,
    H,
    THREE.RGBAFormat,
    THREE.HalfFloatType,
  );
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.LinearSRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
