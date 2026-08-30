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
  envIntensity: 3.2,
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

function makeEnvTexture() {
  const W = ENV_W;
  const H = ENV_H;
  const data = new Uint16Array(W * H * 4);
  const half = THREE.DataUtils.toHalfFloat;

  // Saturated, and deliberately DARK between the highlights. A smooth pale
  // gradient reflects as haze — the shell then reads as a grey ball no matter
  // how far envMapIntensity is pushed. Reflection contrast is what makes
  // glass look like glass, so the ramp needs somewhere dark to fall to.
  const stops: [number, [number, number, number]][] = [
    [0.0, [0.85, 0.93, 1.0]], // sky
    [0.22, [0.30, 0.14, 0.85]], // deep violet
    [0.48, [0.10, 0.30, 0.80]], // saturated blue
    [0.66, [0.55, 0.10, 0.60]], // magenta
    [0.84, [0.95, 0.55, 0.72]], // blush
    [1.0, [0.10, 0.10, 0.16]], // dark floor
  ];
  const ramp = (v: number): [number, number, number] => {
    for (let i = 1; i < stops.length; i++) {
      if (v <= stops[i][0]) {
        const [v0, c0] = stops[i - 1];
        const [v1, c1] = stops[i];
        const k = (v - v0) / (v1 - v0);
        return [
          c0[0] + (c1[0] - c0[0]) * k,
          c0[1] + (c1[1] - c0[1]) * k,
          c0[2] + (c1[2] - c0[2]) * k,
        ];
      }
    }
    return stops[stops.length - 1][1];
  };

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
      const [r, g, b] = ramp(v);
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

  const tex = new THREE.DataTexture(
    data,
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

function makeThicknessMap() {
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

  const t = new THREE.CanvasTexture(c);
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

function makeCoreTexture() {
  const S = 512;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const ctx = c.getContext("2d")!;
  // Off-centre, matching the render's light arriving from the upper left.
  const g = ctx.createRadialGradient(
    S * 0.44,
    S * 0.46,
    0,
    S * 0.5,
    S * 0.5,
    S * 0.5,
  );
  // Blue-dominant, like the render: magenta is a rim event, not the body.
  g.addColorStop(0.0, "rgba(146,182,250,0.94)"); // periwinkle centre
  g.addColorStop(0.45, "rgba(126,150,246,0.82)"); // blue
  g.addColorStop(0.74, "rgba(158,132,232,0.52)"); // violet
  g.addColorStop(0.9, "rgba(206,140,206,0.20)"); // magenta, only at the edge
  g.addColorStop(1.0, "rgba(206,140,206,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);

  // Second colour centre — the blush bloom the render carries at upper right.
  const g2 = ctx.createRadialGradient(
    S * 0.68,
    S * 0.3,
    0,
    S * 0.68,
    S * 0.3,
    S * 0.36,
  );
  g2.addColorStop(0.0, "rgba(255,176,214,0.42)");
  g2.addColorStop(1.0, "rgba(255,176,214,0)");
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = g2;
  ctx.fillRect(0, 0, S, S);
  ctx.globalCompositeOperation = "source-over";
  const t = new THREE.CanvasTexture(c);
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
}: {
  className?: string;
  style?: React.CSSProperties;
  satellite?: boolean;
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
        <Core />
        <Ino />
        <Shell />
        {satellite && <Satellite />}
      </Canvas>
    </div>
  );
}
