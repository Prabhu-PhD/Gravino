/* ===========================================================================
 * Gravity hero engine - ported from Arun's app4.js (the "Dual Hero" build).
 * ---------------------------------------------------------------------------
 * Kept as close to verbatim as possible ON PURPOSE. This file carries a lot of
 * hand-tuning - camera positions, particle counts, bezier travel paths, ring
 * geometry - and rewriting it into idiomatic React hooks would have thrown all
 * of that away for no benefit. A thin client component mounts it instead.
 *
 * What actually changed from the original:
 *   1. window.THREE -> a real import. Arun loads three r128 from a CDN; this
 *      project already has npm three r184.
 *   2. Texture.encoding -> Texture.colorSpace. This was the ONLY genuine
 *      r128 -> r184 break in the entire file; everything else he uses is
 *      stable API across those versions.
 *   3. "assets/..." -> "/arun/...", served from Next's public directory.
 *   4. The DOMContentLoaded wrapper became an exported init() that the React
 *      effect calls once the container is actually in the DOM.
 *
 * NOTE: the engine reaches into the page by element id (hero1-ui, hero2-ui,
 * ring-dot-N, what-we-cover, teardown, ...) because the scroll-lock logic
 * coordinates the hero with the sections below it. Those ids must exist in the
 * markup, or the corresponding behaviour silently no-ops.
 * ======================================================================== */

import * as THREE from "three";

export function initGravityHero() {
  /* Arun tuned every colour in this scene against three r128, where
     ColorManagement was OFF by default and the renderer wrote linear values
     straight out. r184 turns it ON, so identical inputs render darker and
     flatter — which is exactly how the planet came through on the first run.
     Disabling it reproduces his intended look rather than re-grading a few
     hundred hand-picked values. */
  THREE.ColorManagement.enabled = false;

// Gravino — Index 3 Standalone Dual Hero Engine
// Features:
// 1. Single Click / Scroll Trigger: Smooth cinematic cosmic travel between Scene 1 and Scene 2.
// 2. Persistent Top Nav: Logo and navigation remain visible and interactive throughout all scenes.
// 3. Cosmic Travel Transition: Glass planet recedes into Z axis, particles expand across entire screen.
//    Second planet is 100% hidden in Scene 1 and emerges from deep space during travel.
// 4. Scene 2 Layout: Text positioned on top-left above particles. Planet & rings placed as low as possible.
// 5. Razor-Sharp Concentric Rings: Luminous neon glow and clear concentric toruses.
// 6. Dynamic Ring Marker Lines & Dummy Callouts: 6 floating cards anchored dynamically to the 6 circles.

  const container = document.getElementById('canvas-container');
  if (!container) return;

  // =========================================================================
  // 1. SCENE + TRANSPARENT RENDERER
  // =========================================================================
  const scene = new THREE.Scene();

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  renderer.setClearColor(0x000000, 0); // Transparent canvas for assets/hero-bg.jpg
  container.appendChild(renderer.domElement);

  // =========================================================================
  // 2. CAMERA SETUP
  // =========================================================================
  let baseCameraX = window.innerWidth < 968 ? 0 : 3.5;
  const hero1CamPos = new THREE.Vector3(baseCameraX, 3, window.innerWidth < 968 ? 12 : 10);
  // Scene 2 Camera: EXACT match to media_1788796927760.png reference image
  const hero2CamPos = new THREE.Vector3(-5, 10, 45);
  const hero1LookAt = new THREE.Vector3(baseCameraX, 0, 0);
  const hero2LookAt = new THREE.Vector3(5, 0, 0);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.copy(hero1CamPos);
  camera.lookAt(hero1LookAt);
  scene.add(camera);

  // =========================================================================
  // 3. LIGHTING (Hero 1)
  // =========================================================================
  const dirLight = new THREE.DirectionalLight(0x1e88ff, 0.7);
  dirLight.position.set(0, 14, 4);
  scene.add(dirLight);

  const ambientLight = new THREE.AmbientLight(0x304060, 0.6);
  scene.add(ambientLight);

  // =========================================================================
  // 4. STUDIO HDRI FOR GLASS REFLECTIONS (exact to index.html)
  // =========================================================================
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x020106);
  const lightGeo = new THREE.PlaneGeometry(15, 15);

  const topLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 1.2, 4.5) }));
  topLight.position.set(0, 10, 0); topLight.rotation.x = Math.PI / 2; envScene.add(topLight);

  const leftLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.3, 1.5, 5.0) }));
  leftLight.position.set(-10, 2, 0); leftLight.rotation.y = Math.PI / 2; envScene.add(leftLight);

  const rightLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.4, 0.8, 3.5) }));
  rightLight.position.set(10, -2, 0); rightLight.rotation.y = -Math.PI / 2; envScene.add(rightLight);

  const backLight = new THREE.Mesh(lightGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(0.1, 0.5, 3.0) }));
  backLight.position.set(0, 0, -10); envScene.add(backLight);

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();
  const studioHDRITexture = pmremGenerator.fromScene(envScene).texture;

  // =========================================================================
  // 5. PROCEDURAL TEXTURES
  // =========================================================================
  const nCanvas = document.createElement('canvas');
  nCanvas.width = 512; nCanvas.height = 512;
  const nCtx = nCanvas.getContext('2d');
  const imgData = nCtx.createImageData(512, 512);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const val = Math.floor(128 + (Math.random() - 0.5) * 160);
    imgData.data[i] = val; imgData.data[i + 1] = val; imgData.data[i + 2] = val; imgData.data[i + 3] = 255;
  }
  nCtx.putImageData(imgData, 0, 0);
  const noiseTexture = new THREE.CanvasTexture(nCanvas);
  noiseTexture.wrapS = THREE.RepeatWrapping;
  noiseTexture.wrapT = THREE.RepeatWrapping;
  noiseTexture.repeat.set(8, 8);

  function createDarkGreyNoise() {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Clean, uniform dark charcoal tone (pure and free of any patterns or stripes)
    ctx.fillStyle = '#1e2026';
    ctx.fillRect(0, 0, size, size);

    // Subtle, gentle micro-grain for clean matte stone
    const imgData = ctx.getImageData(0, 0, size, size);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const n = (Math.random() - 0.5) * 8;
      imgData.data[i] = Math.max(0, Math.min(255, imgData.data[i] + n));
      imgData.data[i + 1] = Math.max(0, Math.min(255, imgData.data[i + 1] + n));
      imgData.data[i + 2] = Math.max(0, Math.min(255, imgData.data[i + 2] + n + 1));
    }
    ctx.putImageData(imgData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }
  const darkStoneTexture = createDarkGreyNoise();

  function createRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 32;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillRect(0, 0, 512, 32);

    // Luminous segments along ring circumference
    const segments = 8;
    const segWidth = 512 / segments;
    for (let s = 0; s < segments; s++) {
      const cx = (s + 0.5) * segWidth;
      const grad = ctx.createRadialGradient(cx, 16, 2, cx, 16, segWidth * 0.45);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.85)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(s * segWidth, 0, segWidth, 32);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(3, 1);
    return tex;
  }
  const ringEnergyTexture = createRingTexture();

  // =========================================================================
  // 6. HERO 1: MAIN SPHERE GROUP (Iridescent Core + Tactile Glass Orb)
  // =========================================================================
  const sphereGroup = new THREE.Group();
  scene.add(sphereGroup);

  const iridescentMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0.0 } },
    vertexShader: `
      varying vec3 vNormal, vViewDir, vWorldPos, vLocalPos;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vLocalPos = position;
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vViewDir = normalize(cameraPosition - worldPos.xyz);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      varying vec3 vNormal, vViewDir, vWorldPos, vLocalPos;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
      void main() {
        vec3 N = normalize(vNormal); vec3 V = normalize(vViewDir);
        vec3 p = normalize(vLocalPos / 1.48); 
        float fresnel = 1.0 - max(0.0, dot(V, N));
        float opticalDepth = sqrt(clamp(1.0 - fresnel * fresnel, 0.0, 1.0));
        vec3 col = vec3(0.012, 0.006, 0.030);

        float coreDist = length(vec2(p.x * 1.15, p.y + 0.15));
        float coreGlow = pow(clamp(1.0 - coreDist / 0.82, 0.0, 1.0), 1.5);
        col += vec3(0.92, 0.04, 0.98) * coreGlow * 3.2;

        float wave = sin(p.x * 3.6 + uTime * 1.2) * 0.045 + cos(p.x * 7.0 - uTime * 1.8) * 0.02;
        float liquidLevel = -0.34 + wave;
        float meniscusDist = abs(p.y - liquidLevel);
        float meniscusGlow = pow(clamp(1.0 - meniscusDist / 0.09, 0.0, 1.0), 3.2);
        col += vec3(0.85, 0.05, 0.60) * meniscusGlow * 3.2;

        if (p.y < liquidLevel) {
          float depth = (liquidLevel - p.y);
          vec3 darkLiquid = mix(vec3(0.18, 0.01, 0.15), vec3(0.02, 0.005, 0.03), clamp(depth * 2.8, 0.0, 1.0));
          col = mix(col, darkLiquid, 0.94);
          col += vec3(0.35, 0.02, 0.30) * pow(clamp(1.0 - depth * 3.5, 0.0, 1.0), 2.0) * 0.4;
        }

        float leftRim = pow(max(0.0, -p.x), 2.2) * smoothstep(0.9, -0.4, p.y);
        col += vec3(1.0, 0.62, 0.28) * leftRim * 1.8 * pow(fresnel, 1.1);
        float rightRim = pow(max(0.0, p.x), 2.2) * smoothstep(0.9, -0.4, p.y);
        col += vec3(0.95, 0.25, 0.58) * rightRim * 1.5 * pow(fresnel, 1.1);

        float ring1 = pow(fresnel, 3.8) * 1.5;
        float ring2 = pow(fresnel, 14.0) * 2.2;
        vec3 darkSkyBlueHalo = mix(vec3(0.08, 0.45, 0.88), vec3(0.16, 0.58, 0.95), clamp(pow(fresnel, 1.2), 0.0, 1.0));
        col += darkSkyBlueHalo * (ring1 + ring2);

        float auraFresnel = pow(fresnel, 2.8);
        col += mix(vec3(0.06, 0.42, 0.85), vec3(0.18, 0.58, 0.92), auraFresnel) * auraFresnel * 0.18;

        float blueFresnelFactor = pow(fresnel, 3.8);
        vec3 darkSkyBlueFresnelEdge = vec3(0.10, 0.52, 0.92);
        vec3 overlayFresnel = mix(col, col * (vec3(1.0) + darkSkyBlueFresnelEdge * 1.2), blueFresnelFactor * 0.40);
        col = mix(col, overlayFresnel + darkSkyBlueFresnelEdge * blueFresnelFactor * 0.7, 0.65);

        vec3 lightDir = normalize(vec3(0.0, 0.95, 0.35));
        vec3 halfDir = normalize(V + lightDir);
        float topSpec = pow(max(0.0, dot(N, halfDir)), 36.0);
        float topCap = smoothstep(0.35, 0.95, p.y);
        col += vec3(0.08, 0.55, 1.00) * topSpec * topCap * 3.5;

        col *= mix(1.0, 0.72 + 0.28 * (1.0 - opticalDepth), 0.5);
        float grain = (hash(vWorldPos.xy * 180.0 + vec2(vWorldPos.z * 60.0, uTime * 0.4)) - 0.5) * 0.06;
        col += vec3(grain * 0.8, grain * 0.7, grain * 1.1);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
    transparent: true,
    side: THREE.FrontSide
  });

  const innerCoreMesh = new THREE.Mesh(new THREE.SphereGeometry(1.48, 64, 64), iridescentMaterial);
  innerCoreMesh.renderOrder = 1;
  sphereGroup.add(innerCoreMesh);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#030c1c'),
    emissive: new THREE.Color('#010714'),
    emissiveIntensity: 0.10,
    roughness: 0.12,
    metalness: 0.0,
    transmission: 0.92,
    ior: 1.50,
    thickness: 1.6,
    bumpMap: noiseTexture,
    bumpScale: 0.003,
    roughnessMap: noiseTexture,
    envMap: studioHDRITexture,
    envMapIntensity: 0.70,
    clearcoat: 0.80,
    clearcoatRoughness: 0.08,
    transparent: true,
    opacity: 0.30
  });

  const glassSphere = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), glassMaterial);
  glassSphere.renderOrder = 2;
  sphereGroup.add(glassSphere);

  // =========================================================================
  // 7. HERO 1: LUMINOUS STONE MOON (exact to index.html)
  // =========================================================================
  const moonGroup = new THREE.Group();
  scene.add(moonGroup);

  const moonCanvas = document.createElement('canvas');
  moonCanvas.width = 512; moonCanvas.height = 512;
  const mCtx = moonCanvas.getContext('2d');
  mCtx.fillStyle = '#f4f6fa'; mCtx.fillRect(0, 0, 512, 512);

  for (let py = 0; py < 512; py += 2) {
    for (let px = 0; px < 512; px += 2) {
      const base = Math.floor(225 + Math.random() * 30);
      const warm = Math.random() > 0.5 ? 2 : -2;
      mCtx.fillStyle = `rgb(${base + warm}, ${base}, ${base - warm})`;
      mCtx.fillRect(px, py, 2, 2);
    }
  }

  for (let c = 0; c < 25; c++) {
    const cx = Math.random() * 512, cy = Math.random() * 512, cr = Math.random() * 20 + 4;
    const grd = mCtx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    grd.addColorStop(0, 'rgba(180, 182, 190, 0.25)');
    grd.addColorStop(0.6, 'rgba(210, 212, 220, 0.15)');
    grd.addColorStop(1, 'rgba(240, 242, 245, 0)');
    mCtx.fillStyle = grd; mCtx.beginPath(); mCtx.arc(cx, cy, cr, 0, Math.PI * 2); mCtx.fill();
  }

  for (let h = 0; h < 15; h++) {
    const hx = Math.random() * 512, hy = Math.random() * 512, hr = Math.random() * 12 + 3;
    const hGrd = mCtx.createRadialGradient(hx, hy, 0, hx, hy, hr);
    hGrd.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    hGrd.addColorStop(1, 'rgba(245, 247, 250, 0)');
    mCtx.fillStyle = hGrd; mCtx.beginPath(); mCtx.arc(hx, hy, hr, 0, Math.PI * 2); mCtx.fill();
  }

  const moonStoneTexture = new THREE.CanvasTexture(moonCanvas);
  moonStoneTexture.colorSpace = THREE.SRGBColorSpace;

  const rockBumpCanvas = document.createElement('canvas');
  rockBumpCanvas.width = 512; rockBumpCanvas.height = 512;
  const rbCtx = rockBumpCanvas.getContext('2d');
  const rbData = rbCtx.createImageData(512, 512);
  for (let i = 0; i < rbData.data.length; i += 4) {
    const v = Math.floor(Math.random() * 200 + 28);
    rbData.data[i] = v; rbData.data[i + 1] = v; rbData.data[i + 2] = v; rbData.data[i + 3] = 255;
  }
  rbCtx.putImageData(rbData, 0, 0);
  const rockBumpTexture = new THREE.CanvasTexture(rockBumpCanvas);
  rockBumpTexture.wrapS = THREE.RepeatWrapping;
  rockBumpTexture.wrapT = THREE.RepeatWrapping;
  rockBumpTexture.repeat.set(3, 3);

  const moonGeometry = new THREE.SphereGeometry(0.216, 64, 64);
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f0f3f8'),
    map: moonStoneTexture,
    metalness: 0.05,
    roughness: 0.55,
    bumpMap: rockBumpTexture,
    bumpScale: 0.015,
    displacementMap: rockBumpTexture,
    displacementScale: 0.006,
    emissive: new THREE.Color('#788090'),
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 1.0
  });

  const moon = new THREE.Mesh(moonGeometry, moonMaterial);
  moon.renderOrder = 0;
  moonGroup.add(moon);

  const moonDefaults = { opacity: 1.0, roughness: 0.72, bumpScale: 0.018 };
  let currentBlurFactor = 0.0;

  // =========================================================================
  // 8. HERO 2: RINGED PLANET & 6 CONCENTRIC HALO RINGS
  //    Placed as low as possible (y = -7.5) to keep top-left text free!
  //    HIDDEN initially (visible = false) so it doesn't show in Scene 1!
  // =========================================================================
  const planetGroup = new THREE.Group();
  planetGroup.position.set(18, -6.5, 0); // Positioned in bottom-right
  planetGroup.rotation.x = 0.2;
  planetGroup.visible = false; // Completely hidden in Scene 1!
  scene.add(planetGroup);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.2);
  fillLight.position.set(-10, 10, 15);
  planetGroup.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0x24c1ff, 6);
  rimLight.position.set(15, 15, -15);
  planetGroup.add(rimLight);

  const planetGeo = new THREE.SphereGeometry(10, 128, 128);
  const planetMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: darkStoneTexture,
    roughness: 0.85,
    metalness: 0.15
  });
  const planet = new THREE.Mesh(planetGeo, planetMat);
  planet.rotation.y = -Math.PI / 4;
  planet.rotation.z = 0.2;
  planetGroup.add(planet);

  // 6 Concentric Halo Rings with Radiant Glow
  // Fixed tilt parent container keeps the ring plane locked at 3D tilt
  const ringsTiltGroup = new THREE.Group();
  ringsTiltGroup.rotation.x = -0.25;
  ringsTiltGroup.rotation.z = 0.3;
  planetGroup.add(ringsTiltGroup);

  // Spinning rings system rotates flat inside ringsTiltGroup
  const ringsSystem = new THREE.Group();
  ringsTiltGroup.add(ringsSystem);

  const ringRadiiH2 = [12.0, 12.3, 12.8, 13.4, 14.0, 14.5];
  const ringColorsH2 = [0xffffff, 0x24c1ff, 0x3465d9, 0x7642cf, 0xcc4ec7, 0x473489];

  const createRing = (radius, tube, color, isCore = false) => {
    const group = new THREE.Group();
    const geo = new THREE.TorusGeometry(radius, tube, 32, 128);
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      map: ringEnergyTexture,
      transparent: true,
      opacity: 0.95
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = Math.PI / 2;
    group.add(mesh);

    // Additive glow
    const glowGeo = new THREE.TorusGeometry(radius, tube * (isCore ? 3.0 : 2.0), 16, 128);
    const glowMat = new THREE.MeshBasicMaterial({
      color: color,
      map: ringEnergyTexture,
      transparent: true,
      opacity: isCore ? 0.95 : 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const glowMesh = new THREE.Mesh(glowGeo, glowMat);
    glowMesh.rotation.x = Math.PI / 2;
    group.add(glowMesh);

    if (isCore) {
      const wideAuraGeo = new THREE.TorusGeometry(radius, tube * 5.5, 16, 128);
      const wideAuraMat = new THREE.MeshBasicMaterial({
        color: 0x24c1ff,
        map: ringEnergyTexture,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const wideAuraMesh = new THREE.Mesh(wideAuraGeo, wideAuraMat);
      wideAuraMesh.rotation.x = Math.PI / 2;
      group.add(wideAuraMesh);
    }
    return group;
  };

  ringsSystem.add(createRing(12.0, 0.15, 0xffffff, true)); // 1. Capital (White core)
  ringsSystem.add(createRing(12.8, 0.08, 0x24c1ff));       // 2. Brand (Cyan)
  ringsSystem.add(createRing(13.7, 0.04, 0xcc4ec7));       // 3. Growth (Pink)
  ringsSystem.add(createRing(14.6, 0.02, 0x7642cf));       // 4. Experience (Purple)
  ringsSystem.add(createRing(15.5, 0.01, 0x473489));       // 5. Deep indigo aura

  const ringPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // =========================================================================
  // 9. UNIFIED 31,500 PARTICLE SYSTEM (Same particles for both scenes!)
  // =========================================================================
  const trackGroup = new THREE.Group();
  trackGroup.rotation.x = Math.PI / 8;
  trackGroup.rotation.z = -Math.PI / 12;
  scene.add(trackGroup);

  const particleCount = 31500;
  const ringRadii = [2.8, 4.2, 5.6, 7.0];

  const h1Positions = new Float32Array(particleCount * 3);
  const hExpPositions = new Float32Array(particleCount * 3);
  const h2Positions = new Float32Array(particleCount * 3);
  const h1Colors = new Float32Array(particleCount * 3);
  const h2Colors = new Float32Array(particleCount * 3);
  const pSizes = new Float32Array(particleCount);
  const pOffsets = new Float32Array(particleCount * 3);
  const pAlphas = new Float32Array(particleCount);

  const palette = [
    new THREE.Color('#4c1d95'),
    new THREE.Color('#1e40af'),
    new THREE.Color('#0284c7'),
    new THREE.Color('#7e22ce'),
    new THREE.Color('#1e1b4b'),
    new THREE.Color('#4f46e5'),
    new THREE.Color('#0f172a')
  ];
  const colorCyan = new THREE.Color(0x24c1ff);
  const colorMagenta = new THREE.Color(0xcc4ec7);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;

    // 1. Hero 1 Local Orbit Positions
    const targetRing = ringRadii[Math.floor(Math.random() * ringRadii.length)];
    const randR = (Math.random() - 0.5);
    const radiusOffset = Math.sign(randR) * Math.pow(Math.abs(randR), 3) * 12.0;
    const radius1 = targetRing + radiusOffset;
    const theta1 = Math.random() * Math.PI * 2;
    const randY = (Math.random() - 0.5);
    const verticalSpread = Math.sign(randY) * Math.pow(Math.abs(randY), 3) * 6.0;

    h1Positions[i3] = Math.cos(theta1) * radius1;
    h1Positions[i3 + 1] = verticalSpread;
    h1Positions[i3 + 2] = Math.sin(theta1) * radius1;

    const baseCol = palette[Math.floor(Math.random() * palette.length)];
    h1Colors[i3] = baseCol.r;
    h1Colors[i3 + 1] = baseCol.g;
    h1Colors[i3 + 2] = baseCol.b;

    // 2. Cosmic Travel Expansion (Wide 3D field filling the entire screen)
    hExpPositions[i3] = (Math.random() - 0.5) * 52.0;
    hExpPositions[i3 + 1] = (Math.random() - 0.5) * 36.0;
    hExpPositions[i3 + 2] = (Math.random() - 0.5) * 32.0 + 8.0;

    // 3. Hero 2 Local Ring Positions (Lower diagonal dust belt matching reference)
    const radius2 = 11.5 + Math.random() * 30.0;
    const theta2 = Math.random() * Math.PI * 2;
    const ySpread2 = Math.pow(radius2 - 11.0, 1.3) * 0.08 * (Math.random() - 0.5);

    h2Positions[i3] = radius2 * Math.cos(theta2);
    h2Positions[i3 + 1] = ySpread2;
    h2Positions[i3 + 2] = radius2 * Math.sin(theta2);

    const mixRatio = Math.random();
    const h2Col = colorCyan.clone().lerp(colorMagenta, mixRatio);
    h2Colors[i3] = h2Col.r;
    h2Colors[i3 + 1] = h2Col.g;
    h2Colors[i3 + 2] = h2Col.b;

    pSizes[i] = Math.random() * 2.0 + 0.5;
    pOffsets[i3] = (Math.random() * 0.3 + 0.15);
    pOffsets[i3 + 1] = Math.random() * 100;
    pOffsets[i3 + 2] = (Math.random() > 0.5 ? 1 : -1);
    pAlphas[i] = (Math.random() * 0.85 + 0.15) * 0.85;
  }

  const pGeometry = new THREE.BufferGeometry();
  pGeometry.setAttribute('position', new THREE.BufferAttribute(h1Positions, 3));
  pGeometry.setAttribute('aHero1Pos', new THREE.BufferAttribute(h1Positions, 3));
  pGeometry.setAttribute('aExpPos', new THREE.BufferAttribute(hExpPositions, 3));
  pGeometry.setAttribute('aHero2Pos', new THREE.BufferAttribute(h2Positions, 3));
  pGeometry.setAttribute('aHero1Col', new THREE.BufferAttribute(h1Colors, 3));
  pGeometry.setAttribute('aHero2Col', new THREE.BufferAttribute(h2Colors, 3));
  pGeometry.setAttribute('aSize', new THREE.BufferAttribute(pSizes, 1));
  pGeometry.setAttribute('aOffset', new THREE.BufferAttribute(pOffsets, 3));
  pGeometry.setAttribute('aAlpha', new THREE.BufferAttribute(pAlphas, 1));

  const pVertexShader = `
    uniform float uTime;
    uniform float uMorph;
    uniform mat4 uTrackMatrix;
    uniform mat4 uRingsMatrix;
    uniform vec3 uMouse3D;
    uniform vec3 uMoon3D;
    
    attribute vec3 aHero1Pos;
    attribute vec3 aExpPos;
    attribute vec3 aHero2Pos;
    attribute vec3 aHero1Col;
    attribute vec3 aHero2Col;
    attribute float aSize;
    attribute vec3 aOffset;
    attribute float aAlpha; 
    
    varying vec3 vColor;
    varying float vAlpha;
    
    void main() {
      vColor = mix(aHero1Col, aHero2Col, uMorph);
      vAlpha = aAlpha;

      // Hero 1 local position
      vec3 pos1 = aHero1Pos;
      float angle1 = uTime * aOffset.x * 0.2 * aOffset.z;
      mat2 rot1 = mat2(cos(angle1), -sin(angle1), sin(angle1), cos(angle1));
      pos1.xz = rot1 * pos1.xz;
      pos1.y += sin(uTime * 0.5 + aOffset.y + pos1.x) * 0.05;
      pos1.z += cos(uTime * 0.4 + aOffset.y + pos1.y) * 0.05;
      vec4 wPos1 = uTrackMatrix * vec4(pos1, 1.0);

      // Expansion cosmic cloud
      vec3 posExp = aExpPos;
      posExp.x += sin(uTime * 0.3 + aOffset.y) * 1.5;
      posExp.y += cos(uTime * 0.25 + aOffset.x) * 1.5;

      // Hero 2 ring position
      vec3 pos2 = aHero2Pos;
      float angle2 = -uTime * 0.010 * (0.8 + 0.4 * aOffset.x);
      mat2 rot2 = mat2(cos(angle2), -sin(angle2), sin(angle2), cos(angle2));
      pos2.xz = rot2 * pos2.xz;
      vec4 wPos2 = uRingsMatrix * vec4(pos2, 1.0);

      // Smooth Quadratic Bezier cosmic travel trajectory
      float t = smoothstep(0.0, 1.0, uMorph);
      float oneMinusT = 1.0 - t;
      vec3 worldPosition = oneMinusT * oneMinusT * wPos1.xyz + 
                           2.0 * oneMinusT * t * posExp + 
                           t * t * wPos2.xyz;

      // Mouse gravitation: dynamically scaled for camera distance and geometry scale
      // Hero 1 (camera dist 11, r=5): radius 2.5, force 0.9
      // Hero 2: reduced to 25% (radius 7.5, force 4.0) for gentle, refined cosmic deflection
      float mouseRadius = mix(2.5, 7.5, smoothstep(0.2, 0.85, uMorph));
      float pushStrength = mix(0.9, 4.0, smoothstep(0.2, 0.85, uMorph));

      float dist = distance(worldPosition, uMouse3D);
      float force = smoothstep(mouseRadius, 0.0, dist); 
      if(force > 0.0) {
        vec3 pushDir = normalize(worldPosition - uMouse3D);
        vec3 ringUp = mix(vec3(0.0, 1.0, 0.0), vec3(-0.25, 0.94, 0.22), smoothstep(0.2, 0.85, uMorph));
        vec3 swirl = cross(pushDir, normalize(ringUp));
        vec3 combinedPush = mix(pushDir, swirl, 0.40);
        combinedPush += ringUp * 0.15; 
        worldPosition += combinedPush * force * pushStrength; 
      }

      // Moon gravitation (only during Hero 1 - halved impact)
      if (uMorph < 0.25) {
        float moonDist = distance(worldPosition, uMoon3D);
        float moonForce = smoothstep(1.3, 0.0, moonDist) * (1.0 - uMorph * 4.0);
        if(moonForce > 0.0) {
          vec3 moonPush = normalize(worldPosition - uMoon3D);
          vec3 swirl = cross(moonPush, vec3(0.0, 1.0, 0.0));
          worldPosition += mix(moonPush, swirl, 0.35) * moonForce * 0.75;
        }
      }
      
      vec4 mvPosition = viewMatrix * vec4(worldPosition, 1.0);

      // Size scale: fine diamond-dust glitter in Hero 2
      float sizeScale = mix(40.0, 105.0, t);
      gl_PointSize = aSize * (sizeScale / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 1.8, 14.0);

      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const pFragmentShader = `
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float dist = length(xy);
      if(dist > 0.5) discard; 
      float baseAlpha = smoothstep(0.5, 0.05, dist);
      vec3 finalColor = mix(vColor, vec3(1.0), smoothstep(0.3, 0.0, dist) * 0.7);
      gl_FragColor = vec4(finalColor, baseAlpha * vAlpha * 0.95);
    }
  `;

  const pMaterial = new THREE.ShaderMaterial({
    vertexShader: pVertexShader,
    fragmentShader: pFragmentShader,
    uniforms: {
      uTime: { value: 0.0 },
      uMorph: { value: 0.0 },
      uTrackMatrix: { value: new THREE.Matrix4() },
      uRingsMatrix: { value: new THREE.Matrix4() },
      uMouse3D: { value: new THREE.Vector3(999, 999, 999) },
      uMoon3D: { value: new THREE.Vector3(999, 999, 999) }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(pGeometry, pMaterial);
  scene.add(particleSystem);

  const invisiblePlaneGeo = new THREE.PlaneGeometry(100, 100);
  const invisiblePlaneMat = new THREE.MeshBasicMaterial({ visible: false });
  const invisiblePlane = new THREE.Mesh(invisiblePlaneGeo, invisiblePlaneMat);
  invisiblePlane.rotation.copy(trackGroup.rotation);
  scene.add(invisiblePlane);

  // Accurate coplanar raycast mesh for Hero 2 ring particles
  const invisibleRingPlaneGeo = new THREE.PlaneGeometry(250, 250);
  const invisibleRingPlaneMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
  const invisibleRingPlane = new THREE.Mesh(invisibleRingPlaneGeo, invisibleRingPlaneMat);
  invisibleRingPlane.rotation.x = Math.PI / 2; // Flat in X-Z plane of ringsTiltGroup
  ringsTiltGroup.add(invisibleRingPlane);

  // =========================================================================
  // 10. INTERACTION STATE & SINGLE CLICK / SCROLL TRIGGER
  // =========================================================================
  let isDraggingMoon = false;
  const raycaster = new THREE.Raycaster();
  const mouseVector = new THREE.Vector2();
  const dragPlane = new THREE.Plane();
  const planeIntersect = new THREE.Vector3();
  let mouseX = 0, mouseY = 0;
  let mouseSmoothX = 0, mouseSmoothY = 0;

  // Seamless cinematic travel state
  let travelProgress = 0.0; // 0.0 = Hero 1, 1.0 = Hero 2
  let targetTravelProgress = 0.0;

  // DOM elements for bulletproof screen locking
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  let isLockedInHero = true;
  let scene2ArrivalTime = 0;
  let isTransitioningDownstream = false;

  const cosmicWrapper = document.getElementById('cosmicToggleWrapper');
  const mainHeader = document.getElementById('main-header');

  function updateFloatingControlsVisibility() {
    const isPastHero = window.scrollY > 40 || !isLockedInHero;

    // Navbar black box ONLY from Section 2 onwards; transparent in Hero 1 & Hero 2
    if (mainHeader) {
      if (isPastHero) {
        mainHeader.classList.add('scrolled');
      } else {
        mainHeader.classList.remove('scrolled');
      }
    }

    // Floating Planetary Orbit button visible only in Hero 1 & Hero 2
    if (cosmicWrapper) {
      if (isPastHero) {
        cosmicWrapper.style.opacity = '0';
        cosmicWrapper.style.pointerEvents = 'none';
        cosmicWrapper.style.transform = 'translateY(-12px)';
      } else {
        cosmicWrapper.style.opacity = '1';
        cosmicWrapper.style.pointerEvents = 'auto';
        cosmicWrapper.style.transform = 'translateY(0)';
      }
    }
  }

  function lockHero() {
    isLockedInHero = true;
    htmlEl.classList.add('hero-locked');
    bodyEl.classList.add('hero-locked');
    updateFloatingControlsVisibility();
  }

  function unlockHero() {
    isLockedInHero = false;
    htmlEl.classList.remove('hero-locked');
    bodyEl.classList.remove('hero-locked');
    updateFloatingControlsVisibility();
  }

  // Initial state check — support direct hash deep linking (e.g. #what-we-cover)
  const initialHash = window.location.hash;
  if (initialHash && initialHash.length > 1 && initialHash !== '#model') {
    unlockHero();
    setTimeout(() => {
      const targetElement = document.querySelector(initialHash);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 200);
  } else if (window.scrollY < 80) {
    lockHero();
    window.scrollTo(0, 0);
  } else {
    unlockHero();
  }


  // Single Click Trigger: "Planetary Orbit" / "Return Home" toggle button
  const startCosmicTravelBtn = document.getElementById('startCosmicTravelBtn');
  const cosmicBtnText = document.getElementById('cosmicBtnText');
  if (startCosmicTravelBtn) {
    startCosmicTravelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // If currently scrolled down to downstream sections, scroll to top and lock hero
      if (!isLockedInHero || window.scrollY > 50) {
        lockHero();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        targetTravelProgress = 1.0;
        return;
      }
      targetTravelProgress = targetTravelProgress === 0.0 ? 1.0 : 0.0;
      if (targetTravelProgress === 0.0) scene2ArrivalTime = 0;
    });
  }

  // Return to Hero 1: header logo click
  const logoLink = document.querySelector('header a[aria-label="Gravino Home"]');
  if (logoLink) {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      lockHero();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      targetTravelProgress = 0.0;
      scene2ArrivalTime = 0;
    });
  }

  // Nav menu links (The Model, Portfolio, etc.): unlock hero and smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#' || targetId.length <= 1) return;
      if (targetId === '#model') {
        e.preventDefault();
        lockHero();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        targetTravelProgress = 1.0;
        scene2ArrivalTime = Date.now();
        return;
      }
      let targetEl = document.querySelector(targetId);
      if (!targetEl && targetId === '#why-embedded') {
        targetEl = document.getElementById('proof-of-work') || document.getElementById('what-we-cover');
      }
      if (targetEl) {
        e.preventDefault();
        isTransitioningDownstream = true;
        unlockHero();
        targetEl.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isTransitioningDownstream = false;
        }, 1200);
      }
    });
  });

  // Teardown buttons: unlock hero and smooth scroll to partner or contact
  document.querySelectorAll('.trigger-teardown').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      isTransitioningDownstream = true;
      unlockHero();
      const contactSection = document.getElementById('teardown') || document.getElementById('contact') || document.getElementById('what-we-cover');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        isTransitioningDownstream = false;
      }, 1200);
    });
  });

  // Smooth canvas & cosmic particle fade-out controller
  const canvasContainer = document.getElementById('canvas-container');
  const cosmicBgEl = document.querySelector('div[style*="hero-bg.jpg"]');

  // Re-lock hero when user scrolls back up to the top from downstream; fade particles smoothly
  window.addEventListener('scroll', () => {
    updateFloatingControlsVisibility();

    const scrollY = window.scrollY;

    // Smoothly dissolve the 3D particle canvas as user scrolls into Section 2
    if (canvasContainer) {
      if (scrollY <= 0) {
        canvasContainer.style.opacity = '1';
      } else {
        // Soft, organic dissipation over 420px of scroll
        const fade = Math.max(0, 1 - (scrollY / 420));
        canvasContainer.style.opacity = fade.toFixed(3);
      }
    }

    // Softly fade fixed cosmic nebula background with scroll
    if (cosmicBgEl) {
      if (scrollY <= 0) {
        cosmicBgEl.style.opacity = '0.45';
      } else {
        const bgFade = Math.max(0, 0.45 * (1 - (scrollY / 380)));
        cosmicBgEl.style.opacity = bgFade.toFixed(3);
      }
    }

    if (isTransitioningDownstream) return;
    if (scrollY <= 10 && !isLockedInHero) {
      lockHero();
      window.scrollTo(0, 0);
      targetTravelProgress = 1.0;
    }
  });

  // =========================================================================
  // FLUID HERO SCROLL SYSTEM (ZERO-HOLD, EXACT PLACE ALIGNMENT):
  // - Scene 1: Scroll down initiates cinematic travel to Scene 2.
  // - Scene 2: Scroll up returns to Scene 1.
  //   Downward scroll immediately and fluidly glides directly to Section 2 in the perfect position!
  // =========================================================================
  window.addEventListener('wheel', (e) => {
    if (isTransitioningDownstream) {
      return;
    }

    if (isLockedInHero) {
      e.preventDefault();

      // --- SCENE 1 ---
      if (targetTravelProgress === 0.0) {
        if (e.deltaY > 6) {
          targetTravelProgress = 1.0;
        }
        return;
      }

      // --- SCENE 2 ---
      if (targetTravelProgress === 1.0) {
        // Scroll UP -> return to Scene 1
        if (e.deltaY < -8) {
          targetTravelProgress = 0.0;
          return;
        }

        // Downward scroll from Scene 2: IMMEDIATELY glides to Section 2 (no hold/delay!)
        if (e.deltaY > 4 && travelProgress >= 0.70) {
          isTransitioningDownstream = true;
          unlockHero();
          const nextSection = document.getElementById('what-we-cover');
          if (nextSection) {
            const targetY = nextSection.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: targetY, behavior: 'smooth' });
          }
          setTimeout(() => {
            isTransitioningDownstream = false;
          }, 650);
        }
      }
    }
  }, { passive: false });

  // Touch swipe support for mobile/tablets
  let touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    if (!isLockedInHero || isTransitioningDownstream) return;
    const deltaY = touchStartY - e.changedTouches[0].clientY;

    if (targetTravelProgress === 0.0) {
      if (deltaY > 25) {
        targetTravelProgress = 1.0;
      }
    } else if (targetTravelProgress === 1.0) {
      if (deltaY < -20) {
        targetTravelProgress = 0.0;
      } else if (deltaY > 20 && travelProgress >= 0.70) {
        isTransitioningDownstream = true;
        unlockHero();
        const nextSection = document.getElementById('what-we-cover');
        if (nextSection) {
          const targetY = nextSection.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
        setTimeout(() => {
          isTransitioningDownstream = false;
        }, 650);
      }
    }
  }, { passive: true });

  // =========================================================================
  // SVG LEADER LINES SETUP: Connects fixed caption boxes to 3D rings
  // 2 on Left of planet, 2 on Right of planet
  // =========================================================================
  const ringLinesSvg = document.getElementById('ring-lines-svg');
  const captionBoxes = [
    document.getElementById('caption-box-1'),
    document.getElementById('caption-box-2'),
    document.getElementById('caption-box-3'),
    document.getElementById('caption-box-4')
  ];
  const leaderLines = [
    document.getElementById('leader-line-1'),
    document.getElementById('leader-line-2'),
    document.getElementById('leader-line-3'),
    document.getElementById('leader-line-4')
  ];
  const ringDots = [
    document.getElementById('ring-dot-1'),
    document.getElementById('ring-dot-2'),
    document.getElementById('ring-dot-3'),
    document.getElementById('ring-dot-4')
  ];

  // 4 target rings configuration: 2 on left arc, 2 on right arc
  const ringConfigs = [
    { r: 12.0, baseAngle: Math.PI * 0.72, color: '#ffffff', side: 'left' },  // 1. Business Communication (Upper Left)
    { r: 12.8, baseAngle: Math.PI * 1.05, color: '#24c1ff', side: 'left' },  // 2. Brand & Identity (Lower Left)
    { r: 13.7, baseAngle: Math.PI * 0.12, color: '#cc4ec7', side: 'right' }, // 3. Marketing & Growth (Upper Right)
    { r: 14.6, baseAngle: Math.PI * 0.28, color: '#7642cf', side: 'right' }  // 4. Experience & Engagement (Lower Right)
  ];

  captionBoxes.forEach((box, idx) => {
    if (!box) return;
    box.addEventListener('mouseenter', () => {
      const line = leaderLines[idx];
      const dot = ringDots[idx];
      if (line) {
        line.setAttribute('stroke-width', '2.2');
        line.setAttribute('stroke', ringConfigs[idx].color);
        line.removeAttribute('stroke-dasharray');
      }
      if (dot) {
        dot.setAttribute('r', '5.5');
      }
    });
    box.addEventListener('mouseleave', () => {
      const line = leaderLines[idx];
      const dot = ringDots[idx];
      if (line) {
        line.setAttribute('stroke-width', '1.2');
        const dimColors = [
          'rgba(255,255,255,0.40)',
          'rgba(36,193,255,0.50)',
          'rgba(204,78,199,0.50)',
          'rgba(118,66,207,0.50)'
        ];
        line.setAttribute('stroke', dimColors[idx]);
        line.setAttribute('stroke-dasharray', '4 3');
      }
      if (dot) {
        dot.setAttribute('r', '3.5');
      }
    });
  });

  const tempRingVector = new THREE.Vector3();
  function updateLeaderLines(elapsedTime = 0) {
    if (!ringLinesSvg) return;
    if (travelProgress < 0.65 || window.scrollY > 120) {
      ringLinesSvg.style.opacity = '0';
      ringLinesSvg.style.pointerEvents = 'none';
      return;
    }
    const linesOp = Math.max(0, Math.min(1.0, (travelProgress - 0.70) / 0.25));
    const scrollFade = Math.max(0, 1.0 - (window.scrollY / 100));
    const finalOp = linesOp * scrollFade;
    ringLinesSvg.style.opacity = finalOp.toFixed(3);
    ringLinesSvg.style.pointerEvents = finalOp > 0.1 ? 'auto' : 'none';

    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < 4; i++) {
      const box = captionBoxes[i];
      const line = leaderLines[i];
      const dot = ringDots[i];
      if (!box || !line || !dot) continue;

      const rect = box.getBoundingClientRect();
      const cfg = ringConfigs[i];

      // Dot tracks along the 3D ring line with subtle travel along ring circumference
      const trackAngle = cfg.baseAngle + Math.sin(elapsedTime * 0.45 + i * 1.6) * 0.05;
      tempRingVector.set(cfg.r * Math.cos(trackAngle), 0, cfg.r * Math.sin(trackAngle));
      ringsTiltGroup.localToWorld(tempRingVector);
      tempRingVector.project(camera);

      const x2 = (tempRingVector.x * 0.5 + 0.5) * w;
      const y2 = (-(tempRingVector.y * 0.5) + 0.5) * h;

      // Smart edge anchor: connects seamlessly to whichever side faces the ring dot
      const boxCenterX = rect.left + rect.width * 0.5;
      const x1 = (x2 >= boxCenterX) ? rect.right : rect.left;
      const y1 = rect.top + rect.height * 0.5;

      const midX = x1 + (x2 - x1) * 0.45;
      line.setAttribute('d', `M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${midX.toFixed(1)} ${y1.toFixed(1)}, ${midX.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}`);
      dot.setAttribute('cx', x2.toFixed(1));
      dot.setAttribute('cy', y2.toFixed(1));
    }
  }


  window.addEventListener('mousedown', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseVector.set(mouseX, mouseY);

    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObject(moon);
    if (intersects.length > 0) {
      isDraggingMoon = true;
      dragPlane.setFromNormalAndCoplanarPoint(
        camera.getWorldDirection(new THREE.Vector3()).negate(),
        moon.position
      );
    }
  });

  window.addEventListener('mouseup', () => { isDraggingMoon = false; });

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    mouseVector.set(mouseX, mouseY);

    if (isDraggingMoon) {
      raycaster.setFromCamera(mouseVector, camera);
      raycaster.ray.intersectPlane(dragPlane, planeIntersect);
    }
  });

  document.addEventListener('mouseleave', () => {
    pMaterial.uniforms.uMouse3D.value.set(999, 999, 999);
    isDraggingMoon = false;
  });

  // Sync with page scroll position when user scrolls down beyond the hero
  window.addEventListener('scroll', () => {
    const wrapper = document.getElementById('hero-pinned-wrapper');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const totalScroll = wrapper.offsetHeight - window.innerHeight;
    if (totalScroll <= 0) return;
    const scrollP = Math.max(0, Math.min(1, -rect.top / totalScroll));

    if (scrollP > 0.05 && targetTravelProgress === 0.0) {
      targetTravelProgress = 1.0;
    }
  }, { passive: true });



  // =========================================================================
  // 12. ANIMATION LOOP
  // =========================================================================
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Smooth continuous cinematic interpolation between scenes (single click / scroll)
    // 2x longer transition when traveling from Scene 1 to Scene 2 (lerpRate = 0.019)
    const lerpRate = targetTravelProgress === 0.0 ? 0.045 : 0.019;
    travelProgress += (targetTravelProgress - travelProgress) * lerpRate;

    // Crisp snapping at boundaries
    if (targetTravelProgress === 1.0 && travelProgress > 0.998) {
      travelProgress = 1.0;
    } else if (targetTravelProgress === 0.0 && travelProgress < 0.002) {
      travelProgress = 0.0;
    }

    // Shader uniforms
    pMaterial.uniforms.uTime.value = elapsedTime;
    pMaterial.uniforms.uMorph.value = travelProgress;
    iridescentMaterial.uniforms.uTime.value = elapsedTime * 2.0;

    // Update UI Opacities
    const hero1UI = document.getElementById('hero1-ui');
    const hero2UI = document.getElementById('hero2-ui');

    if (hero1UI) {
      let h1Op;
      if (targetTravelProgress === 1.0) {
        // Leaving Scene 1: fade out quickly
        h1Op = Math.max(0, 1.0 - travelProgress * 3.5);
      } else {
        // Returning to Scene 1: smoothly and promptly fade in as camera returns
        h1Op = Math.max(0, Math.min(1.0, (0.75 - travelProgress) / 0.60));
      }
      hero1UI.style.opacity = h1Op.toFixed(3);
      hero1UI.style.pointerEvents = h1Op > 0.3 ? 'auto' : 'none';
    }

    if (hero2UI) {
      let h2Op;
      if (targetTravelProgress === 1.0) {
        h2Op = Math.max(0, Math.min(1.0, (travelProgress - 0.55) / 0.35));
      } else {
        h2Op = Math.max(0, (travelProgress - 0.40) / 0.50);
      }
      // Smoothly fade out hero 2 UI as user scrolls into Section 2
      const scrollFade = Math.max(0, 1.0 - (window.scrollY / 120));
      h2Op = h2Op * scrollFade;
      hero2UI.style.opacity = h2Op.toFixed(3);
      hero2UI.style.pointerEvents = h2Op > 0.3 ? 'auto' : 'none';
    }

    if (cosmicBtnText) {
      cosmicBtnText.textContent = targetTravelProgress === 0.0 ? 'Planetary Orbit' : 'Return Home';
    }

    // --- HERO 1: SPHERE ROTATION ---
    sphereGroup.rotation.y = elapsedTime * 0.60;
    sphereGroup.rotation.x = elapsedTime * 0.40;
    sphereGroup.rotation.z = elapsedTime * 0.20;

    // --- HERO 1: MOON ORBIT & BEHIND-SPHERE BLUR ---
    const orbitRadius = 2.4;
    const orbitSpeed = 0.38;
    const angle = elapsedTime * orbitSpeed;
    const orbitX = Math.cos(angle) * orbitRadius;
    const orbitY = Math.sin(angle * 0.8) * orbitRadius * 0.75;
    const orbitZ = Math.sin(angle) * orbitRadius;

    if (isDraggingMoon) {
      moon.position.lerp(planeIntersect, 0.08);
    } else {
      moon.position.lerp(new THREE.Vector3(orbitX, orbitY, orbitZ), 0.05);
    }
    moon.rotation.y = elapsedTime * 1.8;
    moon.rotation.x = elapsedTime * 0.8;

    // =======================================================================
    // CINEMATIC COSMIC TRAVEL CHOREOGRAPHY
    // =======================================================================

    // 1. Hero 1 Glass Planet: plunges deep into Z axis (-75) & scales to 0
    if (travelProgress < 0.45) {
      const p1 = travelProgress / 0.45;
      sphereGroup.position.z = -p1 * 75.0; // Accelerates away into deep space!
      sphereGroup.position.x = -p1 * 10.0;
      sphereGroup.scale.setScalar(Math.max(0.0001, 1.0 - p1));

      moonMaterial.opacity = Math.max(0, 1.0 - p1 * 2.5);
      moon.scale.setScalar(Math.max(0.0001, 1.0 - p1));
    } else {
      sphereGroup.scale.setScalar(0.0001);
      moonMaterial.opacity = 0.0;
    }

    // 2. Hero 2 Planet: 100% hidden in Scene 1!
    // Emerges from the deep distance (z = -70) during travel, then settles in bottom-right (18, -6.5, 0)
    if (travelProgress < 0.20) {
      planetGroup.visible = false; // Completely hidden in Scene 1!
    } else {
      planetGroup.visible = true; // Emerges during travel!
      const p2 = Math.min(1.0, (travelProgress - 0.20) / 0.80);
      const easeArrival = smoothstep(0.0, 1.0, p2);

      // Locked position in bottom right (18, -6.5, 0)
      const startZ = -70.0;
      const finalZ = 0.0;
      const currentZ = THREE.MathUtils.lerp(startZ, finalZ, easeArrival);
      // 15% reduction in Hero 2 planet and halo ring sizes (0.85 final scale)
      const currentScale = THREE.MathUtils.lerp(0.153, 0.85, easeArrival);
      planetGroup.scale.setScalar(currentScale);
    }

    // 3. Smooth Camera Flight
    const camEase = smoothstep(0.15, 0.90, travelProgress);

    // Smooth mouse parallax (Hero 1 only)
    mouseSmoothX += (mouseX - mouseSmoothX) * 0.05;
    mouseSmoothY += (mouseY - mouseSmoothY) * 0.05;

    const h1CamTargetX = baseCameraX + mouseSmoothX * 1.5;
    const h1CamTargetY = 3 + mouseSmoothY * 1.5;
    const h1Cam = new THREE.Vector3(h1CamTargetX, h1CamTargetY, window.innerWidth < 968 ? 12 : 10);

    // Scene 2 Camera: 100% LOCKED in position and angle (zero creep, zero angle drift)
    const h2Cam = new THREE.Vector3(hero2CamPos.x, hero2CamPos.y, hero2CamPos.z);

    const currentCamPos = new THREE.Vector3().lerpVectors(h1Cam, h2Cam, camEase);
    camera.position.copy(currentCamPos); // Synchronized directly with travelProgress!

    const currentLookAt = new THREE.Vector3().lerpVectors(hero1LookAt, hero2LookAt, camEase);
    camera.lookAt(currentLookAt);
    camera.updateMatrixWorld(true);

    // Behind-sphere blur detection for moon
    if (travelProgress < 0.25) {
      const camPosNorm = camera.position.clone().normalize();
      const moonDot = moon.position.dot(camPosNorm);
      const isBehind = moonDot < 0;
      const moonProjection = camPosNorm.clone().multiplyScalar(moonDot);
      const perpDist = moon.position.clone().sub(moonProjection).length();
      const sphereRadius = 1.5;
      const fadeRadius = sphereRadius * 1.6;

      let targetBlur = 0.0;
      if (isBehind && perpDist < fadeRadius) {
        targetBlur = Math.pow(1.0 - (perpDist / fadeRadius), 2.0);
        targetBlur = Math.min(targetBlur, 1.0);
      }
      currentBlurFactor += (targetBlur - currentBlurFactor) * 0.1;
      if (currentBlurFactor < 0.01) currentBlurFactor = 0.0;

      moonMaterial.opacity = (1.0 - currentBlurFactor * 0.85) * (1.0 - travelProgress * 4.0);
      moonMaterial.roughness = moonDefaults.roughness + currentBlurFactor * 0.28;
      moonMaterial.bumpScale = moonDefaults.bumpScale * (1.0 - currentBlurFactor);
      pMaterial.uniforms.uMoon3D.value.copy(moon.position);
    }

    // Hero 2: Planet and Rings rotate continuously in opposite directions (doubled speed for planet only)
    planet.rotation.y = -Math.PI / 4 + elapsedTime * 0.070;   // Counter-clockwise on tilted axis (doubled)
    ringsSystem.rotation.y = -elapsedTime * 0.040;            // Clockwise around ring plane (kept same)

    // Update world matrices for GPU shader
    trackGroup.updateMatrixWorld(true);
    ringsTiltGroup.updateMatrixWorld(true);
    ringsSystem.updateMatrixWorld(true);
    pMaterial.uniforms.uTrackMatrix.value.copy(trackGroup.matrixWorld);
    pMaterial.uniforms.uRingsMatrix.value.copy(ringsSystem.matrixWorld);

    // Mouse 3D raycasting
    raycaster.setFromCamera(mouseVector, camera);
    if (travelProgress < 0.35) {
      const hits = raycaster.intersectObject(invisiblePlane);
      if (hits.length > 0) pMaterial.uniforms.uMouse3D.value.copy(hits[0].point);
    } else {
      const hits = raycaster.intersectObject(invisibleRingPlane);
      if (hits.length > 0) {
        pMaterial.uniforms.uMouse3D.value.copy(hits[0].point);
      }
    }

    // Render directly on transparent canvas
    renderer.render(scene, camera);

    // Update SVG leader lines: fixed caption boxes on left -> marker dots tracking along 3D rings
    updateLeaderLines(elapsedTime);
  }

  function smoothstep(min, max, value) {
    const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
    return x * x * (3 - 2 * x);
  }

  animate();

  // =========================================================================
  // 13. RESIZE HANDLER
  // =========================================================================
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    baseCameraX = w < 968 ? 0 : 3.5;
    hero1CamPos.x = baseCameraX;
    hero1LookAt.x = baseCameraX;
  });

}
