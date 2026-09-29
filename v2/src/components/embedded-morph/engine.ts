/* ===========================================================================
 * The particle engine behind "What embedded means" on /why-gravino.
 * ---------------------------------------------------------------------------
 * Ported from gravino_embedded_particles_pages.html (the client's file,
 * 2026-09-29). One cloud of 6,500 particles holds four shapes and morphs
 * between them:
 *
 *   0  gears        We learn your business once
 *   1  clock        We work to your calendar
 *   2  planet+moons One contact for every format
 *   3  3D pie       Sized to the work
 *
 * Every shape generator, the seeded random, the colour ranges, the gather-
 * and-reform transition, the living gears / clock hands / orbiting moons, and
 * the camera are kept exactly as written. What changed is only how it is
 * hosted:
 *
 *   - three comes from npm (0.184) instead of the jsdelivr CDN.
 *   - Sized from its container with a ResizeObserver, not window.inner*.
 *   - mount() returns { choose, dispose }: the React component drives state
 *     and the page can tear the renderer down (context released).
 *   - Rendering pauses while the canvas is off screen.
 *   - Reduced motion: shapes switch without the transition and nothing moves
 *     on its own; a single frame is drawn per change.
 *   - performance.now() replaces the deprecated THREE.Clock.
 * ======================================================================== */

import * as THREE from "three";

export type Morph = { choose: (i: number) => void; dispose: () => void };

export function mount(container: HTMLElement, opts: { still: boolean }): Morph {
  const { still } = opts;
  let width = container.clientWidth || 1;
  let height = container.clientHeight || 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.3);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  /* ---- the source's particle model, unchanged ---------------------------- */
  const N = 6500;
  const palette = [new THREE.Color(0xffffff), new THREE.Color(0x4d8dff), new THREE.Color(0x9b55ff)];
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  const targets = Array.from({ length: 4 }, () => new Float32Array(N * 3));
  const rnd = (() => {
    let s = 184729;
    return () => {
      s = (s * 1664525 + 1013904223) >>> 0;
      return s / 4294967296;
    };
  })();
  const pick = () => {
    const r = rnd();
    return r < 0.68 ? palette[0] : r < 0.86 ? palette[1] : palette[2];
  };
  const setP = (a: Float32Array, i: number, x: number, y: number, z: number) => {
    a[i * 3] = x;
    a[i * 3 + 1] = y;
    a[i * 3 + 2] = z;
  };
  const TAU = Math.PI * 2;

  function makePie(out: Float32Array) {
    let p = 0;
    const outer = 1.72, inner = 0.04, depth = 0.62, gap = 0.075;
    const slices = [
      { a0: -Math.PI / 2 + gap, a1: -Math.PI / 2 + Math.PI * 1.62 - gap, zOff: 0 },
      { a0: -Math.PI / 2 + Math.PI * 1.62 + gap, a1: -Math.PI / 2 + Math.PI * 2 - gap, zOff: 0.1 },
    ];
    const addSlice = (sl: (typeof slices)[number], count: number) => {
      const frontBack = Math.floor(count * 0.56), side = Math.floor(count * 0.24), rim = Math.floor(count * 0.2);
      for (let i = 0; i < frontBack; i++) {
        const a = sl.a0 + (sl.a1 - sl.a0) * rnd();
        const r = Math.sqrt(inner * inner + rnd() * (outer * outer - inner * inner));
        const z = (i % 2 === 0 ? depth / 2 : -depth / 2) + sl.zOff + (rnd() - 0.5) * 0.025;
        setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, z);
      }
      for (let i = 0; i < side; i++) {
        const a = sl.a0 + (sl.a1 - sl.a0) * rnd();
        const z = -depth / 2 + depth * rnd() + sl.zOff;
        setP(out, p++, Math.cos(a) * outer + (rnd() - 0.5) * 0.018, Math.sin(a) * outer + (rnd() - 0.5) * 0.018, z);
      }
      for (let i = 0; i < rim; i++) {
        const edge = i % 3;
        let a: number, r: number;
        if (edge === 0) { a = sl.a0; r = inner + rnd() * (outer - inner); }
        else if (edge === 1) { a = sl.a1; r = inner + rnd() * (outer - inner); }
        else { a = sl.a0 + (sl.a1 - sl.a0) * rnd(); r = outer; }
        const z = -depth / 2 + depth * rnd() + sl.zOff;
        setP(out, p++, Math.cos(a) * r + (rnd() - 0.5) * 0.025, Math.sin(a) * r + (rnd() - 0.5) * 0.025, z);
      }
    };
    addSlice(slices[0], 4700);
    addSlice(slices[1], 1450);
    while (p < N) {
      const a = rnd() * TAU, r = outer + 0.06 + Math.pow(rnd(), 2) * 0.28;
      setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, (rnd() - 0.5) * 0.55);
    }
  }

  type Hand = { start: number; count: number; baseAngle: number; type: string; local: number[][]; animAngle?: number };
  const clockHandMeta: Hand[] = [];
  function makeClock(out: Float32Array) {
    let p = 0;
    for (let z = -0.45; z <= 0.45; z += 0.075)
      for (let i = 0; i < 220; i++) {
        const a = rnd() * TAU, r = 1.72 + (rnd() - 0.5) * 0.055;
        setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, z + (rnd() - 0.5) * 0.025);
      }
    for (let i = 0; i < 1550; i++) {
      const a = rnd() * TAU, r = Math.sqrt(rnd()) * 1.48;
      setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, (rnd() - 0.5) * 0.22);
    }
    for (let n = 0; n < 12; n++) {
      const a = (n * TAU) / 12 - Math.PI / 2;
      for (let j = 0; j < 85; j++) {
        const r = 1.25 + (rnd() - 0.5) * 0.16;
        setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, 0.28 + (rnd() - 0.5) * 0.04);
      }
    }
    const addHand = (len: number, w: number, c: number, ang: number, type: string) => {
      const start = p, local: number[][] = [];
      for (let i = 0; i < c; i++) {
        const t = i / (c - 1), x = t * len + (rnd() - 0.5) * 0.018, y = (rnd() - 0.5) * w;
        local.push([x, y]);
        const X = x * Math.cos(ang) - y * Math.sin(ang), Y = x * Math.sin(ang) + y * Math.cos(ang);
        setP(out, p++, X, Y, 0.34 + (rnd() - 0.5) * 0.03);
      }
      clockHandMeta.push({ start, count: c, baseAngle: ang, type, local });
    };
    addHand(1.02, 0.045, 180, -Math.PI / 3, "minute");
    addHand(0.7, 0.065, 150, (Math.PI * 5) / 6 - Math.PI / 18, "hour");
    addHand(1.22, 0.025, 170, -0.35, "second");
    for (let i = 0; i < 180; i++) {
      const a = rnd() * TAU, r = Math.sqrt(rnd()) * 0.14;
      setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, 0.42);
    }
    while (p < N) {
      const a = rnd() * TAU, r = 1.55 + Math.pow(rnd(), 2) * 0.5;
      setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, (rnd() - 0.5) * 0.5);
    }
  }

  type Gear = { start: number; count: number; cx: number; cy: number; cz: number; speed: number; phase: number; local: number[][] };
  const gearMeta: Gear[] = [];
  function makeGears(out: Float32Array) {
    let p = 0;
    const makeGear = (cx: number, cy: number, cz: number, R: number, teeth: number, count: number, speed: number, phase: number) => {
      const start = p, local: number[][] = [];
      const hole = R * 0.34, body = R * 0.78, tooth = R, toothWidth = 0.34;
      const radiusAt = (a: number) => {
        const q = (((a + TAU / (2 * teeth)) % (TAU / teeth)) + TAU / teeth) % (TAU / teeth) - TAU / (2 * teeth);
        return Math.abs(q) < (TAU / teeth) * toothWidth ? tooth : body;
      };
      let made = 0;
      while (made < count) {
        const a = rnd() * TAU;
        const r = hole + Math.sqrt(rnd()) * (tooth - hole);
        if (r > radiusAt(a)) continue;
        const z = (rnd() - 0.5) * R * 0.34;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        local.push([x, y, z]);
        setP(out, p++, cx + x, cy + y, cz + z);
        made++;
      }
      const ringN = Math.floor(count * 0.2);
      for (let i = 0; i < ringN; i++) {
        const a = (i / ringN) * TAU, r = hole + (rnd() - 0.5) * 0.035, z = (rnd() - 0.5) * R * 0.4;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        local.push([x, y, z]);
        setP(out, p++, cx + x, cy + y, cz + z);
      }
      for (let i = 0; i < Math.floor(count * 0.16); i++) {
        const a = rnd() * TAU, r = radiusAt(a) - rnd() * 0.035, z = (rnd() < 0.5 ? -1 : 1) * R * 0.17;
        const x = Math.cos(a) * r, y = Math.sin(a) * r;
        local.push([x, y, z]);
        setP(out, p++, cx + x, cy + y, cz + z);
      }
      gearMeta.push({ start, count: local.length, cx, cy, cz, speed, phase, local });
    };
    makeGear(-0.7, 0.02, 0.02, 1.224, 12, 1650, 0.72, 0);
    makeGear(0.86, 0.72, 0.08, 0.864, 10, 1050, -0.92, 0.35);
    makeGear(0.86, -0.65, 0.14, 0.672, 9, 800, 0.98, 1.1);
    while (p < N) {
      const g = rnd();
      const cx = g < 0.52 ? -0.7 : 0.86;
      const cy = g < 0.52 ? 0.02 : g < 0.78 ? 0.72 : -0.65;
      const R = g < 0.52 ? 1.224 : g < 0.78 ? 0.864 : 0.672;
      const teeth = g < 0.52 ? 12 : g < 0.78 ? 10 : 9;
      const hole = R * 0.34, body = R * 0.78, tooth = R;
      const a = rnd() * TAU;
      const q = (((a + TAU / (2 * teeth)) % (TAU / teeth)) + TAU / teeth) % (TAU / teeth) - TAU / (2 * teeth);
      const maxR = Math.abs(q) < (TAU / teeth) * 0.34 ? tooth : body;
      const r = hole + Math.sqrt(rnd()) * (maxR - hole);
      setP(out, p++, cx + Math.cos(a) * r, cy + Math.sin(a) * r, (rnd() - 0.5) * R * 0.34);
    }
  }

  type Moon = { start: number; count: number; orbit: number; tilt: number; phase: number; speed: number; local: number[][] };
  const planetMoonMeta: Moon[] = [];
  function makePlanet(out: Float32Array) {
    let p = 0;
    for (let i = 0; i < 3100; i++) {
      const th = rnd() * TAU, ph = Math.acos(2 * rnd() - 1), r = 1.02 + (rnd() - 0.5) * 0.035;
      setP(out, p++, r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
    }
    for (let i = 0; i < 650; i++) {
      const th = rnd() * TAU, ph = Math.acos(2 * rnd() - 1), r = 0.84 + rnd() * 0.13;
      setP(out, p++, r * Math.sin(ph) * Math.cos(th), r * Math.cos(ph), r * Math.sin(ph) * Math.sin(th));
    }
    const moon = (rad: number, orbit: number, tilt: number, phase: number, speed: number) => {
      const start = p, local: number[][] = [];
      for (let i = 0; i < 330; i++) {
        const th = rnd() * TAU, ph = Math.acos(2 * rnd() - 1), r = rad + (rnd() - 0.5) * rad * 0.09;
        const x = r * Math.sin(ph) * Math.cos(th), y = r * Math.cos(ph), z = r * Math.sin(ph) * Math.sin(th);
        local.push([x, y, z]);
        const ox = orbit * Math.cos(phase), oy = orbit * Math.sin(phase) * Math.sin(tilt), oz = orbit * Math.sin(phase) * Math.cos(tilt);
        setP(out, p++, x + ox, y + oy, z + oz);
      }
      planetMoonMeta.push({ start, count: 330, orbit, tilt, phase, speed, local });
    };
    moon(0.25, 1.34, 0.18, 0.2, 0.42);
    moon(0.2, 1.55, -0.28, 2, -0.31);
    moon(0.23, 1.78, 0.38, 3.7, 0.22);
    moon(0.17, 2, 0.48, 5.1, -0.16);
    while (p < N) {
      const a = rnd() * TAU, r = 2.1 + Math.pow(rnd(), 2) * 0.45;
      setP(out, p++, Math.cos(a) * r, Math.sin(a) * r, (rnd() - 0.5) * 0.35);
    }
  }

  makeGears(targets[0]);
  makeClock(targets[1]);
  makePlanet(targets[2]);
  makePie(targets[3]);
  for (let i = 0; i < N; i++) {
    const c = pick();
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    pos[i * 3] = targets[0][i * 3]; pos[i * 3 + 1] = targets[0][i * 3 + 1]; pos[i * 3 + 2] = targets[0][i * 3 + 2];
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.025,
    vertexColors: true,
    transparent: true,
    opacity: 0.93,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const cloud = new THREE.Points(geo, mat);
  cloud.rotation.x = -0.08;
  cloud.rotation.y = 0.22;
  scene.add(cloud);

  /* ---- state and colour ranges, as in the source ------------------------- */
  let current = 0, from = 0, to = 0, transitionStart = 0, transitioning = false;
  const duration = 700;
  const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const defaultColors = new Float32Array(col);
  const purple = new THREE.Color(0x9b55ff);
  const PURPLE_RANGES = [[0, 2100], [5210, 5710], [3750, 5070], [4700, 6150]];
  function updateStateColors(state: number) {
    col.set(defaultColors);
    const [s0, s1] = PURPLE_RANGES[state];
    for (let i = s0; i < s1; i++) {
      col[i * 3] = purple.r; col[i * 3 + 1] = purple.g; col[i * 3 + 2] = purple.b;
    }
    geo.attributes.color.needsUpdate = true;
  }

  const mouse = { x: 0, y: 0 };
  const onPointer = (e: PointerEvent) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  window.addEventListener("pointermove", onPointer, { passive: true });

  function animateGears(t: number) {
    for (const g of gearMeta) {
      const ang = g.phase + t * g.speed, c = Math.cos(ang), s = Math.sin(ang);
      for (let i = 0; i < g.count; i++) {
        const q = g.local[i], a = (g.start + i) * 3;
        pos[a] = g.cx + q[0] * c - q[1] * s;
        pos[a + 1] = g.cy + q[0] * s + q[1] * c;
        pos[a + 2] = g.cz + q[2];
      }
    }
  }

  const start = performance.now();
  function frame(now: number) {
    const t = (now - start) / 1000;
    for (const h of clockHandMeta) {
      h.animAngle = h.type === "second" ? h.baseAngle - ((t % 60) / 60) * TAU : h.baseAngle;
      if (current === 1 && !transitioning) {
        const ca = Math.cos(h.animAngle), sa = Math.sin(h.animAngle);
        for (let i = 0; i < h.count; i++) {
          const q = h.local[i], a = (h.start + i) * 3;
          pos[a] = q[0] * ca - q[1] * sa;
          pos[a + 1] = q[0] * sa + q[1] * ca;
          pos[a + 2] = 0.34;
        }
      }
    }
    for (const m of planetMoonMeta) {
      if (current === 2 && !transitioning) {
        const ang = m.phase + t * m.speed;
        const ox = m.orbit * Math.cos(ang), oy = m.orbit * Math.sin(ang) * Math.sin(m.tilt), oz = m.orbit * Math.sin(ang) * Math.cos(m.tilt);
        for (let i = 0; i < m.count; i++) {
          const q = m.local[i], a = (m.start + i) * 3;
          pos[a] = q[0] + ox; pos[a + 1] = q[1] + oy; pos[a + 2] = q[2] + oz;
        }
      }
    }
    if (transitioning) {
      const q = Math.min(1, (now - transitionStart) / duration);
      const e = ease(q);
      const g = Math.pow(Math.sin(q * Math.PI), 1.25) * 0.92;
      const A = targets[from], B = targets[to];
      for (let i = 0; i < N * 3; i++) {
        const s = A[i];
        pos[i] = s + (B[i] - s) * e * (1 - g) + -s * 0.18 * g;
      }
      if (q >= 1) {
        current = to;
        transitioning = false;
        updateStateColors(current);
      }
    }
    if (current === 0 && !transitioning) animateGears(t);
    geo.attributes.position.needsUpdate = true;
    cloud.rotation.y += (0.22 + t * 0.075 + mouse.x * 0.13 - cloud.rotation.y) * 0.025;
    cloud.rotation.x += (-0.08 + mouse.y * 0.09 - cloud.rotation.x) * 0.025;
    cloud.rotation.z = Math.sin(t * 0.16) * 0.012;
    cloud.scale.setScalar(0.6 + Math.sin(t * 0.8) * 0.003);
    renderer.render(scene, camera);
  }

  /* ---- loop, paused off screen ------------------------------------------- */
  let raf = 0;
  let visible = true;
  const loop = (now: number) => {
    raf = 0;
    frame(now);
    if (visible && !still) raf = requestAnimationFrame(loop);
  };
  const kick = () => {
    if (!raf) raf = requestAnimationFrame(loop);
  };
  const io = new IntersectionObserver((es) => {
    visible = es.some((e) => e.isIntersecting);
    if (visible) kick();
  });
  io.observe(container);

  const ro = new ResizeObserver(() => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h || (w === width && h === height)) return;
    width = w; height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    kick();
  });
  ro.observe(container);

  updateStateColors(current);
  kick();

  return {
    choose(i: number) {
      if (i === current && !transitioning) return;
      if (still) {
        // No transition under reduced motion: jump to the shape, one frame.
        current = i;
        pos.set(targets[i]);
        updateStateColors(i);
        kick();
        return;
      }
      from = current;
      to = i;
      transitionStart = performance.now();
      transitioning = true;
      updateStateColors(i);
      kick();
    },
    dispose() {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      scene.clear();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
