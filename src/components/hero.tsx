"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const HeroWave = dynamic(() => import("./hero-wave").then((m) => m.HeroWave), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(135deg, #aecdf7 0%, #c3c3f2 45%, #e9d6ee 75%, #f4f1fb 100%)",
      }}
    />
  ),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <HeroWave />

      {/* pointer-events-none: this wrapper has no interactive children, and
          without it its full-height box would silently swallow every hover/
          click meant for the 3D canvas beneath it. */}
      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-5 pt-32 pb-16 pointer-events-none sm:pt-[24vh]">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.h1
            variants={item}
            className="font-display text-[clamp(2.6rem,5.6vw,4.5rem)] font-medium leading-[1.05] tracking-[-0.01em] text-ink"
          >
            <span className="text-gradient">Where Balance</span>
            <br />
            <span className="text-gradient">Meets Value</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-8 max-w-md text-base leading-relaxed text-ink/80 sm:text-lg"
          >
            Just like the perfect balance of glass and gravity, our work is
            designed to give you the right mix of quality and value.
            Transparent, fair, and crafted to keep you steady on your journey.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
