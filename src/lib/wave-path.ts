/**
 * Geometry traced from the hero art (public/hero/wave-bg.webp), in the
 * image's native 1920x1080 pixel space. Lets the orb be dragged so its
 * position always sits exactly on the glass wave's surface.
 */

export const NATURAL_W = 1920;
export const NATURAL_H = 1080;

// Extended: the real traced cycle (x 0..1916, untouched) plus a synthetic
// continuation on each side for 2 more waves' worth of length. The seams are
// Hermite-blended (matches position AND slope exactly, not a heuristic
// Gaussian cross-fade) so there's no visible corner where real data meets
// the synthetic extension — verified numerically (2nd-derivative check).
export const WAVE_X: number[] = Array.from(
  { length: 1440 },
  (_, i) => -1920 + i * 4,
);
export const WAVE_Y: number[] = [796.0,797.91,799.82,801.73,803.64,805.55,807.46,809.36,811.26,813.16,815.06,816.95,818.84,820.73,822.61,824.48,826.36,828.22,830.08,831.94,833.79,835.63,837.47,839.3,841.12,842.93,844.74,846.53,848.32,850.1,851.87,853.63,855.38,857.12,858.85,860.57,862.28,863.98,865.67,867.34,869.0,870.65,872.28,873.91,875.52,877.11,878.7,880.26,881.82,883.36,884.88,886.39,887.88,889.36,890.82,892.26,893.69,895.1,896.5,897.88,899.24,900.58,901.9,903.21,904.5,905.77,907.02,908.25,909.46,910.66,911.83,912.98,914.12,915.23,916.32,917.39,918.45,919.48,920.49,921.47,922.44,923.38,924.31,925.21,926.09,926.94,927.78,928.59,929.38,930.14,930.89,931.61,932.3,932.98,933.63,934.25,934.85,935.43,935.99,936.52,937.03,937.51,937.97,938.4,938.81,939.19,939.56,939.89,940.2,940.49,940.75,940.99,941.2,941.39,941.55,941.69,941.8,941.89,941.95,941.99,942.0,941.99,941.95,941.89,941.8,941.69,941.55,941.39,941.2,940.99,940.75,940.49,940.2,939.89,939.56,939.19,938.81,938.4,937.97,937.51,937.03,936.52,935.99,935.43,934.85,934.25,933.63,932.98,932.3,931.61,930.89,930.14,929.38,928.59,927.78,926.94,926.09,925.21,924.31,923.38,922.44,921.47,920.49,919.48,918.45,917.39,916.32,915.23,914.12,912.98,911.83,910.66,909.46,908.25,907.02,905.77,904.5,903.21,901.9,900.58,899.24,897.88,896.5,895.1,893.69,892.26,890.82,889.36,887.88,886.39,884.88,883.36,881.82,880.26,878.7,877.11,875.52,873.91,872.28,870.65,869.0,867.34,865.67,863.98,862.28,860.57,858.85,857.12,855.38,853.63,851.87,850.1,848.32,846.53,844.74,842.93,841.12,839.3,837.47,835.63,833.79,831.94,830.08,828.22,826.36,824.48,822.61,820.73,818.84,816.95,815.06,813.16,811.26,809.36,807.46,805.55,803.64,801.73,799.82,797.91,796.0,794.09,792.18,790.27,788.36,786.45,784.54,782.64,780.74,778.84,776.94,775.05,773.16,771.27,769.39,767.52,765.64,763.78,761.92,760.06,758.21,756.37,754.53,752.7,750.88,749.07,747.26,745.47,743.68,741.9,740.13,738.37,736.62,734.88,733.15,731.43,729.72,728.02,726.33,724.66,723.0,721.35,719.72,718.09,716.48,714.89,713.3,711.74,710.18,708.64,707.12,705.61,704.12,702.64,701.18,699.74,698.31,696.9,695.5,694.12,692.76,691.42,690.1,688.79,687.5,686.23,684.98,683.75,682.54,681.34,680.17,679.02,677.88,676.77,675.68,674.61,673.55,672.52,671.51,670.53,669.56,668.62,667.69,666.79,665.91,665.06,664.22,663.41,662.62,661.86,661.11,660.39,659.7,659.02,658.37,657.75,657.15,656.57,656.01,655.48,654.97,654.49,654.03,653.6,653.19,652.81,652.44,652.11,651.8,651.51,651.25,651.01,650.8,650.61,650.45,650.31,650.2,650.11,650.05,650.01,650.0,650.01,650.05,650.11,650.2,650.31,650.53,650.92,651.49,652.23,653.14,654.21,655.44,656.82,658.36,660.05,661.88,663.86,665.97,668.22,670.6,673.1,675.73,678.48,681.35,684.32,687.41,690.6,693.9,697.29,700.77,704.35,708.01,711.76,715.58,719.49,723.46,727.5,731.61,735.78,740.01,744.29,748.62,753.0,757.42,761.89,766.38,770.91,775.47,780.05,784.66,789.28,793.92,798.56,803.22,807.87,812.53,817.18,821.82,826.45,831.07,835.66,840.24,844.79,849.3,853.79,858.24,862.64,867.01,871.32,875.58,879.79,883.94,888.02,892.04,895.99,899.87,903.66,907.38,911.01,914.56,918.01,921.36,924.62,927.78,930.82,933.76,936.58,939.29,941.88,944.34,946.67,948.87,950.93,952.86,954.64,956.27,957.76,959.09,960.26,961.27,962.12,962.8,963.3,963.63,963.78,963.75,963.53,963.12,962.51,961.71,960.71,959.5,958.08,956.45,954.6,952.54,950.25,947.73,944.98,942.0,938.9,935.7,932.6,929.5,926.3,923.2,920.1,917.0,913.8,910.7,907.5,904.4,901.3,898.1,895.0,891.8,888.7,885.4,882.2,879.0,875.7,872.5,869.2,866.0,862.8,859.6,856.5,853.4,850.3,847.3,844.3,841.4,838.6,835.7,832.9,830.1,827.3,824.5,821.7,818.9,816.2,813.6,811.0,808.5,806.0,803.6,801.3,799.1,797.0,795.0,793.0,790.9,788.7,786.6,784.5,782.4,780.6,778.9,777.5,776.3,775.5,775.1,775.0,775.0,775.1,775.3,775.4,775.6,775.8,776.1,776.4,776.7,777.0,777.4,777.8,778.2,778.6,779.1,779.5,780.0,780.6,781.3,782.2,783.2,784.3,785.6,787.0,788.5,790.0,791.7,793.4,795.2,797.0,798.8,800.7,802.6,804.5,806.3,808.2,810.0,811.9,813.8,815.9,818.0,820.2,822.5,824.9,827.2,829.7,832.1,834.5,836.9,839.4,841.8,844.1,846.4,848.7,850.9,853.0,855.0,857.0,859.0,861.0,862.9,864.9,866.9,868.9,870.8,872.7,874.6,876.4,878.2,879.9,881.6,883.2,884.7,886.2,887.5,888.8,890.0,891.2,892.3,893.5,894.7,895.9,897.0,898.1,899.1,900.1,900.9,901.6,902.2,902.6,902.9,903.0,902.9,902.6,902.2,901.7,901.0,900.1,899.2,898.2,897.2,896.0,894.9,893.7,892.4,891.2,890.0,888.7,887.3,885.8,884.2,882.5,880.7,878.8,876.8,874.7,872.6,870.4,868.1,865.8,863.4,861.1,858.7,856.2,853.8,851.2,848.4,845.5,842.5,839.4,836.3,833.0,829.7,826.4,823.0,819.6,816.2,812.9,809.6,806.3,803.1,800.0,796.9,793.8,790.7,787.5,784.4,781.3,778.1,775.0,771.9,768.8,765.7,762.6,759.6,756.7,753.7,750.9,748.0,745.3,742.6,740.0,737.4,734.9,732.4,729.9,727.4,725.0,722.6,720.2,717.9,715.6,713.3,711.1,708.9,706.8,704.7,702.6,700.7,698.7,696.8,695.0,693.2,691.4,689.6,687.8,686.0,684.2,682.4,680.7,679.0,677.4,675.8,674.3,672.8,671.4,670.1,668.9,667.8,666.7,665.8,665.0,664.3,663.6,662.9,662.3,661.6,661.1,660.5,660.0,659.4,659.0,658.5,658.0,657.6,657.2,656.8,656.4,656.0,655.7,655.3,655.0,654.7,654.3,654.0,653.6,653.3,652.9,652.6,652.3,652.0,651.7,651.4,651.1,650.9,650.7,650.5,650.3,650.2,650.1,650.0,650.0,650.0,650.2,650.4,650.6,651.0,651.3,651.7,652.1,652.6,653.0,653.5,653.9,654.3,654.7,655.0,655.3,655.6,655.8,656.1,656.3,656.5,656.7,657.0,657.2,657.4,657.7,658.0,658.3,658.6,658.9,659.3,659.8,660.3,660.9,661.8,662.7,663.9,665.1,666.5,668.0,669.5,671.1,672.8,674.5,676.3,678.1,679.8,681.6,683.3,685.0,686.7,688.4,690.1,691.9,693.6,695.5,697.3,699.2,701.1,703.1,705.1,707.1,709.2,711.3,713.5,715.7,718.0,720.3,722.6,725.0,727.5,730.1,732.9,735.8,738.7,741.8,744.9,748.0,751.2,754.4,757.5,760.7,763.9,767.0,770.0,773.0,776.1,779.2,782.3,785.4,788.5,791.7,794.7,797.8,800.8,803.8,806.7,809.6,812.3,815.0,817.6,820.2,822.7,825.3,827.7,830.2,832.6,834.9,837.3,839.5,841.7,843.9,846.0,848.0,850.0,851.9,853.8,855.6,857.4,859.2,860.9,862.5,864.2,865.8,867.4,868.9,870.5,872.0,873.5,875.0,876.5,878.0,879.5,881.0,882.5,884.0,885.4,886.8,888.2,889.5,890.7,891.9,893.0,894.1,895.0,895.9,896.8,897.7,898.7,899.6,900.4,901.3,902.0,902.8,903.4,903.9,904.4,904.7,904.9,905.0,905.0,904.9,904.9,904.8,904.6,904.4,904.2,903.8,903.5,903.1,902.6,902.0,901.3,900.6,899.92,899.28,898.68,898.12,897.59,897.11,896.66,896.24,895.86,895.52,895.21,894.94,894.7,894.49,894.31,894.17,894.06,893.97,893.92,893.9,893.91,893.94,894.0,894.09,894.21,894.35,894.52,894.71,894.93,895.17,895.43,895.72,896.02,896.35,896.7,897.07,897.46,897.87,898.3,898.75,899.21,899.69,900.19,900.7,901.23,901.77,902.32,902.89,903.47,904.07,904.67,905.29,905.92,906.56,907.2,907.86,908.52,909.19,909.87,910.56,911.25,911.95,912.65,913.35,914.06,914.77,915.49,916.21,916.92,917.64,918.36,919.08,919.8,920.52,921.23,921.94,922.65,923.36,924.06,924.75,925.44,926.13,926.8,927.47,928.14,928.79,929.44,930.07,930.7,931.31,931.92,932.51,933.09,933.65,934.21,934.75,935.27,935.78,936.27,936.75,937.21,937.65,938.08,938.48,938.87,939.24,939.58,939.91,940.21,940.49,940.75,940.99,941.2,941.39,941.55,941.69,941.8,941.89,941.95,941.99,942.0,941.99,941.95,941.89,941.8,941.69,941.55,941.39,941.2,940.99,940.75,940.49,940.2,939.89,939.56,939.19,938.81,938.4,937.97,937.51,937.03,936.52,935.99,935.43,934.85,934.25,933.63,932.98,932.3,931.61,930.89,930.14,929.38,928.59,927.78,926.94,926.09,925.21,924.31,923.38,922.44,921.47,920.49,919.48,918.45,917.39,916.32,915.23,914.12,912.98,911.83,910.66,909.46,908.25,907.02,905.77,904.5,903.21,901.9,900.58,899.24,897.88,896.5,895.1,893.69,892.26,890.82,889.36,887.88,886.39,884.88,883.36,881.82,880.26,878.7,877.11,875.52,873.91,872.28,870.65,869.0,867.34,865.67,863.98,862.28,860.57,858.85,857.12,855.38,853.63,851.87,850.1,848.32,846.53,844.74,842.93,841.12,839.3,837.47,835.63,833.79,831.94,830.08,828.22,826.36,824.48,822.61,820.73,818.84,816.95,815.06,813.16,811.26,809.36,807.46,805.55,803.64,801.73,799.82,797.91,796.0,794.09,792.18,790.27,788.36,786.45,784.54,782.64,780.74,778.84,776.94,775.05,773.16,771.27,769.39,767.52,765.64,763.78,761.92,760.06,758.21,756.37,754.53,752.7,750.88,749.07,747.26,745.47,743.68,741.9,740.13,738.37,736.62,734.88,733.15,731.43,729.72,728.02,726.33,724.66,723.0,721.35,719.72,718.09,716.48,714.89,713.3,711.74,710.18,708.64,707.12,705.61,704.12,702.64,701.18,699.74,698.31,696.9,695.5,694.12,692.76,691.42,690.1,688.79,687.5,686.23,684.98,683.75,682.54,681.34,680.17,679.02,677.88,676.77,675.68,674.61,673.55,672.52,671.51,670.53,669.56,668.62,667.69,666.79,665.91,665.06,664.22,663.41,662.62,661.86,661.11,660.39,659.7,659.02,658.37,657.75,657.15,656.57,656.01,655.48,654.97,654.49,654.03,653.6,653.19,652.81,652.44,652.11,651.8,651.51,651.25,651.01,650.8,650.61,650.45,650.31,650.2,650.11,650.05,650.01,650.0,650.01,650.05,650.11,650.2,650.31,650.45,650.61,650.8,651.01,651.25,651.51,651.8,652.11,652.44,652.81,653.19,653.6,654.03,654.49,654.97,655.48,656.01,656.57,657.15,657.75,658.37,659.02,659.7,660.39,661.11,661.86,662.62,663.41,664.22,665.06,665.91,666.79,667.69,668.62,669.56,670.53,671.51,672.52,673.55,674.61,675.68,676.77,677.88,679.02,680.17,681.34,682.54,683.75,684.98,686.23,687.5,688.79,690.1,691.42,692.76,694.12,695.5,696.9,698.31,699.74,701.18,702.64,704.12,705.61,707.12,708.64,710.18,711.74,713.3,714.89,716.48,718.09,719.72,721.35,723.0,724.66,726.33,728.02,729.72,731.43,733.15,734.88,736.62,738.37,740.13,741.9,743.68,745.47,747.26,749.07,750.88,752.7,754.53,756.37,758.21,760.06,761.92,763.78,765.64,767.52,769.39,771.27,773.16,775.05,776.94,778.84,780.74,782.64,784.54,786.45,788.36,790.27,792.18,794.09];

const X_MIN = WAVE_X[0];
const X_MAX = WAVE_X[WAVE_X.length - 1];
const STEP = WAVE_X[1] - WAVE_X[0];

/**
 * Runtime-tunable geometry parameters, driven by the on-screen control panel
 * (see hero-wave.tsx). Deliberately mutable module state rather than props:
 * the wave functions below are called from many places — geometry building,
 * the rolling sphere, ripple placement — and threading params through all of
 * them would be far more invasive than a single shared config.
 */
export const waveTunables = {
  /** Gaussian smoothing width, in samples (LUT spacing is 4 image px). */
  smoothSigma: 6,
  /** Out-of-plane (Z) sweep — see the depth section further down. */
  depthAmp: 2.0,
  depthFreq: 0.12,
  depthPhase: -0.276,
  /** Pane half-depth as a multiple of the sphere's RADIUS (1.5 => total
   *  depth equals 1.5x the sphere's diameter). */
  paneDepthMul: 1.5,
  /** Pane half-thickness, in image px. */
  paneThicknessPx: 6,
  /** Multiplier on the sphere's traced radius. */
  sphereScale: 1.0,
};

/**
 * Gaussian-smoothed copy of the traced heights. Softens the tight V-shaped
 * valleys in the raw trace that read as angular folds once the curve is a
 * wide 3D surface, and strips high-frequency wobble that would otherwise
 * survive into the surface normals.
 */
function buildSmoothed(sigma: number): number[] {
  const s = Math.max(sigma, 0.0001);
  const radius = Math.ceil(s * 3);
  const kernel: number[] = [];
  let sum = 0;
  for (let k = -radius; k <= radius; k++) {
    const w = Math.exp(-(k * k) / (2 * s * s));
    kernel.push(w);
    sum += w;
  }
  const n = WAVE_Y.length;
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) {
    let acc = 0;
    for (let k = -radius; k <= radius; k++) {
      const j = Math.min(Math.max(i + k, 0), n - 1); // clamp at the ends
      acc += WAVE_Y[j] * kernel[k + radius];
    }
    out[i] = acc / sum;
  }
  return out;
}

let WAVE_Y_SMOOTH: number[] = buildSmoothed(waveTunables.smoothSigma);

/** Apply tunable changes; rebuilds the smoothed curve only when sigma moves
 *  (that pass is O(n·sigma) and needn't run for unrelated tweaks). */
export function applyWaveTunables(next: Partial<typeof waveTunables>) {
  const sigmaChanged =
    next.smoothSigma !== undefined && next.smoothSigma !== waveTunables.smoothSigma;
  Object.assign(waveTunables, next);
  if (sigmaChanged) WAVE_Y_SMOOTH = buildSmoothed(waveTunables.smoothSigma);
}

/**
 * The wave surface's y (image space) at a given x, clamped to the traced
 * range. Catmull-Rom, NOT linear: linear interpolation has a discontinuous
 * derivative at every sample node, and since the surface frame is built by
 * finite-differencing this curve at a step comparable to the node spacing,
 * that discontinuity made the tangent stair-step — jittering the normals
 * into the corrugated streaking seen across the pane. Catmull-Rom is
 * C1-continuous, so the tangent never jumps between samples.
 */
export function waveY(x: number): number {
  const cx = Math.min(Math.max(x, X_MIN), X_MAX);
  const n = WAVE_Y_SMOOTH.length;
  const f = (cx - X_MIN) / STEP;
  const i = Math.min(Math.max(Math.floor(f), 0), n - 1);
  const t = f - i;
  const p0 = WAVE_Y_SMOOTH[Math.max(i - 1, 0)];
  const p1 = WAVE_Y_SMOOTH[i];
  const p2 = WAVE_Y_SMOOTH[Math.min(i + 1, n - 1)];
  const p3 = WAVE_Y_SMOOTH[Math.min(i + 2, n - 1)];
  return (
    0.5 *
    (2 * p1 +
      (-p0 + p2) * t +
      (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
      (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)
  );
}

/** Local slope dy/dx of the wave surface at x (image space) — for a rolling tilt. */
export function waveSlope(x: number): number {
  const h = 6;
  return (waveY(x + h) - waveY(x - h)) / (2 * h);
}

export const ORB = {
  /** orb.webp/.png natural size (square) */
  cutoutSize: 308,
  /** sphere's optical center within the cutout image */
  centerInCutout: { x: 154.8, y: 154.2 },
  /** sphere radius, image-space px */
  radius: 124.16,
  /** resting position (image-space x) — matches the PSD's original composition */
  defaultX: 1280,
} as const;

export const DRAG_X_MIN = X_MIN + ORB.radius * 0.5;
export const DRAG_X_MAX = X_MAX - ORB.radius * 0.5;

/* ------------------------------------------------------------------------
 * 3D conversion — maps the same traced image-space curve into a three.js
 * scene, so the real-time tube follows the PSD's exact wave shape.
 * ---------------------------------------------------------------------- */

/** image px -> world units */
export const WORLD_SCALE = 0.0072;
/** image-space y that maps to world y = 0 (roughly the wave's vertical middle) */
const ANCHOR_IMG_Y = 780;

/** ORIENTATION: the pane is a glass SHEET whose broad face lies in the
 *  DEPTH axis — length runs along X, breadth extends into Z (toward/away
 *  from the camera, like a wavy road seen from above), and the THIN
 *  dimension is vertical. Earlier these roles were rotated 90° (broad
 *  along the screen, thin in Z), which made it read as a rectangular glass
 *  rod with no visible depth from any camera angle. */
export function sphereRadius(): number {
  return ORB.radius * WORLD_SCALE * waveTunables.sphereScale;
}

/** Half-DEPTH of the pane along Z, symmetric about the wave centerline.
 *  Expressed relative to the sphere's RADIUS so the proportion survives any
 *  resize: a multiplier of 1.5 means total depth = 1.5x the sphere's
 *  DIAMETER. */
export function paneHalfDepth(): number {
  return waveTunables.paneDepthMul * sphereRadius();
}
/** Half-THICKNESS of the pane — its vertical (thin, sheet) dimension.
 *  Deliberately independent of depth, not a ratio of it: a ratio would
 *  silently thicken the sheet into a slab whenever depth changed. */
export function paneHalfThickness(): number {
  return waveTunables.paneThicknessPx * WORLD_SCALE;
}

export function imgToWorldX(imgX: number): number {
  return (imgX - NATURAL_W / 2) * WORLD_SCALE;
}
export function imgToWorldY(imgY: number): number {
  return (ANCHOR_IMG_Y - imgY) * WORLD_SCALE;
}
export function worldToImgX(worldX: number): number {
  return worldX / WORLD_SCALE + NATURAL_W / 2;
}

/** The wave centerline's world-space (x, y) at a given world-space x. */
export function waveWorldPoint(worldX: number): { x: number; y: number } {
  const imgX = worldToImgX(worldX);
  return { x: worldX, y: imgToWorldY(waveY(imgX)) };
}

/** Local tangent/normal of the centerline at a given world-space x (unit vectors, XY plane). */
export function waveWorldFrame(worldX: number) {
  // Small step so this tracks the LOCAL slope (used per-vertex when building
  // the ribbon geometry, not just a one-off lookup) — the traced curve's LUT
  // is sampled every 4 image px, so ~4px-equivalent keeps this exact per
  // segment without smearing across neighboring crests/valleys.
  const h = 0.03; // world units ≈ 4.2 image px
  const a = waveWorldPoint(worldX - h);
  const b = waveWorldPoint(worldX + h);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const tangent = { x: dx / len, y: dy / len };
  // rotate tangent +90° so the normal points up/outward from the tube
  const normal = { x: -tangent.y, y: tangent.x };
  return { tangent, normal };
}

/* ------------------------------------------------------------------------
 * Genuine depth (Z) — a purely planar curve has no parallax to show from
 * ANY camera angle (angling the camera only reveals depth that already
 * exists in the geometry). This adds a gentle out-of-plane wind so the wave
 * actually recedes/advances toward the camera along its run. It doesn't
 * change the X/Y silhouette at all — from a strict head-on view down -Z
 * it's invisible — it only becomes visible, as intended, at an angle.
 * ---------------------------------------------------------------------- */
// Tuning notes for the depth controls (waveTunables.depth*):
//
// FREQ — at ~0.6 rad/unit the ~28-unit wave gets several depth cycles that
// are uncoordinated with the traced Y-undulation; the two out-of-phase
// ripples beat against each other and read as lumpy bumps rather than depth.
// One slow sweep (well under half a cycle across the span) reads instead as
// a single coherent bow toward/away from camera.
//
// PHASE — a sine's curvature is maximal at its peaks and ZERO at its
// zero-crossings. The sphere already sits on a sharp crest in the traced
// Y-data, so putting a depth PEAK there stacks two high-curvature features
// and shows up as a sharp elbow. Phasing so the sphere lands on a
// zero-crossing gives maximum slope but zero curvature: a smooth tilt.
export function waveWorldZ(worldX: number): number {
  return (
    Math.sin(worldX * waveTunables.depthFreq + waveTunables.depthPhase) *
    waveTunables.depthAmp
  );
}

export function waveWorldPoint3D(worldX: number): { x: number; y: number; z: number } {
  const p = waveWorldPoint(worldX);
  return { x: p.x, y: p.y, z: waveWorldZ(worldX) };
}

/**
 * Full 3D frame at worldX: `side` is the ribbon's WIDTH direction, `up` its
 * THICKNESS direction. `side` is deliberately computed from only the XY part
 * of the tangent (exactly like the old 2D `normal`) — that's what keeps it
 * twist-free through the crest/valley inflections. `up` is whatever's left
 * over (perpendicular to the true 3D tangent and to `side`), which is how
 * the new Z-wobble ends up expressed as thickness-axis tilt instead of
 * fighting the width axis.
 */
export function waveWorldFrame3D(worldX: number) {
  const h = 0.03;
  const a = waveWorldPoint3D(worldX - h);
  const b = waveWorldPoint3D(worldX + h);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const len3 = Math.hypot(dx, dy, dz) || 1;
  const tangent = { x: dx / len3, y: dy / len3, z: dz / len3 };

  const xyLen = Math.hypot(tangent.x, tangent.y) || 1;
  const side = { x: -tangent.y / xyLen, y: tangent.x / xyLen, z: 0 };

  // up = tangent × side (perpendicular to both; picks up the Z-wobble naturally)
  const upRaw = {
    x: tangent.y * side.z - tangent.z * side.y,
    y: tangent.z * side.x - tangent.x * side.z,
    z: tangent.x * side.y - tangent.y * side.x,
  };
  const upLen = Math.hypot(upRaw.x, upRaw.y, upRaw.z) || 1;
  const up = { x: upRaw.x / upLen, y: upRaw.y / upLen, z: upRaw.z / upLen };

  return { tangent, side, up };
}

export const WORLD_X_MIN = imgToWorldX(DRAG_X_MIN);
export const WORLD_X_MAX = imgToWorldX(DRAG_X_MAX);
