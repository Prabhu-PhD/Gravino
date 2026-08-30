"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { makeEnvTexture } from "@/lib/glass-env";

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

function BrandEnv() {
  const scene = useThree((s) => s.scene);
  const tex = useMemo(() => makeEnvTexture("mark"), []);
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

/** How wide "ino" should sit, in world units, against a sphere of radius 1.
 *  Measured off the brand lockup: the glyphs fill roughly three quarters of
 *  the bubble. Set as a WIDTH rather than a font size so the result does not
 *  drift when the resolved face changes its metrics. */
const INO_WIDTH = 1.28;
/** Radius the lettering is wrapped onto — just inside the shell. */
const INO_DOME_R = 0.95;

/**
 * "ino", curved onto the inside of the bubble.
 *
 * Genuinely dimensional rather than a flat decal, and without needing
 * TextGeometry — which would mean shipping a converted typeface.json blob
 * for a face next/font only gives us as woff2. Instead the quad is a
 * subdivided plane whose vertices are pushed out onto a sphere, so the
 * lettering physically curves with the glass, catches the light across that
 * curve, and swings correctly under the rig's parallax. Planar UVs survive
 * the displacement, so the texture still maps cleanly — which a spherical
 * cap's own UVs would not have done.
 *
 * The material is LIT, not basic: shading across the dome is what reads as
 * depth. A little emissive keeps it legible where the curve turns away.
 */
function Ino() {
  const [tex, setTex] = useState<THREE.CanvasTexture | null>(null);
  const [side, setSide] = useState(2);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const S = 1024;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const ctx = c.getContext("2d")!;
      // Must be a RESOLVED family list. Reading the custom property directly
      // returns the literal "var(--font-dm), ..." token, which is an invalid
      // ctx.font value — canvas then silently keeps 10px sans-serif and the
      // glyphs come out invisibly small. So bounce it through a real element
      // and read the computed value.
      const probe = document.createElement("span");
      probe.style.cssText =
        "position:absolute;visibility:hidden;font-family:var(--font-display)";
      document.body.appendChild(probe);
      const family = getComputedStyle(probe).fontFamily || "sans-serif";
      probe.remove();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `500 ${Math.round(S * 0.5)}px ${family}`;
      // Measure, then size the QUAD to suit — rather than guessing a font
      // size and hoping the glyphs land at the right scale.
      const w = ctx.measureText("ino").width || S * 0.62;
      ctx.fillText("ino", S / 2, S * 0.52);

      const t = new THREE.CanvasTexture(c);
      t.anisotropy = 8;
      t.colorSpace = THREE.SRGBColorSpace;
      setSide((INO_WIDTH * S) / w);
      setTex(t);
    };
    document.fonts.ready.then(draw).catch(draw);
    return () => {
      cancelled = true;
    };
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(side, side, 40, 40);
    const pos = g.attributes.position;
    const R = INO_DOME_R;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      // Push each vertex onto the sphere. Clamped, so corners outside the
      // radius flatten instead of producing NaN.
      const z = Math.sqrt(Math.max(0, R * R - x * x - y * y));
      pos.setZ(i, z - R);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, [side]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  if (!tex) return null;
  return (
    <mesh geometry={geometry} position={[0, 0, INO_DOME_R - 0.28]}>
      <meshStandardMaterial
        map={tex}
        transparent
        depthWrite={false}
        roughness={0.42}
        metalness={0}
        envMapIntensity={1.1}
        emissive="#ffffff"
        emissiveMap={tex}
        emissiveIntensity={0.35}
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
    /* A polished black bead, not a flat disc and not a second glass ball.
       An earlier version was unlit precisely because a standard material
       picked up the full environment and read as chrome, competing with the
       bubble. The fix is not flatness, it is CONTROLLING how much
       environment it takes: envMapIntensity well under 1 keeps the body
       genuinely black, while clearcoat adds a single tight specular
       highlight. That highlight is the whole 3D cue — it is what tells the
       eye this is a sphere lit from the upper left rather than a hole
       punched in the page.

       Depth does the rest for free: the orbit carries the bead behind the
       shell, where transmission samples it from the backbuffer and refracts
       it, and back in front, where it occludes the shell normally. */
    <mesh ref={ref}>
      <sphereGeometry args={[0.14, 64, 64]} />
      <meshPhysicalMaterial
        color="#050409"
        /* SMOOTH, not rough. This is the counter-intuitive one: a rough
           black sphere diffusely reflects the entire bright environment and
           averages out to grey, which is why 0.45 read as chrome. A smooth
           one reflects a small tight spot and stays black everywhere else —
           a polished bead rather than a lit ball. */
        roughness={0.14}
        metalness={0}
        /* Clearcoat is deliberately partial. At 1 the coat reflects the
           environment right around the silhouette and the bead reads as
           chrome — a second shiny ball competing with the bubble. Around
           0.55, with the environment held well down, the reflection
           collapses to one tight highlight on a body that stays black.
           Sheen was tried here and removed: it lifts the whole surface
           toward grey, which is the same failure by another route. */
        clearcoat={0.4}
        clearcoatRoughness={0.05}
        envMapIntensity={0.14}
      />
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
