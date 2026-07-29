"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  ContactShadows,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  type MutableRefObject,
  type ReactNode,
} from "react";
import * as THREE from "three";

type Ptr = { x: number; y: number };

/* The pastel "world" the glass refracts — a soft sky→violet→pink gradient.
   This is what gives the glass its brand colour from the inside (like the PDF),
   without putting a grey studio backdrop on the whole hero. */
function useRefractTexture() {
  return useMemo(() => {
    const s = 1024;
    const c = document.createElement("canvas");
    c.width = c.height = s;
    const ctx = c.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, s, s);
    g.addColorStop(0, "#a6cdff");
    g.addColorStop(0.5, "#b8a2f4");
    g.addColorStop(1, "#f7b6d6");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    // a couple of soft bright spots → glints/refraction sparkle
    const spot = (x: number, y: number, r: number, a: number) => {
      const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, `rgba(255,255,255,${a})`);
      rg.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, s, s);
    };
    spot(s * 0.3, s * 0.28, s * 0.3, 0.8);
    spot(s * 0.74, s * 0.66, s * 0.26, 0.5);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

/* Two merged glass bodies → only two refraction buffers (rich own-buffer MTM):
   - static fulcrum: a big base ring with a medium ring stacked on it
   - the tilting beam: a plank with the big ring threaded on the raised (left)
     end and a dome/arch resting on the lowered (right) end.
   Proportions + placement traced from the brand hero PDF. */
function useBalanceGeometries() {
  return useMemo(() => {
    const TILT = -0.188; // ~ -10.8°, the beam's resting angle (traced from the PDF)

    // fulcrum stack (static): big base ring + smaller ring stacked on it
    const base = new THREE.TorusGeometry(0.68, 0.22, 72, 220);
    base.translate(0, -1.46, 0);
    const mid = new THREE.TorusGeometry(0.44, 0.15, 64, 190);
    mid.translate(0, -0.15, 0);
    const staticGeo = mergeGeometries([base, mid]);

    // beam assembly (tilts as one; built in the beam's local frame, pivot at origin)
    const plank = new THREE.BoxGeometry(4.3, 0.12, 0.34);
    plank.rotateZ(TILT);
    plank.translate(-0.12, 0.04, 0);
    const topRing = new THREE.TorusGeometry(0.59, 0.18, 72, 220); // big ring, raised end
    topRing.translate(-1.12, 0.93, 0); // rests on the raised end of the beam
    const arch = new THREE.TorusGeometry(0.5, 0.2, 48, 150, Math.PI); // dome, lowered end
    arch.rotateZ(TILT);
    arch.translate(1.2, 0.02, 0); // sits down on the lowered end
    const beamGeo = mergeGeometries([plank, topRing, arch]);

    return { staticGeo, beamGeo };
  }, []);
}

/* Real glass: clear + thick, own high-res buffer refracting the pastel world. */
function Glass({ background }: { background: THREE.Texture }) {
  return (
    <MeshTransmissionMaterial
      background={background}
      samples={8}
      resolution={1024}
      transmission={1}
      roughness={0.08}
      thickness={1.5}
      ior={1.5}
      chromaticAberration={0.16}
      anisotropy={0.2}
      distortion={0}
      distortionScale={0.3}
      temporalDistortion={0.12}
      clearcoat={1}
      clearcoatRoughness={0.08}
      attenuationColor="#d6c8f5"
      attenuationDistance={3}
      color="#ffffff"
    />
  );
}

/* The brand mark — beam balanced on a ring-stack fulcrum; tilts to the cursor. */
function Balance({ pointer }: { pointer: MutableRefObject<Ptr> }) {
  const { staticGeo, beamGeo } = useBalanceGeometries();
  const refract = useRefractTexture();
  const beam = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!beam.current) return;
    const t = state.clock.elapsedTime;
    // resting tilt is baked into the geometry; this rocks gently + leans to cursor
    const target = Math.sin(t * 0.5) * 0.03 + pointer.current.x * 0.15;
    beam.current.rotation.z = THREE.MathUtils.lerp(
      beam.current.rotation.z,
      target,
      0.06,
    );
  });

  return (
    <group position={[0, 0.1, 0]} scale={0.62}>
      <mesh geometry={staticGeo}>
        <Glass background={refract} />
      </mesh>
      {/* pivot at the point where the beam rests on the fulcrum stack */}
      <group ref={beam} position={[0, 0.45, 0]}>
        <mesh geometry={beamGeo}>
          <Glass background={refract} />
        </mesh>
      </group>
    </group>
  );
}

/* Cursor parallax for the whole scene — subtle depth. */
function Rig({ pointer, children }: { pointer: MutableRefObject<Ptr>; children: ReactNode }) {
  const grp = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!grp.current) return;
    grp.current.rotation.y = THREE.MathUtils.lerp(
      grp.current.rotation.y,
      pointer.current.x * 0.16,
      0.05,
    );
    grp.current.rotation.x = THREE.MathUtils.lerp(
      grp.current.rotation.x,
      pointer.current.y * 0.09,
      0.05,
    );
  });
  return <group ref={grp}>{children}</group>;
}

export function GlassScene() {
  const pointer = useRef<Ptr>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 4]} intensity={1.1} />

      <Suspense fallback={null}>
        <Rig pointer={pointer}>
          <Float speed={1.1} rotationIntensity={0.04} floatIntensity={0.3}>
            <Balance pointer={pointer} />
          </Float>
        </Rig>

        {/* HDRI for realistic reflections/lighting only — NOT shown as background,
            so the lavender page stays visible behind the glass. */}
        <Environment files="/hdri/env.hdr" />
      </Suspense>

      <ContactShadows
        position={[0, -1.55, 0]}
        scale={8}
        far={4}
        blur={2.6}
        opacity={0.32}
        color="#2e2658"
      />
    </Canvas>
  );
}
