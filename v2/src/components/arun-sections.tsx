import { ARUN_SECTIONS_HTML } from "@/content/arun-sections";

/* ===========================================================================
 * The downstream sections, injected as his markup rather than rebuilt in JSX.
 * ---------------------------------------------------------------------------
 * This is a server component, so the markup is in the initial HTML response -
 * it is not client-rendered, and it stays crawlable.
 *
 * `display: contents` on the wrapper is deliberate. React needs a single
 * element to hang the injected HTML on, but his sections are written as
 * direct children of <body>; a wrapper that generated a box would become
 * their containing block and change how the sticky and absolutely positioned
 * pieces inside them resolve. `contents` removes the box and leaves the
 * sections laid out as though the wrapper were not there.
 * ======================================================================== */

export function ArunSections() {
  return (
    <div
      style={{ display: "contents" }}
      dangerouslySetInnerHTML={{ __html: ARUN_SECTIONS_HTML }}
    />
  );
}
