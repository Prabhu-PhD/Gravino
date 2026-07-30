"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import { useMemo, useRef, useState, useCallback, useEffect } from "react";
import * as THREE from "three";
import { Leva } from "leva";
import { useHeroControls } from "./hero-controls";
import {
  WAVE_X,
  ORB,
  imgToWorldX,
  imgToWorldY,
  waveWorldPoint3D,
  waveWorldFrame3D,
  applyWaveTunables,
  paneHalfDepth,
  paneHalfThickness,
  sphereRadius,
  WORLD_X_MIN,
  WORLD_X_MAX,
} from "@/lib/wave-path";

type Ctl = ReturnType<typeof useHeroControls>;

// The sphere's resting position before any hover — the PSD's actual
// composition point, NOT the midpoint of the (now hugely extended, for the
// "2 more waves" ask) draggable range. Those aren't the same thing: the
// midpoint drifted toward the extension's center once that range grew, and
// the sphere's default position silently followed it away from the crest
// it's supposed to sit on.
const DEFAULT_WORLD_X = imgToWorldX(ORB.defaultX);

/* The world the glass refracts — a pale, single-hue-family sky blue (no
   pink/violet), close to the reference art's own cool, mostly-clear glass. */
function useRefractTexture(p: Ctl["backdrop"]) {
  return useMemo(() => {
    const s = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    // Now that the glass is highly transparent, what shows THROUGH it matters
    // as much as what it reflects — and a near-white backdrop was the other
    // half of why it read grey. Kept light so the page still shows through,
    // but with real hue across it (sky blue → lilac → soft blush) so the
    // transparency carries colour instead of washing out.
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, p.bd0);
    g.addColorStop(0.45, p.bd1);
    g.addColorStop(0.75, p.bd2);
    g.addColorStop(1, p.bd3);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const spot = (x: number, y: number, r: number, a: number) => {
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, `rgba(255,255,255,${a * p.spotStrength})`);
      rg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, s, s);
    };
    spot(s * 0.28, s * 0.26, s * 0.34, 0.95);
    spot(s * 0.72, s * 0.68, s * 0.3, 0.6);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [p.bd0, p.bd1, p.bd2, p.bd3, p.spotStrength]);
}

/* A proper studio environment. The reference glass's continuous bright
   streak + genuinely dark bands come from real photography practice for
   shiny curved objects: a DARK backdrop plus one or two long, THIN strip
   softboxes (not round blobs) — as the tube curves through different
   surface-normal angles, it catches that one strip as an unbroken bright
   line, exactly like the PSD. Round blobs on a mid-bright base (the
   previous version) can only ever give scattered dots, not a streak, and
   without real dark regions there's no contrast for "glossy" to read. */
/** '#rrggbb' -> linear-ish 0..1 triple (kept simple; the env is authored by
 *  eye through the panel, so exact transfer-function fidelity isn't the point). */
function hex3(hex: string): [number, number, number] {
  const n = parseInt(hex.replace("#", ""), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function useStudioEnvTexture(p: Ctl["env"]) {
  return useMemo(() => {
    const w = p.envWidth;
    const h = Math.max(2, Math.round(w / 2));
    const data = new Float32Array(w * h * 4);
    const skyC = hex3(p.skyColor);
    const horC = hex3(p.horizonColor);
    const grdC = hex3(p.groundColor);
    const stripC = hex3(p.stripTint);

    // A COLOURED world. The previous base sat at r0.02/g0.025/b0.045 with
    // white strips — a near-black greyscale field. Transparent glass shows
    // whatever it sits in, so that environment could only ever produce grey
    // glass; tinting the material instead would just cancel the transparency.
    // Colour therefore lives here: cool blue overhead, a luminous band at the
    // horizon, warm violet below, plus a blue↔pink drift around the panorama
    // so a long curved surface sweeps through genuinely different hues along
    // its length rather than one flat tone.
    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      const horizon =
        Math.exp(-((v - p.horizonPos) ** 2) / (2 * p.horizonWidth ** 2)) *
        p.horizonStrength;
      const sky = Math.max(0, 1 - v * 1.8) * p.skyStrength;
      const ground = Math.max(0, (v - 0.55) * 1.9) * p.groundStrength;
      for (let x = 0; x < w; x++) {
        const u = x / (w - 1);
        // hue drift around the panorama, so a long curved surface sweeps
        // through different colour along its length instead of one flat tone
        const d = 0.5 + 0.5 * Math.sin(u * Math.PI * 2 - 1.2); // 0..1
        const i = (y * w + x) * 4;
        data[i] =
          (skyC[0] * sky + horC[0] * horizon + grdC[0] * ground + p.drift * d) *
          p.exposure;
        data[i + 1] =
          (skyC[1] * sky + horC[1] * horizon + grdC[1] * ground + p.drift * d * 0.6) *
          p.exposure;
        data[i + 2] =
          (skyC[2] * sky +
            horC[2] * horizon +
            grdC[2] * ground +
            p.drift * (1 - d)) *
          p.exposure;
        data[i + 3] = 1;
      }
    }

    // Long, thin strip softboxes (wide in U, narrow in V) — the actual source
    // of a continuous bright streak on a curved surface. Tightened (smaller
    // rv) and brightened: a broad, dim strip smears into a soft gradient with
    // nothing to "reflect", whereas a narrow, intense one reads as a distinct
    // mirrored light — which is what makes a surface look reflective rather
    // than merely light-coloured. A third strip near the top adds a second,
    // offset streak so the pane shows more than one reflection event.
    const sharp = p.stripSharpness;
    const strips = [
      { u: p.strip1U, v: p.strip1V, ru: 0.42, rv: 0.014 / sharp, i: 34 },
      { u: p.strip2U, v: p.strip2V, ru: 0.36, rv: 0.011 / sharp, i: 22 },
      { u: p.strip3U, v: p.strip3V, ru: 0.5, rv: 0.016 / sharp, i: 16 },
    ].map((s) => ({ ...s, i: s.i * p.stripIntensity }));
    // small round accents for sparkle/asymmetry
    const dots = [
      { u: 0.12, v: 0.34, r: 0.035 * p.dotSize, i: 12 },
      { u: 0.86, v: 0.66, r: 0.028 * p.dotSize, i: 9 },
      { u: 0.55, v: 0.78, r: 0.03 * p.dotSize, i: 6 },
    ].map((d) => ({ ...d, i: d.i * p.dotIntensity }));

    for (let y = 0; y < h; y++) {
      const v = y / (h - 1);
      for (let x = 0; x < w; x++) {
        const u = x / (w - 1);
        let add = 0;
        for (const s of strips) {
          let du = Math.abs(u - s.u);
          du = Math.min(du, 1 - du);
          const dv = v - s.v;
          add += s.i * Math.exp(-((du * du) / (s.ru * s.ru) + (dv * dv) / (s.rv * s.rv)) * 3);
        }
        for (const d of dots) {
          let du = Math.abs(u - d.u);
          du = Math.min(du, 1 - du);
          const dv = v - d.v;
          add += d.i * Math.exp((-(du * du + dv * dv) / (d.r * d.r)) * 3);
        }
        const i = (y * w + x) * 4;
        data[i] += add * stripC[0];
        data[i + 1] += add * stripC[1];
        data[i + 2] += add * stripC[2];
      }
    }

    const t = new THREE.DataTexture(data, w, h, THREE.RGBAFormat, THREE.FloatType);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.LinearSRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.needsUpdate = true;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    p.envWidth, p.skyColor, p.horizonColor, p.groundColor,
    p.skyStrength, p.horizonStrength, p.groundStrength,
    p.horizonPos, p.horizonWidth, p.drift, p.exposure,
    p.stripIntensity, p.stripSharpness, p.stripTint,
    p.strip1U, p.strip1V, p.strip2U, p.strip2V, p.strip3U, p.strip3V,
    p.dotIntensity, p.dotSize,
  ]);
}

function EnvironmentRig({ texture }: { texture: THREE.Texture }) {
  const { scene } = useThree();
  useEffect(() => {
    const prev = scene.environment;
    scene.environment = texture;
    return () => {
      scene.environment = prev;
    };
  }, [texture, scene]);
  return null;
}

/**
 * One shared glass material. Attenuation (colour + distance) describes the
 * GLASS, so the pane and the sphere must use identical values or they read as
 * two different materials under one environment; any difference between them
 * should come from path length alone, since the sphere is physically deeper.
 * Every value is driven live from the tuning panel (see hero-controls.ts).
 */
function Glass({
  background,
  g,
  thickness,
  envMapIntensity,
}: {
  background: THREE.Texture;
  g: Ctl["glass"];
  thickness: number;
  envMapIntensity: number;
}) {
  return (
    <MeshTransmissionMaterial
      background={background}
      samples={g.samples}
      resolution={g.resolution}
      transmission={1}
      roughness={g.roughness}
      thickness={thickness}
      ior={g.ior}
      chromaticAberration={g.chromaticAberration}
      anisotropy={g.anisotropy}
      distortion={g.distortion}
      distortionScale={g.distortionScale}
      temporalDistortion={g.temporalDistortion}
      clearcoat={g.clearcoat}
      clearcoatRoughness={g.clearcoatRoughness}
      envMapIntensity={envMapIntensity}
      attenuationColor={g.attenuationColor}
      attenuationDistance={g.attenuationDistance}
      color={g.bodyColor}
    />
  );
}

/** A point on the pane's cross-section: position (w = depth, t = thickness)
 *  plus that run's own outward normal, in cross-section space. */
type ProfilePoint = { w: number; t: number; nw: number; nt: number };

/**
 * Cross-section as a SHARP-CORNERED RECTANGLE with SPLIT vertices and
 * analytic per-face normals. Two earlier attempts failed for the same
 * reason: an ellipse has no edges by definition, and a rounded rect still
 * looked soft because `computeVertexNormals()` averages normals across every
 * face meeting a vertex — smoothing away exactly the corner it was meant to
 * create. Emitting each corner position TWICE, once per adjoining face with
 * that face's own normal, is what actually produces a hard edge.
 */
function paneProfile(
  halfDepth: number,
  halfThick: number,
  FACE_SEGS: number,
  WALL_SEGS: number,
): ProfilePoint[] {
  const pts: ProfilePoint[] = [];
  const push = (w: number, t: number, nw: number, nt: number) =>
    pts.push({ w, t, nw, nt });

  // Each run carries its OWN constant normal, and the corner positions are
  // emitted twice (once ending a run, once starting the next) with the two
  // different face normals — that duplication is what makes the edge crisp.
  for (let i = 0; i <= FACE_SEGS; i++) {
    const u = i / FACE_SEGS;
    push(-halfDepth + 2 * halfDepth * u, halfThick, 0, 1); // top face
  }
  for (let i = 0; i <= WALL_SEGS; i++) {
    const u = i / WALL_SEGS;
    push(halfDepth, halfThick - 2 * halfThick * u, 1, 0); // near wall
  }
  for (let i = 0; i <= FACE_SEGS; i++) {
    const u = i / FACE_SEGS;
    push(halfDepth - 2 * halfDepth * u, -halfThick, 0, -1); // bottom face
  }
  for (let i = 0; i <= WALL_SEGS; i++) {
    const u = i / WALL_SEGS;
    push(-halfDepth, -halfThick + 2 * halfThick * u, -1, 0); // far wall
  }
  return pts;
}

function useWaveRibbonGeometry(gm: Ctl["geom"]) {
  return useMemo(() => {
    // `lengthStride` lets the panel trade tessellation for responsiveness
    // while dragging; 1 = every traced point (4 image-px apart).
    const samples = WAVE_X.filter((_, i) => i % gm.lengthStride === 0);
    const n = samples.length;
    const positions: number[] = [];
    const normals: number[] = [];
    const profile = paneProfile(
      paneHalfDepth(),
      paneHalfThickness(),
      gm.faceSegs,
      gm.wallSegs,
    );
    const RING = profile.length;

    for (const imgX of samples) {
      const wx = imgToWorldX(imgX);
      const { x: cx, y: cy, z: cz } = waveWorldPoint3D(wx);
      const { side, up } = waveWorldFrame3D(wx);
      // AXIS ROLES: depth runs along `up` (mostly Z — into the scene, the
      // pane's broad face), thinness along `side` (mostly vertical).
      // Symmetric about the centerline, total depth = 1.5x the sphere's
      // diameter. `up` and `side` are unit and orthogonal, so rotating the
      // unit cross-section normal by them yields a unit world normal.
      for (const p of profile) {
        positions.push(
          cx + up.x * p.w + side.x * p.t,
          cy + up.y * p.w + side.y * p.t,
          cz + up.z * p.w + side.z * p.t,
        );
        normals.push(
          up.x * p.nw + side.x * p.nt,
          up.y * p.nw + side.y * p.nt,
          up.z * p.nw + side.z * p.nt,
        );
      }
    }

    const indices: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      for (let s = 0; s < RING; s++) {
        const a = i * RING + s;
        const b = i * RING + ((s + 1) % RING);
        const c = (i + 1) * RING + ((s + 1) % RING);
        const d = (i + 1) * RING + s;
        indices.push(a, b, c, a, c, d);
      }
    }

    if (process.env.NODE_ENV !== "production") {
      const bad = positions.findIndex((v) => !Number.isFinite(v));
      if (bad >= 0) {
        const s = Math.floor(bad / 3) % RING;
        console.warn("[ribbon] non-finite position", {
          index: bad,
          ringSlot: s,
          profilePoint: profile[s],
          halfDepth: paneHalfDepth(),
          halfThick: paneHalfThickness(),
          ring: RING,
          samples: n,
        });
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    // Analytic normals, supplied directly. NOT computeVertexNormals() — that
    // averages across every face sharing a vertex and would smooth the split
    // corners back into a soft ribbon, which is what defeated the previous
    // two attempts at visible edges.
    geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
    geo.setIndex(indices);
    return geo;
    // Rebuilt whenever any shape-affecting tunable moves. The wave* helpers
    // read mutable module state (applied in Scene before this runs), so those
    // params must appear here even though they aren't referenced directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gm.faceSegs, gm.wallSegs, gm.lengthStride,
    gm.paneDepthMul, gm.paneThicknessPx, gm.sphereScale,
    gm.smoothSigma, gm.depthAmp, gm.depthFreq, gm.depthPhase,
  ]);
}

type Ripple = {
  id: number;
  x: number;
  y: number;
  z: number;
  /** Pane surface normal at the strike point — rings orient to lie flat on
   *  the glass rather than facing the camera, so they read as ripples
   *  spreading ACROSS the surface. */
  nx: number;
  ny: number;
  nz: number;
  start: number;
};
const dotGeo = new THREE.SphereGeometry(1, 10, 8);
/** Unit ring in the XY plane (normal +Z), scaled per frame. Thickness is
 *  proportional to scale, so an expanding ring broadens slightly — which is
 *  how real ripples behave, and cheaper than rebuilding geometry each frame. */
const RING_UNIT = new THREE.RingGeometry(0.95, 1, 128);
const UNIT_Z = new THREE.Vector3(0, 0, 1);

function lerpColor(hexA: string, hexB: string, t: number): [number, number, number] {
  const a = [1, 3, 5].map((i) => parseInt(hexA.slice(i, i + 2), 16) / 255);
  const b = [1, 3, 5].map((i) => parseInt(hexB.slice(i, i + 2), 16) / 255);
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/**
 * Concentric expanding rings — the look shared by the Magic UI Ripple and the
 * CSS click-ripple references: outlined circles that grow outward, each one
 * staggered behind the last and fading as it goes. Distinct from the dot
 * variant below, which scatters discrete points around the circumference.
 */
function RippleRings({
  ripple,
  onDone,
  m,
}: {
  ripple: Ripple;
  onDone: (id: number) => void;
  m: Ctl["motion"];
}) {
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const R = sphereRadius();
  const maxRadius = R * m.rippleSpread;

  // Rebuilt only when thickness changes; scaling a shared unit ring keeps
  // this to one geometry regardless of ring count.
  const geo = useMemo(
    () => new THREE.RingGeometry(1 - m.rippleThickness, 1, 128),
    [m.rippleThickness],
  );

  // Lie flat on the glass: rotate the ring's +Z normal onto the surface normal.
  const quat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(
      UNIT_Z,
      new THREE.Vector3(ripple.nx, ripple.ny, ripple.nz).normalize(),
    );
    return q;
  }, [ripple.nx, ripple.ny, ripple.nz]);

  useFrame((_, delta) => {
    clock.current += delta;
    const t = clock.current / m.rippleDuration;
    if (t >= 1 + m.rippleStagger * m.rippleRings) {
      onDone(ripple.id);
      return;
    }
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const ringT = t - i * m.rippleStagger;
      if (ringT <= 0 || ringT >= 1) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      // Ease-out expansion: quick off the mark, then settling — a linear
      // ramp reads mechanical.
      const ease = 1 - Math.pow(1 - ringT, 3);
      const radius = R * 0.45 + ease * maxRadius;
      mesh.scale.setScalar(radius);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      // Fast fade-IN then long fade-OUT, so rings emerge rather than pop.
      const fadeIn = Math.min(ringT / 0.1, 1);
      mat.opacity = fadeIn * Math.pow(1 - ringT, 1.6) * m.rippleOpacity;
      const [r, g, b] = lerpColor(
        m.rippleColorA,
        m.rippleColorB,
        Math.min(radius / maxRadius, 1),
      );
      mat.color.setRGB(r, g, b);
    });
  });

  const rings = useMemo(
    () => Array.from({ length: m.rippleRings }, (_, i) => i),
    [m.rippleRings],
  );

  return (
    <group
      ref={group}
      position={[ripple.x, ripple.y, ripple.z]}
      quaternion={quat}
    >
      {rings.map((i) => (
        <mesh key={i} geometry={geo}>
          <meshBasicMaterial
            transparent
            depthWrite={false}
            toneMapped={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

function RippleDots({
  ripple,
  onDone,
  m,
}: {
  ripple: Ripple;
  onDone: (id: number) => void;
  m: Ctl["motion"];
}) {
  const group = useRef<THREE.Group>(null);
  const clock = useRef(0);
  const R = sphereRadius();
  const maxRadius = R * m.rippleSpread;

  useFrame((_, delta) => {
    clock.current += delta;
    const t = clock.current / m.rippleDuration;
    if (t >= 1 + m.rippleStagger * m.rippleRings) {
      onDone(ripple.id);
      return;
    }
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const ring = Math.floor(i / m.rippleDots);
      const ringT = t - ring * m.rippleStagger;
      const mesh = child as THREE.Mesh;
      if (ringT <= 0 || ringT >= 1) {
        mesh.visible = false;
        return;
      }
      mesh.visible = true;
      const ease = 1 - Math.pow(1 - ringT, 3);
      const radius = R * 0.55 + ease * maxRadius;
      const angle =
        (i % m.rippleDots) * ((Math.PI * 2) / m.rippleDots) + ringT * 0.8;
      // local to the group (already translated to ripple.x/y/z below) — was
      // previously `ripple.x` here by mistake, which shot ripples off into Z
      // by whatever their world X happened to be instead of sitting at 0.
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius * 0.4, 0);
      const alpha = 1 - ringT;
      const scale = R * 0.05 * (1 - ringT * 0.4);
      mesh.scale.setScalar(Math.max(scale, 0.001));
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = alpha * 0.9;
      const [r, g, b] = lerpColor(
        m.rippleColorA,
        m.rippleColorB,
        Math.min(radius / maxRadius, 1),
      );
      mat.color.setRGB(r, g, b);
    });
  });

  const dots = useMemo(
    () => Array.from({ length: m.rippleRings * m.rippleDots }, (_, i) => i),
    [m.rippleRings, m.rippleDots],
  );

  return (
    <group ref={group} position={[ripple.x, ripple.y, ripple.z]}>
      {dots.map((i) => (
        <mesh key={i} geometry={dotGeo}>
          <meshBasicMaterial transparent depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* Invisible plane spanning the scene — gives continuous pointer position
   (hover, not drag) and a click target, independent of what it's over. */
function InteractionPlane({
  onMove,
  onClick,
}: {
  onMove: (worldX: number) => void;
  onClick: () => void;
}) {
  const handleMove = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      onMove(e.point.x);
    },
    [onMove],
  );
  return (
    // z=0: same plane as the curve/sphere, so the raycast hit's x has zero
    // perspective-parallax error (a plane at a different depth would shift
    // the mapped x slightly, since this is a perspective, not ortho, camera).
    <mesh position={[0, 0, 0]} onPointerMove={handleMove} onClick={onClick}>
      <planeGeometry args={[40, 22]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

/* The sphere: rolls (hover-driven, no click needed) along the tube's exact
   curve, always resting on its surface, spinning physically as it travels.
   Tried MeshRefractionMaterial here (real BVH raycast, true dispersion) but
   reverted: its shader has no transmission/attenuation model at all — it
   only samples refracted env rays and blends to white at grazing angles via
   Fresnel, so against a mostly-dark env + a few bright spots it read as a
   plain chrome/mirror ball with zero visible "see-through" quality, which is
   the one thing that actually makes the reference sphere look like glass.
   MeshTransmissionMaterial's dedicated background/attenuation system is the
   right tool for that, so it's back — now lit by the improved environment. */
function RollingSphere({
  background,
  targetXRef,
  g,
  followLerp,
}: {
  background: THREE.Texture;
  targetXRef: React.MutableRefObject<number>;
  g: Ctl["glass"];
  followLerp: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const xRef = useRef(DEFAULT_WORLD_X);
  const rollAxis = useRef(new THREE.Vector3(0, 0, 1));
  const rollQuat = useRef(new THREE.Quaternion());

  useFrame(() => {
    if (!mesh.current) return;
    const prevX = xRef.current;
    const target = Math.min(Math.max(targetXRef.current, WORLD_X_MIN), WORLD_X_MAX);
    const newX = THREE.MathUtils.lerp(prevX, target, followLerp);
    xRef.current = newX;

    const { side, up } = waveWorldFrame3D(newX);
    const base = waveWorldPoint3D(newX);
    // contact = the pane's thin TOP surface (vertical half-extent is now
    // PANE_HALF_THICKNESS after the axis swap) — using the breadth here
    // would float the sphere far above the sheet.
    const offset = paneHalfThickness() + sphereRadius();
    mesh.current.position.set(
      base.x + side.x * offset,
      base.y + side.y * offset,
      base.z + side.z * offset,
    );

    // rolling without slipping: the instantaneous roll axis is perpendicular
    // to both the travel direction and the surface-contact direction (side)
    // — that's exactly `up` from the local frame. Applying it as a world-
    // space incremental quaternion (not .rotation.z) generalizes the old
    // planar-only trick to a curve that now genuinely moves through Z too.
    const delta = newX - prevX;
    rollAxis.current.set(up.x, up.y, up.z);
    rollQuat.current.setFromAxisAngle(
      rollAxis.current,
      -delta / sphereRadius(),
    );
    mesh.current.quaternion.premultiply(rollQuat.current);
  });

  return (
    // raycast disabled: the sphere's own bulk would otherwise occlude the
    // interaction plane behind it, stalling tracking whenever the cursor
    // sits directly over the visible sphere.
    <mesh ref={mesh} castShadow raycast={() => {}}>
      <sphereGeometry args={[sphereRadius(), 128, 128]} />
      {/* Same glass as the pane — its deeper tint comes from path length
          alone, which is the physically correct reason for two objects in
          one environment to differ. */}
      <Glass
        background={background}
        g={g}
        thickness={g.thicknessSphere}
        envMapIntensity={g.envIntensitySphere}
      />
    </mesh>
  );
}

/* Straight-on gave zero depth cues — the ribbon's own Z-variation is tiny
   (just its cross-section thickness) compared to the camera distance, so a
   head-on view reads as a flat 2D silhouette. Elevating + offsetting the
   camera and explicitly aiming it gives real perspective/parallax across
   the wave's length, so its rounded volume actually reads as 3D. */
function CameraRig({ sc }: { sc: Ctl["scene"] }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(sc.camX, sc.camY, sc.camZ);
    if ((camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const pc = camera as THREE.PerspectiveCamera;
      pc.fov = sc.fov;
      pc.updateProjectionMatrix();
    }
    camera.lookAt(0, sc.lookAtY, 0);
  }, [camera, sc.camX, sc.camY, sc.camZ, sc.fov, sc.lookAtY]);
  return null;
}

function Scene({ ctl }: { ctl: Ctl }) {
  const { glass, env, backdrop, geom, scene: sc, motion } = ctl;

  // Push the geometry tunables into the wave module BEFORE anything reads
  // them this render — the geometry memo and the per-frame sphere maths both
  // call wave* helpers that consult this shared state.
  applyWaveTunables({
    smoothSigma: geom.smoothSigma,
    depthAmp: geom.depthAmp,
    depthFreq: geom.depthFreq,
    depthPhase: geom.depthPhase,
    paneDepthMul: geom.paneDepthMul,
    paneThicknessPx: geom.paneThicknessPx,
    sphereScale: geom.sphereScale,
  });

  const refract = useRefractTexture(backdrop);
  const studioEnv = useStudioEnvTexture(env);
  const ribbonGeo = useWaveRibbonGeometry(geom);
  const targetXRef = useRef(DEFAULT_WORLD_X);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);
  const sphereScreenPos = useRef({ x: 0, y: 0 });

  const handleMove = useCallback((worldX: number) => {
    targetXRef.current = worldX;
  }, []);

  const handleClick = useCallback(() => {
    const x = targetXRef.current;
    const clamped = Math.min(Math.max(x, WORLD_X_MIN), WORLD_X_MAX);
    const base = waveWorldPoint3D(clamped);
    const { side } = waveWorldFrame3D(clamped);
    // Strike point sits on the pane's top surface, directly under the sphere.
    // Rings sit there (not at the sphere's centre) so they spread across the
    // glass; `side` is that surface's normal, used to orient them flat.
    const surface = paneHalfThickness();
    setRipples((rs) => [
      ...rs,
      {
        id: rippleId.current++,
        x: base.x + side.x * surface,
        y: base.y + side.y * surface,
        z: base.z + side.z * surface,
        nx: side.x,
        ny: side.y,
        nz: side.z,
        start: 0,
      },
    ]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((rs) => rs.filter((r) => r.id !== id));
  }, []);

  return (
    <>
      {/* the camera sits off-axis and elevated (see HeroWave) — an explicit
          lookAt so it actually aims at the wave regardless of that position,
          rather than just facing world -Z from wherever it's placed. */}
      <CameraRig sc={sc} />

      {/* procedural studio env — used for scene.environment (never as the
          visible canvas background, so the sitewide CSS gradient still
          shows through) AND directly as the sphere's refraction envMap, so
          both materials are lit/reflecting consistently from one source. */}
      <EnvironmentRig texture={studioEnv} />

      {/* 3-point lighting: a single flat light gives the eye no shading
          gradient to read curvature/depth from, regardless of how good the
          geometry or material is. Key defines the main highlight, fill
          softens the shadow side, rim catches the glass silhouette's edge. */}
      <ambientLight intensity={sc.ambient} />
      <directionalLight position={[6, 9, 6]} intensity={sc.keyIntensity} />
      <directionalLight
        position={[-6, 2, 3]}
        intensity={sc.fillIntensity}
        color={sc.fillColor}
      />
      <directionalLight
        position={[-2, 4, -8]}
        intensity={sc.rimIntensity}
        color={sc.rimColor}
      />

      <InteractionPlane onMove={handleMove} onClick={handleClick} />

      {/* raycast disabled — see RollingSphere for why (same dead-zone risk) */}
      <mesh geometry={ribbonGeo} castShadow receiveShadow raycast={() => {}}>
        <Glass
          background={refract}
          g={glass}
          thickness={glass.thicknessPane}
          envMapIntensity={glass.envIntensityPane}
        />
      </mesh>

      <RollingSphere
        background={refract}
        targetXRef={targetXRef}
        g={glass}
        followLerp={motion.followLerp}
      />

      {ripples.map((r) => (
        motion.rippleStyle === "dots" ? (
          <RippleDots key={r.id} ripple={r} onDone={removeRipple} m={motion} />
        ) : (
          <RippleRings key={r.id} ripple={r} onDone={removeRipple} m={motion} />
        )
      ))}

      <ContactShadows
        position={[0, imgToWorldY(sc.shadowY), 0]}
        scale={sc.shadowScale}
        far={4}
        blur={sc.shadowBlur}
        opacity={sc.shadowOpacity}
        color={sc.shadowColor}
      />
    </>
  );
}

export function HeroWave() {
  const ctl = useHeroControls();
  return (
    // Canvas sizes itself to this box via percentage height, which only
    // resolves against a parent with a DEFINITE height — `absolute inset-0`
    // gives it one. Without this wrapper the canvas collapses to its default
    // 300x150 fallback (which is what made everything look tiny/misplaced
    // and starved the glass material's own render buffer).
    <div className="absolute inset-0">
      {/* Tuning panel. Currently shown to everyone while the hero is being
          tuned — see SHOW_PANEL_BY_DEFAULT in hero-controls.ts for how to
          take it down before launch. Open by default so it's usable at a
          glance; drag the title bar to reposition, or collapse it to see
          the hero unobstructed. */}
      <Leva hidden={!ctl.tuning} titleBar={{ title: "Hero tuning" }} />
      <Canvas
        // CameraRig keeps these live; the Canvas prop is only the initial value.
        camera={{ position: [ctl.scene.camX, ctl.scene.camY, ctl.scene.camZ], fov: ctl.scene.fov }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Scene ctl={ctl} />
      </Canvas>
    </div>
  );
}
