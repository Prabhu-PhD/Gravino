import type { CSSProperties } from "react";

/**
 * Stagger helper for the storyline animations: `style={d(3)}` delays a part
 * by three steps. The CSS reads it as --d (globals.css, "STORYLINE").
 *
 * Lives here rather than in components/story.tsx because that file is a
 * client module, and the diagrams that call this are rendered on the server.
 * A function exported from a "use client" file cannot be called from server
 * code, so keeping it there would break every diagram at build time.
 */
export function d(step: number, unit = 0.12): CSSProperties {
  return { ["--d" as string]: `${(step * unit).toFixed(2)}s` } as CSSProperties;
}
