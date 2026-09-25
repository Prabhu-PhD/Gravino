"use client";

/* ===========================================================================
 * The celestial body that sits to the right of every interior page head.
 * ---------------------------------------------------------------------------
 * Adapted from celestial_body.html. The composition is kept as given, because
 * it is already right for this slot: the sphere is pushed right and lit from
 * the left, so the crescent faces back into the page toward the headline, and
 * the ring is a tall vertical sweep rather than a wide one.
 *
 * The good trick, kept intact: the particle shader computes lighting from the
 * WORLD normal, `mat3(modelMatrix) * position`, not the object normal. So the
 * crescent stays stationary while the particles rotate through it. You get
 * motion without anything sliding across the reader's eye.
 *
 * WHAT CHANGED FROM THE SOURCE FILE, and why each one had to:
 *
 *   TEARDOWN. The source loops rAF forever and disposes nothing. Next does
 *     soft navigation, so every interior page visit would leak a WebGL
 *     context; Chrome caps them near 16 and then silently kills the oldest,
 *     blanking canvases with no error. Everything allocated here is tracked
 *     and released on unmount.
 *
 *   CONTAINER SIZING. The source reads window.innerWidth/innerHeight for the
 *     camera aspect, the renderer size, the bloom resolution and the
 *     `containerHeight` particle-size uniform. In a box that is not the
 *     viewport all four are wrong. A ResizeObserver drives them instead.
 *
 *   NO OrbitControls. It calls preventDefault on touchstart, which in a
 *     header would refuse to scroll the page on a phone. This is decoration:
 *     the canvas is pointer-events: none and there is nothing to drag.
 *
 *   TRANSPARENT. The source sets scene.background black, which on the head's
 *     #171033 -> #09090f gradient would read as a black square. alpha: true
 *     with clearAlpha 0, and the edges are masked in CSS so the canvas
 *     dissolves into the page instead of ending on a line.
 *
 *   FEWER PARTICLES. 80k + 45k were chosen for a full 100vh canvas. This box
 *     is a fraction of that area, so most were below one pixel. See DENSITY.
 *
 *   LINEAR OUTPUT. The source runs three 0.150 via unpkg, whose default
 *     output was linear. 0.184 defaults to sRGB, which visibly brightens
 *     additively-blended particles. Forced back to linear to match the
 *     reference rather than to be technically correct.
 *
 * Imports come from the npm three (0.184, already a dependency) rather than
 * the source file's unpkg importmap: a runtime CDN fetch with no SRI, for
 * decoration, on a client site served as static files, is not a risk worth
 * taking.
 * ======================================================================== */

import { useEffect, useRef } from "react";
import * as THREE from "three";

/* DENSITY AND BRIGHTNESS.
 *
 * These were set by matching the reference rather than by taste, because the
 * first guess was wrong in an instructive way. What the eye reads here is not
 * particle COUNT, it is accumulated additive coverage: count x point area /
 * sphere area. Point size carries (containerHeight / 1000) * (200 / -z), and
 * moving from the reference's 900px viewport at z=250 to a 640px box at z=420
 * changed BOTH terms -- points came out at 0.305x the reference's size, so
 * 0.18x the area. Against 1.53x the density that landed at roughly 0.27x the
 * reference brightness, which is exactly how much duller it looked.
 *
 * Corrected by buying brightness with point size rather than with particles,
 * since size is nearly free and count is not. At z=330 in this box:
 *
 *   coverage ratio = (count / 172000) / 0.1347 * 0.29 * SIZE_GAIN^2
 *
 * 30000 particles with a gain of 1.65 puts that at ~1.0, so it matches the
 * reference's brightness with 2.7x fewer particles and slightly larger, softer
 * points -- which at this display size reads as finer grain, not as blur. */
const SURFACE_COUNT = 30000;
const RING_COUNT = 17000;
/** Multiplies point radius. See the note above; this is doing the work that
 *  60000 extra particles would otherwise have to do. */
const SIZE_GAIN = 1.65;

const PLANET_RADIUS = 100;
/** Shifts the sphere right so the lit crescent falls on its left edge. */
const PLANET_X_OFFSET = 40;

/** Light from the left and slightly toward the viewer. Shared by the
 *  atmosphere shell and the surface particles, so they agree on the terminator. */
const LIGHT_DIR = new THREE.Vector3(-1.0, 0.0, 0.25).normalize();

export function CelestialBody({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Everything allocated below goes in here, and the cleanup walks it.
    const disposables: { dispose: () => void }[] = [];
    let frame = 0;
    let observer: ResizeObserver | null = null;

    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Initial size. The observer corrects it immediately, but the camera and
     * renderer need something non-zero to be constructed with. */
    let width = mount.clientWidth || 1;
    let height = mount.clientHeight || 1;

    const scene = new THREE.Scene();
    // Deliberately no scene.background: the page gradient shows through.

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 2000);
    /* 330, against the source's 250. Pulled back enough for this squarer box,
     * but no further: 420 was tried and fitted the whole sphere in frame with
     * margin, which read as a small complete ball and threw away the thing the
     * reference is actually trading on, which is scale. At 330 the sphere is
     * about 73% of the box height and crops on the right, past the container
     * edge that already bleeds off the viewport, so it reads as a world the
     * page is cropping. The ring at +/-240 still leaves the frame top and
     * bottom, which is part of the look and not something to correct. */
    camera.position.set(0, 0, 330);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);
    disposables.push(renderer);

    /* ---- the occluding core -------------------------------------------- */
    /* Opaque black, so the far side of the ring is hidden behind the planet.
     * On this dark ground it reads as a silhouette rather than as a black
     * disc, which is the intent. */
    const baseGeo = new THREE.SphereGeometry(PLANET_RADIUS, 64, 64);
    const baseMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const baseSphere = new THREE.Mesh(baseGeo, baseMat);
    baseSphere.position.x = PLANET_X_OFFSET;
    scene.add(baseSphere);
    disposables.push(baseGeo, baseMat);

    /* ---- the atmosphere crescent --------------------------------------- */
    const atmosphereGeo = new THREE.SphereGeometry(PLANET_RADIUS + 0.5, 64, 64);
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: {
        // Warmed from the source's 0x0a337a toward the site's violet, so the
        // figure sits in the same family as the head's gradient.
        color: { value: new THREE.Color(0x2a2f8f) },
        lightDir: { value: LIGHT_DIR.clone() },
      },
      vertexShader: `
        varying vec3 vWorldNormal;
        varying vec3 vViewDir;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vViewDir = normalize(cameraPosition - worldPosition.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform vec3 lightDir;
        varying vec3 vWorldNormal;
        varying vec3 vViewDir;
        void main() {
          float lightIntensity = max(0.0, dot(vWorldNormal, lightDir));
          float fresnel = pow(1.0 - max(dot(vWorldNormal, vViewDir), 0.0), 1.8);
          float glow = fresnel * pow(lightIntensity, 1.2) * 2.0;
          if (glow <= 0.02) discard;
          gl_FragColor = vec4(color, glow);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    atmosphere.position.x = PLANET_X_OFFSET;
    scene.add(atmosphere);
    disposables.push(atmosphereGeo, atmosphereMat);

    /* ---- surface stardust ---------------------------------------------- */
    const surfaceGeo = new THREE.BufferGeometry();
    {
      const positions = new Float32Array(SURFACE_COUNT * 3);
      const colors = new Float32Array(SURFACE_COUNT * 3);
      for (let i = 0; i < SURFACE_COUNT; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const r = PLANET_RADIUS + 0.6;
        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        const rand = Math.random();
        if (rand < 0.6) {
          colors[i * 3] = 0.1; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.9;
        } else if (rand < 0.9) {
          colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 1.0; colors[i * 3 + 1] = 1.0; colors[i * 3 + 2] = 1.0;
        }
      }
      surfaceGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      surfaceGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }

    const surfaceMat = new THREE.ShaderMaterial({
      uniforms: {
        lightDir: { value: LIGHT_DIR.clone() },
        pixelRatio: { value: renderer.getPixelRatio() },
        // Renamed from the source's windowHeight: it is the container now.
        containerHeight: { value: height },
        sizeGain: { value: SIZE_GAIN },
      },
      vertexShader: `
        uniform vec3 lightDir;
        uniform float pixelRatio;
        uniform float containerHeight;
        uniform float sizeGain;
        attribute vec3 color;
        varying float vIntensity;
        varying vec3 vColor;
        varying vec3 vPosition;
        void main() {
          vColor = color;
          vPosition = position;
          // World normal, so the crescent stays put while the mesh rotates.
          vec3 worldNormal = normalize(mat3(modelMatrix) * position);
          vIntensity = max(0.0, dot(worldNormal, lightDir));
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          float baseSize = (1.0 + (vIntensity * 1.5)) * sizeGain;
          gl_PointSize = baseSize * pixelRatio * (containerHeight / 1000.0) * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vIntensity;
        varying vec3 vColor;
        varying vec3 vPosition;
        void main() {
          if (vIntensity <= 0.02) discard;   // dark side
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;           // round, not square
          // Pseudo-nebular banding, so the dust clumps instead of reading as noise.
          float wave = sin(vPosition.y * 0.06 + vPosition.x * 0.04) *
                       cos(vPosition.z * 0.05 - vPosition.y * 0.07);
          float cluster = smoothstep(-0.4, 0.6, wave);
          float alpha = smoothstep(0.5, 0.1, dist) * pow(vIntensity, 1.2) * (0.2 + 0.8 * cluster);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const surfaceParticles = new THREE.Points(surfaceGeo, surfaceMat);
    surfaceParticles.position.x = PLANET_X_OFFSET;
    scene.add(surfaceParticles);
    disposables.push(surfaceGeo, surfaceMat);

    /* ---- the outer ring ------------------------------------------------ */
    const ringGeo = new THREE.BufferGeometry();
    {
      const positions = new Float32Array(RING_COUNT * 3);
      const colors = new Float32Array(RING_COUNT * 3);
      for (let i = 0; i < RING_COUNT; i++) {
        let t = (Math.random() - 0.5) * 2.0;
        t = Math.sign(t) * Math.pow(Math.abs(t), 1.4); // bias to the equator
        const y = t * 240;

        // A curve mirroring the planet's left edge.
        const curveRadius = PLANET_RADIUS + 18;
        const curveX =
          PLANET_X_OFFSET - Math.sqrt(Math.max(0, curveRadius * curveRadius - y * y));

        const spread = 2.0 + Math.abs(t) * 12.0; // thicker toward the ends
        positions[i * 3] = curveX + (Math.random() - 0.5) * spread - 5;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * spread;
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread * 2.5;

        const rand = Math.random();
        if (rand < 0.6) {
          colors[i * 3] = 0.1; colors[i * 3 + 1] = 0.4; colors[i * 3 + 2] = 0.9;
        } else if (rand < 0.85) {
          colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 1.0;
        } else {
          colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.95; colors[i * 3 + 2] = 1.0;
        }
      }
      ringGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      ringGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    }

    const ringMat = new THREE.ShaderMaterial({
      uniforms: {
        pixelRatio: { value: renderer.getPixelRatio() },
        containerHeight: { value: height },
        sizeGain: { value: SIZE_GAIN },
      },
      vertexShader: `
        uniform float pixelRatio;
        uniform float containerHeight;
        uniform float sizeGain;
        attribute vec3 color;
        varying vec3 vColor;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Hash the position for per-particle size variation.
          float randSize = fract(sin(dot(position.xyz, vec3(12.9898, 78.233, 45.164))) * 43758.5453);
          float baseSize = (0.8 + (randSize * 1.2)) * sizeGain;
          gl_PointSize = baseSize * pixelRatio * (containerHeight / 1000.0) * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, dist);
          gl_FragColor = vec4(vColor, alpha * 0.75);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const outerRing = new THREE.Points(ringGeo, ringMat);
    scene.add(outerRing);
    disposables.push(ringGeo, ringMat);

    /* ---- sizing --------------------------------------------------------- */
    function resize() {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h || (w === width && h === height)) return;
      width = w;
      height = h;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const ratio = renderer.getPixelRatio();
      surfaceMat.uniforms.pixelRatio.value = ratio;
      surfaceMat.uniforms.containerHeight.value = h;
      ringMat.uniforms.pixelRatio.value = ratio;
      ringMat.uniforms.containerHeight.value = h;

      if (still) renderer.render(scene, camera);
    }
    observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    /* ---- the loop ------------------------------------------------------- */
    /* Hand-rolled rather than THREE.Clock, which is deprecated in 0.184 and
     * warns in the console on a client site. It also removes a subtlety in the
     * source: it called getDelta() and then getElapsedTime(), and getElapsedTime
     * internally calls getDelta again, so the two were quietly coupled. */
    const start = performance.now();
    let last = start;

    if (still) {
      /* One frame, then nothing moves. The figure is worth keeping at rest,
       * but the rotation is not worth forcing on someone who asked for less. */
      renderer.render(scene, camera);
    } else {
      const animate = () => {
        frame = requestAnimationFrame(animate);
        const now = performance.now();
        const delta = (now - last) / 1000;
        const time = (now - start) / 1000;
        last = now;

        // The crescent is computed in world space, so this only moves dust.
        surfaceParticles.rotation.y += delta * 0.045;
        surfaceParticles.rotation.z += delta * 0.015;

        outerRing.position.y = Math.sin(time * 0.8) * 3.0;
        outerRing.rotation.z = Math.sin(time * 0.2) * 0.02;

        renderer.render(scene, camera);
      };
      animate();
    }

    /* ---- teardown ------------------------------------------------------- */
    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      scene.clear();
      for (const d of disposables) d.dispose();
      /* dispose() alone leaves the context alive and browsers cap how many
       * they will keep. This is what actually releases it. */
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} aria-hidden className={className} />;
}

export default CelestialBody;
