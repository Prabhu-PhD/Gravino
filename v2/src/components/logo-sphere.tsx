"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/* ===========================================================================
 * The Gravino mark, as a live object.
 * ---------------------------------------------------------------------------
 * The logo is a soap bubble with "ino" inside it and a small black satellite
 * caught in its orbit. This builds that in three.js.
 *
 * WHY THIS ONE IS TRACTABLE, WHERE v1's HERO WAS NOT
 *
 * v1 spent four rebuilds trying to match path-traced, FROSTED, subsurface
 * glass across a multi-object composition. Real-time WebGL genuinely cannot
 * do that — a ceiling, not a tuning problem. A soap bubble is the opposite
 * case: its colour is THIN-FILM INTERFERENCE, which MeshPhysicalMaterial
 * models directly; it is a thin shell, so it barely distorts what is behind
 * it (which is why the "ino" in the brand art reads undistorted); and it is
 * ONE transmissive object, so there is no object-through-object refraction.
 *
 * THE THREE-LAYER STACK, AND WHY
 *
 * A physically-honest bubble is nearly colourless head-on: at IOR 1.33 the
 * Fresnel reflectance is about 2%, so iridescence only really shows at the
 * grazing rim. The brand render is not physically honest — it has a glowing
 * blue-lilac BODY as well as an iridescent rim. So the mark is built as:
 *
 *   1. core   — a billboarded gradient disc. The body colour, and the thing
 *               that makes white "ino" legible at all.
 *   2. ino    — white text between core and shell, so it reads through the
 *               film rather than being pasted on top of the canvas.
 *   3. shell  — the transmissive, iridescent sphere. Rim colour, highlights.
 *
 * The environment is procedural (a generated equirect gradient, not an HDR
 * file or drei Lightformers): no network fetch, no multi-MB asset, and — the
 * reason it matters here — Lightformers reflect as visibly HARD RECTANGLES on
 * a mirror-smooth sphere, which reads as CGI immediately.
 * ======================================================================== */

/* Deliberately NOT physically honest. A real soap film is IOR 1.33, which
   gives ~2% reflectance head-on — the shell then has almost no presence and
   the mark reads as a blurry gradient blob. The brand render is a stylised
   bubble: a glass-weight rim with soap-film colour. So the IOR is pushed to
   glass and the environment is over-driven, while thickness stays near zero
   to keep the refraction (and therefore the "ino") clean. */
const FILM = {
  /* Volume thickness stays LOW, and volume tint is therefore off the table.
     Raising it to 0.28 to pick up attenuationColor lengthened the refraction
     ray enough to smear the core into a visible funnel under the "ino" —
     the exact distortion a thin shell was chosen to avoid. Body colour comes
     from the painted core instead, which is what the brand render does too. */
  thickness: 0.08,
  roughness: 0.008,
  ior: 1.46,
  iridescenceIOR: 1.4,
  /** Film thickness in nm. This is the hue selector: ~180-680 sits in the
      washed first-order silvers, 280-900 reaches the saturated second-order
      blues and magentas the brand render actually shows. */
  iridescenceRange: [280, 900] as [number, number],
  envIntensity: 3.6,
};

/* ---------------------------------------------------------------------------
 * Environment — a procedural equirectangular gradient with HDR highlights.
 * For an iridescent shell the environment IS the colour of the object, so
 * this is the most consequential piece of tuning in the file.
 * ------------------------------------------------------------------------ */

/* RESOLUTION IS THE SPECULAR SHARPNESS CEILING.
   three's PMREMGenerator sizes its cubemap from the source: for an
   equirectangular texture it calls `_setSize(texture.image.width / 4)`. At
   W=512 that is 128px cube faces, so every reflection is pre-blurred before
   the material ever samples it — no amount of roughness or envMapIntensity
   tuning can recover detail that was thrown away at generation time.
   W=2048 gives 512px faces: 4x the linear detail, which is where crisp
   specular streaks come from.
   Stored as half floats — still HDR (values run to ~30 here, far under the
   65504 ceiling) at half the memory of Float32 for an 8M-element buffer. */
const ENV_W = 2048;
const ENV_H = 1024;

/* The pixel data is cached at module scope, the Texture is not.
   Generating this is ~8M half-float writes; doing it per <LogoSphere> made a
   page with several marks stall for seconds before first paint. The DATA is
   identical for every instance, but a Texture is bound to the renderer that
   uploaded it — each <Canvas> has its own WebGL context — so each instance
   still gets its own cheap DataTexture wrapper around the shared buffer. */
let envData: Uint16Array | null = null;

function makeEnvData() {
  if (envData) return envData;
  const W = ENV_W;
  const H = ENV_H;
  const data = new Uint16Array(W * H * 4);
  const half = THREE.DataUtils.toHalfFloat;

  /* COLOUR RANGE IS AN AZIMUTHAL PROBLEM, NOT A VERTICAL ONE.
     A mirror sphere maps its environment radially: the centre reflects what
     is behind the viewer, and the silhouette compresses the ENTIRE horizon
     into a thin ring. So hue variation in v (up/down) mostly averages out
     across the visible face, while hue variation in u (around the horizon)
     lands as distinct bands at the rim — which is exactly where a real
     bubble's rainbow lives.
     The previous ramp varied only in v, which is why the body read as one
     smooth blue-violet field however saturated the stops were. */

  /** Generic wrapping-aware stop interpolator. */
  const lerpStops = (
    t: number,
    stops: [number, [number, number, number]][],
  ): [number, number, number] => {
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
  };

  /* The hue wheel, wrapped around the horizon. A full spectral circuit —
     this is what the rim samples, so it is what produces banding. Ends match
     so the u=0/u=1 seam is invisible. */
  const azimuth: [number, [number, number, number]][] = [
    [0.0, [0.25, 0.9, 1.0]], // cyan
    [0.15, [0.28, 0.55, 1.0]], // sky blue
    [0.31, [0.45, 0.24, 1.0]], // violet
    [0.46, [0.92, 0.2, 0.86]], // magenta
    [0.61, [1.0, 0.55, 0.76]], // blush
    [0.75, [1.0, 0.82, 0.48]], // warm gold
    [0.88, [0.55, 0.97, 0.86]], // mint
    [1.0, [0.25, 0.9, 1.0]], // back to cyan
  ];

  /* Vertical ramp now carries BRIGHTNESS structure rather than hue: bright
     sky, mid band, dark floor. Contrast is still what makes glass read as
     glass, so the floor stays genuinely dark. */
  const vertical: [number, [number, number, number]][] = [
    [0.0, [1.0, 1.05, 1.15]], // bright sky
    [0.3, [0.62, 0.66, 0.8]],
    [0.55, [0.5, 0.52, 0.62]],
    [0.8, [0.24, 0.22, 0.3]],
    [1.0, [0.08, 0.08, 0.13]], // dark floor
  ];

  /* How much the azimuthal hue asserts itself. Peaks at the horizon, where
     the rim ring samples from, and falls off toward the poles so the top and
     bottom stay as clean light/shadow rather than muddying into colour. */
  const horizonWeight = (v: number) => 0.42 + 0.58 * Math.sin(Math.PI * v) ** 1.3;

  /* Softbox windows, not gaussian blobs. A studio glass render gets its
     character from a few DISTINCT bright shapes; round blobs of the same
     energy just smear into overall brightness.
     u, v, half-width, half-height, intensity, edge softness.
     Edge softness is the other half of specular sharpness. The previous 0.06
     (≈30px at W=512) made every window a gradient, so the shell showed broad
     glows instead of streaks with a defined shape. These are tight — a real
     softbox has a hard border — plus two small hard "pin" glints, which are
     what produce the bright pinpoint sparkle on a mirror-smooth sphere. */
  const windows: [number, number, number, number, number, number][] = [
    [0.3, 0.14, 0.2, 0.05, 26, 0.012], // main overhead strip
    [0.74, 0.3, 0.045, 0.16, 18, 0.012], // tall side softbox
    [0.06, 0.44, 0.03, 0.2, 13, 0.014], // rim light, far side
    [0.52, 0.72, 0.16, 0.045, 6, 0.02], // low bounce
    [0.42, 0.22, 0.012, 0.012, 60, 0.004], // pin glint
    [0.66, 0.52, 0.009, 0.009, 40, 0.004], // pin glint
  ];
  /** 1 inside the box, easing to 0 across `soft` beyond its edge. */
  const box = (d: number, half: number, soft: number) => {
    const t = (d - half) / soft;
    if (t <= 0) return 1;
    if (t >= 1) return 0;
    return 1 - t * t * (3 - 2 * t); // smoothstep
  };

  for (let y = 0; y < H; y++) {
    const v = y / (H - 1);
    for (let x = 0; x < W; x++) {
      const u = x / (W - 1);
      // Hue from azimuth, brightness from elevation, mixed by how close this
      // row is to the horizon.
      const [ar, ag, ab] = lerpStops(u, azimuth);
      const [vr, vg, vb] = lerpStops(v, vertical);
      const w = horizonWeight(v);
      const r = vr * (1 - w) + ar * vr * w * 1.75;
      const g = vg * (1 - w) + ag * vg * w * 1.75;
      const b = vb * (1 - w) + ab * vb * w * 1.75;
      let boost = 0;
      for (const [lu, lv, hw, hh, li, soft] of windows) {
        let du = Math.abs(u - lu);
        du = Math.min(du, 1 - du); // wrap, so the seam is continuous
        const dv = Math.abs(v - lv);
        boost += li * box(du, hw, soft) * box(dv, hh, soft);
      }
      const i = (y * W + x) * 4;
      data[i] = half(r + boost);
      data[i + 1] = half(g + boost * 0.98);
      data[i + 2] = half(b + boost * 0.94);
      data[i + 3] = half(1);
    }
  }

  envData = data;
  return data;
}

function makeEnvTexture() {
  const tex = new THREE.DataTexture(
    makeEnvData(),
    ENV_W,
    ENV_H,
    THREE.RGBAFormat,
    THREE.HalfFloatType,
  );
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.LinearSRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

function BrandEnv() {
  const scene = useThree((s) => s.scene);
  const tex = useMemo(makeEnvTexture, []);
  useEffect(() => {
    scene.environment = tex;
    return () => {
      scene.environment = null;
      tex.dispose();
    };
  }, [scene, tex]);
  return null;
}

/* ---------------------------------------------------------------------------
 * Film-thickness map — the reason rotation is visible at all.
 * A uniform sphere is rotation-invariant: iridescence depends only on the
 * angle between view and normal, so spinning a perfectly even film changes
 * nothing on screen. Real bubbles swirl because the film is unevenly thick.
 * ------------------------------------------------------------------------ */

let thicknessCanvas: HTMLCanvasElement | null = null;

function makeThicknessCanvas() {
  if (thicknessCanvas) return thicknessCanvas;
  const N = 96;
  const small = document.createElement("canvas");
  small.width = small.height = N;
  const sctx = small.getContext("2d")!;
  const img = sctx.createImageData(N, N);
  for (let i = 0; i < N * N; i++) {
    const v = Math.floor(Math.random() * 255);
    img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  sctx.putImageData(img, 0, 0);

  const S = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(small, 0, 0, S, S); // broad bands
  ctx.globalAlpha = 0.5;
  ctx.drawImage(small, -S * 0.3, S * 0.2, S * 1.7, S * 1.7); // mid swirl
  ctx.globalAlpha = 0.3;
  ctx.drawImage(small, S * 0.15, -S * 0.1, S * 0.7, S * 0.7); // fine detail
  ctx.globalAlpha = 1;

  thicknessCanvas = c;
  return c;
}

function makeThicknessMap() {
  const t = new THREE.CanvasTexture(makeThicknessCanvas());
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ---------------------------------------------------------------------------
 * Layer 1 — the glowing core.
 * A billboarded disc rather than an inner sphere: this is only ever viewed
 * from the front (cursor parallax is a fraction of a unit), and a radial
 * gradient on a disc gives exactly the soft interior bloom the brand render
 * has, without the UV awkwardness of gradient-mapping a sphere.
 * ------------------------------------------------------------------------ */

let coreCanvas: HTMLCanvasElement | null = null;

function makeCoreCanvas() {
  if (coreCanvas) return coreCanvas;
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;

  /* Painted, not derived — and this is where essentially ALL the mark's
     colour lives. Verified by rendering the shell with the core off: it comes
     out nearly colourless. At 94% transmission the visible face IS whatever
     is behind the film, so the environment only ever reaches the thin rim.
     The brand render works the same way; it is a painted interior with an
     iridescent edge, not a physical simulation.
     Four colour centres rather than one radial, because a single gradient
     can only ever produce one hue axis and the render clearly has several. */
  const radial = (
    x: number,
    y: number,
    r: number,
    stops: [number, string][],
  ) => {
    const g = ctx.createRadialGradient(S * x, S * y, 0, S * x, S * y, S * r);
    for (const [t, col] of stops) g.addColorStop(t, col);
    return g;
  };

  // Body: periwinkle centre falling through blue and violet to a magenta rim.
  ctx.fillStyle = radial(0.5, 0.5, 0.5, [
    [0.0, "rgba(150,188,252,0.95)"],
    [0.42, "rgba(124,146,244,0.86)"],
    [0.72, "rgba(150,124,228,0.60)"],
    [0.9, "rgba(202,134,206,0.26)"],
    [1.0, "rgba(202,134,206,0)"],
  ]);
  ctx.fillRect(0, 0, S, S);

  ctx.globalCompositeOperation = "lighter";
  // Blush bloom, upper right.
  ctx.fillStyle = radial(0.7, 0.28, 0.34, [
    [0.0, "rgba(255,168,208,0.46)"],
    [1.0, "rgba(255,168,208,0)"],
  ]);
  ctx.fillRect(0, 0, S, S);
  // Cyan-white crescent, lower left — the render's brightest interior note.
  ctx.fillStyle = radial(0.31, 0.74, 0.3, [
    [0.0, "rgba(198,248,255,0.5)"],
    [1.0, "rgba(198,248,255,0)"],
  ]);
  ctx.fillRect(0, 0, S, S);
  // Cool violet pool, upper left, to keep the top half from going flat.
  ctx.fillStyle = radial(0.26, 0.3, 0.28, [
    [0.0, "rgba(140,110,246,0.3)"],
    [1.0, "rgba(140,110,246,0)"],
  ]);
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = "source-over";

  coreCanvas = c;
  return c;
}

function makeCoreTexture() {
  const t = new THREE.CanvasTexture(makeCoreCanvas());
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Core() {
  const tex = useMemo(makeCoreTexture, []);
  return (
    <mesh position={[0, 0, -0.05]}>
      <circleGeometry args={[0.80, 96]} />
      <meshBasicMaterial
        map={tex}
        transparent
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
 * Layer 2 — "ino", between the core and the shell.
 * Waits on document.fonts so the texture is never rasterised in a fallback
 * face, and reads the resolved display family off the DOM so it always
 * matches the wordmark set beside it in HTML.
 * ------------------------------------------------------------------------ */

function Ino() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const S = 1024;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const ctx = c.getContext("2d")!;
      // Must be a RESOLVED family list. Reading the custom property directly
      // returns the literal "var(--font-instrument), ..." token, which is an
      // invalid ctx.font value — canvas then silently keeps 10px sans-serif
      // and the glyphs come out invisibly small. So bounce it through a real
      // element and read the computed value.
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:absolute;visibility:hidden;font-family:var(--font-display)";
      document.body.appendChild(probe);
      const family = getComputedStyle(probe).fontFamily || "sans-serif";
      probe.remove();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `500 ${Math.round(S * 0.46)}px ${family}`;
      ctx.fillText("ino", S / 2, S * 0.52);
      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 8;
      t.colorSpace = THREE.SRGBColorSpace;
      setTex(t);
    };
    document.fonts.ready.then(draw).catch(draw);
    return () => {
      cancelled = true;
    };
  }, []);

  if (!tex) return null;
  return (
    <mesh position={[0, 0, 0.08]}>
      <planeGeometry args={[1.55, 1.55]} />
      <meshBasicMaterial
        map={tex}
        transparent
        toneMapped={false}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ---------------------------------------------------------------------------
 * Layer 3 — the shell.
 * ------------------------------------------------------------------------ */

function Shell() {
  const ref = useRef<THREE.Mesh>(null);
  const thicknessMap = useMemo(makeThicknessMap, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    // Rotating the shell drags the uneven film across the surface, so the
    // thin-film colours travel. Slow — a bubble drifts, it does not spin.
    ref.current.rotation.y = t * 0.22;
    ref.current.rotation.x = Math.sin(t * 0.24) * 0.16;
    ref.current.rotation.z = Math.sin(t * 0.17) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshPhysicalMaterial
        transmission={0.94}
        thickness={FILM.thickness}
        roughness={FILM.roughness}
        ior={FILM.ior}
        iridescence={1}
        iridescenceIOR={FILM.iridescenceIOR}
        iridescenceThicknessRange={FILM.iridescenceRange}
        iridescenceThicknessMap={thicknessMap}
        clearcoat={1}
        clearcoatRoughness={0.008}
        envMapIntensity={FILM.envIntensity}
        specularIntensity={1}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/**
 * The black satellite. In the static mark it sits at one o'clock; here it
 * actually orbits — the one animation the logo is already asking for, and the
 * reason the company is called Gravino.
 */
function Satellite({ radius = 1.3 }: { radius?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.4;
    if (!ref.current) return;
    // Tilted orbit, so it passes behind the bubble and back in front.
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t) * radius * 0.4 + 0.28,
      Math.sin(t) * radius * 0.75,
    );
  });
  return (
    // Flat, unlit black — in the mark this is a solid dot, not a rendered
    // ball. A lit material picks up the environment and reads as a second
    // glass sphere, which fights the bubble instead of anchoring it.
    <mesh ref={ref}>
      <sphereGeometry args={[0.14, 48, 48]} />
      <meshBasicMaterial color="#0a0812" toneMapped={false} />
    </mesh>
  );
}

/** Whole-rig float and cursor parallax — subtle, so it reads as presence. */
function Rig({ strength = 0.2 }: { strength?: number }) {
  const { camera, pointer } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x += (pointer.x * strength - camera.position.x) * 0.04;
    camera.position.y +=
      (pointer.y * strength + Math.sin(t * 0.5) * 0.05 - camera.position.y) *
      0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function LogoSphere({
  className = "",
  style,
  satellite = true,
  core = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  satellite?: boolean;
  /** Off isolates the shell — useful for judging how much colour the
   *  environment alone is contributing. */
  core?: boolean;
}) {
  /* Fixed 2x rather than following devicePixelRatio. A mirror-smooth sphere
     aliases badly: at dpr 1-1.25 the specular streaks land on too few pixels
     and read as soft even when the reflection itself is sharp. Supersampling
     is the cheapest remaining sharpness lever, and this is one small sphere —
     a 420px mark costs 840x840 of fill, which is nothing. */
  const dpr = 2;
  return (
    <div className={className} style={style}>
      <Canvas
        dpr={dpr}
        camera={{ fov: 32, position: [0, 0, 6] }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{ background: "transparent" }}
      >
        <BrandEnv />
        <Rig />
        {core && <Core />}
        <Ino />
        <Shell />
        {satellite && <Satellite />}
      </Canvas>
    </div>
  );
}
