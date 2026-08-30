"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { makeEnvTexture } from "@/lib/glass-env";

/* ===========================================================================
 * The ribbon-and-sphere composition, live.
 * ---------------------------------------------------------------------------
 * The brand render: a bent glass tube with an iridescent sphere resting in
 * its crook, on a pale ground.
 *
 * WHERE THIS SITS BETWEEN THE OTHER TWO ATTEMPTS
 *
 * Harder than the logo bubble, because this is a MULTI-OBJECT transmissive
 * composition. three renders transmission from a single backbuffer that
 * excludes every transmissive object, so the tube does not refract itself
 * where it crosses, and the sphere and tube do not refract each other. That
 * limitation is exactly what defeated v1's balance-beam hero.
 *
 * Easier than v1, though, and the reason it is worth doing:
 *   - This glass is CLEAR WITH DISPERSION, not frosted milky subsurface.
 *     Subsurface is genuinely outside real-time WebGL; dispersion has been a
 *     first-class MeshPhysicalMaterial parameter since r167, and the rainbow
 *     fringing along the tube's edges is the signature of the reference.
 *   - The ground is a smooth pale gradient, so there is nothing detailed
 *     behind the glass that the missing self-refraction would have revealed.
 *
 * Everything the environment does is in lib/glass-env.ts, including why the
 * environment needs saturation at all: the dispersion fringes are refracted
 * environment, so a colourless environment produces colourless fringes.
 * ======================================================================== */

/* Control points for the ribbon, traced off the brand render.
 *
 * PAIRS OF POINTS ALONG EACH STRAIGHT RUN, not one point per corner. A
 * Catmull-Rom through corner points alone produces a soft squiggle; the
 * reference is straight runs joined by tight radii, so each run needs two
 * points to hold its direction and the tension stays low to keep the corners
 * from rounding away.
 *
 * Z varies so the lower half advances toward the viewer, which is what gives
 * the form depth instead of reading as a flat drawing. */
const PATH: [number, number, number][] = [
  [-2.25, 2.55, -0.55],
  [-1.25, 2.42, -0.4], // top run, heading right
  [-0.45, 2.2, -0.2],
  [-0.12, 1.85, -0.05], // first corner
  [-0.3, 1.4, 0.05],
  [-1.0, 0.72, 0.08], // long diagonal, down-left
  [-1.72, 0.02, 0.1],
  [-2.0, -0.62, 0.12], // second corner
  [-1.68, -1.12, 0.22],
  [-0.85, -1.36, 0.32], // bottom run, heading right
  [0.05, -1.46, 0.42],
  [0.92, -1.68, 0.58],
  [1.42, -2.35, 0.78], // exit, down-right
];

/* Tube gauge. At 0.2 the tube read as wire: the reference's tube is roughly
   an eighth of the frame height, and the frame is ~6.6 units tall. */
const TUBE_RADIUS = 0.42;

const GLASS = {
  /* Just under 1, so the surface keeps some presence of its own. At exactly
     1 the tube is a pure window and every pixel of it is the pale backdrop. */
  transmission: 0.93,
  /* Thick enough that the refracted backdrop visibly bends inside the tube.
     At 0.55 the glass was optically thin and the tube read as a faint
     outline rather than a solid object. */
  thickness: 1.35,
  roughness: 0.012,
  ior: 1.52,
  /** The signature of the reference: rainbow fringing along every edge.
   *  Needs transmission > 0 to do anything at all. */
  dispersion: 4.2,
  envMapIntensity: 2.2,
  /* Volume absorption. Unavailable on the logo bubble — that shell has to
     stay thin to keep the "ino" undistorted — but this tube is thick, so
     light crossing it picks up real tint and the thick parts go genuinely
     dark. Measured against the render, this is what closed the tonal gap:
     the reference has darks down to ~140/255 and without absorption the
     live version bottomed out around 197. */
  attenuationColor: "#bcd2ef",
  attenuationDistance: 2.3,
};

function Ribbon() {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      PATH.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
      false,
      "catmullrom",
      0.2, // low tension: tight corners, straight runs between them
    );
    return new THREE.TubeGeometry(curve, 600, TUBE_RADIUS, 48, false);
  }, []);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <mesh geometry={geometry}>
      <meshPhysicalMaterial
        transmission={GLASS.transmission}
        thickness={GLASS.thickness}
        roughness={GLASS.roughness}
        ior={GLASS.ior}
        dispersion={GLASS.dispersion}
        attenuationColor={GLASS.attenuationColor}
        attenuationDistance={GLASS.attenuationDistance}
        clearcoat={1}
        clearcoatRoughness={0.01}
        envMapIntensity={GLASS.envMapIntensity}
        transparent
      />
    </mesh>
  );
}

/** The sphere in the crook. Iridescent shell over a soft coloured core —
 *  the same two-layer approach the logo mark uses, and for the same reason:
 *  a physically honest bubble is nearly colourless head-on. */
function Sphere() {
  const core = useMemo(() => {
    const S = 256;
    const c = document.createElement("canvas");
    c.width = c.height = S;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(
      S * 0.4,
      S * 0.36,
      0,
      S * 0.5,
      S * 0.5,
      S * 0.5,
    );
    /* Deeper than the mark's core. Measured against the render, the sphere
       is where the reference keeps its darkest values (~140/255); a pale
       core left the whole frame sitting above 196 and reading washed. */
    g.addColorStop(0.0, "rgba(150,190,250,0.98)");
    g.addColorStop(0.4, "rgba(96,110,232,0.92)");
    g.addColorStop(0.72, "rgba(140,86,206,0.72)");
    g.addColorStop(0.92, "rgba(196,120,196,0.3)");
    g.addColorStop(1.0, "rgba(216,150,206,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, S, S);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <group position={[0.18, -0.42, 0.5]}>
      {/* Core: a billboarded disc, as on the mark. Only ever seen head-on. */}
      <mesh position={[0, 0, -0.02]}>
        <circleGeometry args={[0.55, 64]} />
        <meshBasicMaterial
          map={core}
          transparent
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.62, 80, 80]} />
        <meshPhysicalMaterial
          transmission={0.94}
          thickness={0.08}
          roughness={0.01}
          ior={1.46}
          iridescence={1}
          iridescenceIOR={1.4}
          iridescenceThicknessRange={[280, 900]}
          clearcoat={1}
          clearcoatRoughness={0.01}
          envMapIntensity={3}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/**
 * The backdrop the glass refracts.
 *
 * Not decoration — it is load-bearing. `transmission` samples the scene
 * BEHIND the object, and a CSS background sits behind the canvas rather than
 * inside the scene, so with a transparent canvas and an otherwise empty scene
 * the tube refracts nothing and renders very nearly invisible. It also gives
 * `dispersion` something to split: the rainbow fringing is refracted
 * backdrop, so a blank backdrop means colourless fringes.
 */
function Backdrop() {
  const tex = useMemo(() => {
    const W = 512;
    const H = 512;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    // Matches the page's --color-wash-* ramp so the canvas blends into the
    // section it sits in.
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "#dfe8fa");
    g.addColorStop(0.42, "#e7e4f6");
    g.addColorStop(0.7, "#f3ebf2");
    g.addColorStop(1, "#fdf8f4");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // A soft bloom, so the refracted image has structure to bend rather than
    // a flat field.
    const spot = (x: number, y: number, r: number, col: string) => {
      const rg = ctx.createRadialGradient(x * W, y * H, 0, x * W, y * H, r * W);
      rg.addColorStop(0, col);
      rg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
    };
    spot(0.24, 0.3, 0.4, "rgba(198,214,255,0.85)");
    spot(0.82, 0.22, 0.32, "rgba(255,236,246,0.8)");
    spot(0.6, 0.86, 0.36, "rgba(226,214,255,0.6)");
    // Contact shadow — grounds the object and supplies the low end.
    const sh = ctx.createRadialGradient(
      0.46 * W, 0.78 * H, 0,
      0.46 * W, 0.78 * H, 0.27 * W,
    );
    sh.addColorStop(0, "rgba(126,138,172,0.3)");
    sh.addColorStop(1, "rgba(120,132,168,0)");
    ctx.fillStyle = sh;
    ctx.fillRect(0, 0, W, H);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[26, 18]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function StudioEnv() {
  const scene = useThree((s) => s.scene);
  const tex = useMemo(() => makeEnvTexture("studio"), []);
  useEffect(() => {
    scene.environment = tex;
    return () => {
      scene.environment = null;
      tex.dispose();
    };
  }, [scene, tex]);
  return null;
}

/** Slow drift plus cursor parallax. The reference is a still, so the motion
 *  stays under the threshold where it would read as a spinning object. */
function Rig({ strength = 0.35 }: { strength?: number }) {
  const { camera, pointer } = useThree();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x += (pointer.x * strength - camera.position.x) * 0.035;
    camera.position.y +=
      (pointer.y * strength * 0.6 + Math.sin(t * 0.35) * 0.08 - camera.position.y) *
      0.035;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Scene() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!group.current) return;
    group.current.rotation.y = Math.sin(t * 0.18) * 0.09;
    group.current.rotation.z = Math.sin(t * 0.13) * 0.03;
  });
  return (
    <group ref={group}>
      <Ribbon />
      <Sphere />
    </group>
  );
}

export function GlassRibbon({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={style}>
      <Canvas
        /* Fixed 2x rather than following devicePixelRatio: mirror-smooth
           glass aliases badly, and the dispersion fringes are thin enough to
           disappear entirely at dpr 1. */
        dpr={2}
        camera={{ fov: 32, position: [0, 0, 11.5] }}
        gl={{
          antialias: true,
          alpha: true,
          /* Kept on deliberately. It is what makes the scene MEASURABLE:
             with it, canvas pixels can be sampled and compared numerically
             against the brand render (mean / standard deviation / darkest
             value / chroma spread), which is the only reliable way to judge
             this — screenshots of a WebGL canvas composite unreliably, and
             "does it look right" is exactly the loop that consumed v1.
             Costs the browser a retained backbuffer for one canvas. */
          preserveDrawingBuffer: true,
          toneMapping: THREE.NeutralToneMapping,
          toneMappingExposure: 1.05,
        }}
        style={{ background: "transparent" }}
      >
        <StudioEnv />
        <Rig />
        <Backdrop />
        <Scene />
      </Canvas>
    </div>
  );
}
