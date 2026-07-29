"use client";

import { useEffect, useState, type RefObject } from "react";

export type CoverTransform = {
  scale: number;
  offsetX: number;
  offsetY: number;
  containerW: number;
  containerH: number;
};

/** Mirrors CSS `object-fit: cover; object-position: posX posY` so screen
 *  coordinates can be converted to/from the image's native pixel space. */
export function useCoverTransform(
  ref: RefObject<HTMLElement | null>,
  naturalW: number,
  naturalH: number,
  posX = 0.5,
  posY = 0.5,
): CoverTransform {
  const [t, setT] = useState<CoverTransform>({
    scale: 1,
    offsetX: 0,
    offsetY: 0,
    containerW: naturalW,
    containerH: naturalH,
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const compute = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      const scale = Math.max(w / naturalW, h / naturalH);
      const dw = naturalW * scale;
      const dh = naturalH * scale;
      setT({
        scale,
        offsetX: (w - dw) * posX,
        offsetY: (h - dh) * posY,
        containerW: w,
        containerH: h,
      });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, naturalW, naturalH, posX, posY]);

  return t;
}
