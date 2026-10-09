/* Generates src/content/glyph-dots.ts: the deliverable drawings as dots.
 * ---------------------------------------------------------------------------
 *   node scripts/glyph-dots.mjs        (run from v2/; needs Chrome)
 *   CHROME="/path/to/chrome" node scripts/glyph-dots.mjs
 *
 * Run it whenever a drawing in GLYPHS (src/content/capabilities.ts) changes.
 *
 * The treatment (the client chose it, 2026-10-09, from a set of options; "B2"
 * in the review): each line drawing is rasterised, blurred a little and
 * sampled on a dot grid (pitch 2.9 on the 64x48 drawing). A dot's size is
 * how much of the drawing is under it, snapped to four steps. Before
 * sampling, the grid is shifted to whichever offset lands the strokes most
 * squarely on dots (a line becomes one row of full dots, not two rows of
 * half dots). Outside the drawing's filled silhouette, never inside it, a
 * thin scatter of small dots fades out with distance. Shading by a light is
 * NOT baked in: the page applies it, so the light can move.
 *
 * It needs a browser because it rasterises with canvas (blur filters) and
 * uses SVG getBBox() to tell each drawing's body from its details.
 *
 * Output per drawing: "ox,oy:" then three base-32 characters per dot: the
 * column, the row, and size*3 + colour. Sizes 0-3 are the drawing's dots,
 * 4-7 the scatter; colours 0 light, 1 violet, 2 sky. src/lib/dot-icons.ts
 * decodes it.
 */
import { readFileSync, writeFileSync, mkdtempSync, existsSync, rmSync } from "node:fs";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src/content/capabilities.ts");
const OUT = join(ROOT, "src/content/glyph-dots.ts");

/* ---- the drawings, as the page renders them ----------------------------- */
const src = readFileSync(SRC, "utf8");
const V = src.match(/const V = "(#[0-9a-f]+)"/)[1];
const S = src.match(/const S = "(#[0-9a-f]+)"/)[1];
const LINE = src.match(/const line = '([^']+)'/)[1];
const block = src.slice(src.indexOf("export const GLYPHS"));
const GLYPHS = {};
for (const m of block.matchAll(/^\s+(\w+): `(.*?)`,\s*$/gm)) {
  GLYPHS[m[1]] = m[2].replaceAll("${line}", LINE).replaceAll("${V}", V).replaceAll("${S}", S);
}
if (Object.keys(GLYPHS).length < 10) throw new Error("Could not read GLYPHS from capabilities.ts");

/* ---- runs in the browser ------------------------------------------------- */
function inPage(glyphs, V, S) {
  const PITCH = 2.9, BLUR = 0.9, REACH = 3.6, DENSITY = 0.55;
  const SS = 8, W = 512, H = 384;
  const PAL = [[226, 232, 240], [167, 139, 250], [56, 189, 248]];
  const B32 = "0123456789abcdefghijklmnopqrstuv";
  const hash = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };

  // The filled silhouette: closed outline shapes (rect, circle, closed path)
  // that are not inside another one are the drawing's bodies; fill them.
  function silhouette(markup) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 64 48"); svg.setAttribute("width", "64"); svg.setAttribute("height", "48");
    svg.innerHTML = markup; document.body.appendChild(svg);
    const bodies = [];
    const inside = (b, o, t) => b.x >= o.x - t && b.y >= o.y - t && b.x + b.width <= o.x + o.width + t && b.y + b.height <= o.y + o.height + t;
    for (const el of [...svg.children]) {
      const tag = el.tagName, fill = el.getAttribute("fill"), stroke = el.getAttribute("stroke");
      const closed = tag === "rect" || tag === "circle" || (tag === "path" && /[Zz]\s*$/.test(el.getAttribute("d")));
      const b = el.getBBox();
      if (stroke === "currentColor" && closed && fill !== V && fill !== S && !bodies.some(o => inside(b, o, 1))) { bodies.push(b); el.setAttribute("fill", "#fff"); }
      if (el.getAttribute("stroke")) el.setAttribute("stroke", "#fff");
      if (fill && fill !== "none") el.setAttribute("fill", "#fff");
    }
    const out = svg.innerHTML; svg.remove(); return out;
  }
  async function raster(markup, blurs) {
    const img = new Image();
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 48" width="${W}" height="${H}" style="color:#e2e8f0">${markup}</svg>`);
    await img.decode();
    return blurs.map(b => { const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d", { willReadFrequently: true });
      if (b) x.filter = `blur(${b * SS}px)`; x.drawImage(img, 0, 0); return x.getImageData(0, 0, W, H).data; });
  }
  const A = (d, x, y) => d[(Math.min(H - 1, Math.max(0, Math.round(y * SS))) * W + Math.min(W - 1, Math.max(0, Math.round(x * SS)))) * 4 + 3] / 255;
  function colourAt(sharp, x, y, h) {
    let n = 0, r = 0, g = 0, b = 0;
    for (let yy = y - h; yy <= y + h; yy += 0.5) for (let xx = x - h; xx <= x + h; xx += 0.5) {
      const k = (Math.round(Math.min(H - 1, Math.max(0, yy * SS))) * W + Math.round(Math.min(W - 1, Math.max(0, xx * SS)))) * 4;
      const al = sharp[k + 3] / 255; if (al < 0.3) continue; n += al; r += sharp[k] * al; g += sharp[k + 1] * al; b += sharp[k + 2] * al; }
    if (!n) return 0;
    r /= n; g /= n; b /= n; const d = c => (r - c[0]) ** 2 + (g - c[1]) ** 2 + (b - c[2]) ** 2;
    return [0, 1, 2].sort((u, v) => d(PAL[u]) - d(PAL[v]))[0];
  }
  async function one(markup, seed) {
    const [tight, sharp] = await raster(markup, [BLUR, 0]);
    const [sil, near] = await raster(silhouette(markup), [0.6, REACH]);
    const cols = Math.floor(64 / PITCH), rows = Math.floor(48 / PITCH);
    let ox = (64 - (cols - 1) * PITCH) / 2, oy = (48 - (rows - 1) * PITCH) / 2, best = -1, bo = [ox, oy];
    for (let dy = -PITCH / 2; dy < PITCH / 2; dy += PITCH / 8) for (let dx = -PITCH / 2; dx < PITCH / 2; dx += PITCH / 8) {
      let s1 = 0, s2 = 0;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const a = A(tight, ox + dx + i * PITCH, oy + dy + j * PITCH); s1 += a; s2 += a * a; }
      const sc = s2 / (s1 || 1); if (sc > best) { best = sc; bo = [ox + dx, oy + dy]; }
    }
    [ox, oy] = bo;
    let code = `${ox.toFixed(2)},${oy.toFixed(2)}:`;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = ox + i * PITCH, y = oy + j * PITCH, a = Math.min(1, A(tight, x, y) * 1.6);
      let size, colour = 0;
      if (a >= 0.12) { size = a < 0.32 ? 0 : a < 0.55 ? 1 : a < 0.8 ? 2 : 3; colour = colourAt(sharp, x, y, PITCH / 2); }
      else if (A(sil, x, y) < 0.05) {
        const pr = Math.min(1, A(near, x, y) * 2.4);
        if (pr < 0.04 || hash(i, j, seed) > pr * DENSITY) continue;
        size = 4 + Math.min(3, Math.floor(pr * 4));
      } else continue;
      code += B32[i] + B32[j] + B32[size * 3 + colour];
    }
    return code;
  }
  return (async () => {
    const out = {}; let seed = 1;
    for (const [k, m] of Object.entries(glyphs)) out[k] = await one(m, seed++);
    return out;
  })();
}

/* ---- a headless Chrome, driven over the DevTools protocol --------------- */
const CHROME = process.env.CHROME || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/chromium",
].find(existsSync);
if (!CHROME) throw new Error("Chrome not found; set CHROME to its path.");
const profile = mkdtempSync(join(tmpdir(), "glyph-dots-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
try {
  let port;
  for (let i = 0; i < 100 && !port; i++) {
    await new Promise(r => setTimeout(r, 150));
    const f = join(profile, "DevToolsActivePort");
    if (existsSync(f)) port = readFileSync(f, "utf8").split("\n")[0].trim();
  }
  if (!port) throw new Error("Chrome did not start");
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
  const ws = new WebSocket(tabs.find(t => t.type === "page").webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  const call = (method, params) => new Promise((res, rej) => {
    const id = Math.floor(Math.random() * 1e9);
    const on = e => { const m = JSON.parse(e.data); if (m.id !== id) return; ws.removeEventListener("message", on); m.error ? rej(new Error(m.error.message)) : res(m.result); };
    ws.addEventListener("message", on);
    ws.send(JSON.stringify({ id, method, params }));
  });
  const r = await call("Runtime.evaluate", {
    expression: `(${inPage.toString()})(${JSON.stringify(GLYPHS)}, ${JSON.stringify(V)}, ${JSON.stringify(S)})`,
    awaitPromise: true, returnByValue: true,
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails));
  const dots = r.result.value;
  ws.close();

  const body = Object.entries(dots).map(([k, v]) => `  ${k}: "${v}",`).join("\n");
  writeFileSync(OUT, `/* GENERATED by scripts/glyph-dots.mjs from the GLYPHS in capabilities.ts.
 * Do not edit by hand: change the drawing, then run
 *   node scripts/glyph-dots.mjs
 * Format and treatment: see that script; decoded by src/lib/dot-icons.ts. */
import type { GlyphKey } from "./capabilities";

export const GLYPH_DOTS: Record<GlyphKey, string> = {
${body}
};
`);
  const n = Object.values(dots).reduce((s, v) => s + (v.length - v.indexOf(":") - 1) / 3, 0);
  console.log(`glyph-dots: ${Object.keys(dots).length} drawings, ${n} dots, ${Object.values(dots).join("").length} characters -> ${OUT}`);
} finally {
  chrome.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}
