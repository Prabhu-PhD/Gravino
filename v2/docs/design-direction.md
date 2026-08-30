# Gravino v2 — design direction

*From the `Design Refs/` set (24 stills + the opac motion piece), 2026-08-30.*

v1 is tabled, not deleted. This is a fresh start on both copy and design.

---

## 1. What the references actually share

Six traits recur across the whole set regardless of industry:

1. **One saturated gradient is the only colour event.** Everything else is
   neutral. (Keep Up Agency, Slaying Sales, Purple Brandfolio, RMDistribuidora,
   Rostelecom, TQA.) No multi-hue pastel mesh anywhere in the set.
2. **Big grotesk headline, tight leading, 2–3 lines, left-aligned** — sentence
   case (eyebot, Consultare, 13pt) or wide caps (TQA, RMD, Aero). Always the
   loudest element by a wide margin.
3. **Tiny letterspaced mono micro-labels carry the structure** — `SINCE 2026`,
   `COLLECTION 001 / LIMITED`, `PEOPLE | PROCESS | TECHNOLOGY`, slide numbers,
   corner tags. This is what makes the set read *designed* rather than
   *templated*.
4. **Fluted / refracting glass as a surface over content**, never as a floating
   object — Southern West International, Clarity, the cornflower still,
   Trupeer's frosted slabs, AIPatrn's ribbed panels.
5. **Rounded-corner cards on high-contrast grounds** — Vistas, Bethouse, Run-y.
6. **Hairline rules and visible grid marks as decoration** — opac, TQA,
   Rostelecom, Beyond XP.

The opac video is the sharpest thing in the set: off-white grain, hairline
grid, serif-italic wordmark, four small caption clusters in the corners,
blurred motion photography. Almost no colour, total confidence.

## 2. Decisions taken

| Question | Decision |
|---|---|
| Ground | **Dark hero, light body.** Near-black hero with one violet gradient; warm off-white editorial body below; a second dark band deeper in the page. |
| Hero motif | **Fluted glass over typography.** The headline runs behind a ribbed pane and is sliced by it. No photography required. |
| Motion | Restrained. One easing curve (`--ease-out-soft`). Nothing bounces. |

### Why glass-over-type, specifically

v1 burned four hero rebuilds trying to *manufacture a subject* in three.js,
because Gravino has no photography or 3D assets. The references solve the same
problem differently: they take ordinary content and put glass in front of it.

Point 4 above is therefore the unblock, and it also retires v1's two hard-won
gotchas at once:

- Real-time WebGL tops out around 6/10 against the path-traced glass in the
  brand PDFs. Not a tuning problem — a ceiling. **Now irrelevant: there is no
  WebGL.**
- The Claude preview pane runs with `document.hidden === true`, so `rAF` is
  paused and *nothing* animation-driven can be observed there. **Now
  irrelevant: the effect is static CSS and screenshots correctly.**

## 3. Type

| Role | Face | Notes |
|---|---|---|
| Display | **Instrument Sans** 500 | Tight leading (0.98), −0.032em tracking. The `display` utility. |
| Body | **Inter** | |
| Micro-labels | **IBM Plex Mono** | 11px, 0.18em tracking, uppercase. The `label` utility. |

v1's Fraunces is dropped — the reference set is almost entirely grotesk, and
the serif was pulling toward a warmth these don't have.

## 4. Colour

Brand hues (indigo → violet → periwinkle → blush) pushed to the saturation the
references actually run at. Defined once in `globals.css` and used for the hero
wash and the glass tint — nothing else.

```
ink    #0a0812   (warm-shifted, so violet sits IN it rather than on it)
paper  #f7f5f2   (warm off-white — opac / Trupeer, not clinical white)
grad   #1a0f4d → #5b2ee5 → #8f6ff2 → #c99ae8 → #f0b6d3
accent #7c4dff
```

## 5. Carried over from v1 vs. rebuilt

**Lifted verbatim:** `docs/brief.md` (positioning, ICP, pillars, pricing
anchors, sitemap), `lib/site.ts`, `lib/currency.tsx` (multi-currency toggle),
`components/reveal.tsx`, the Next/TS/Tailwind scaffolding.

**Rebuilt from scratch:** all copy, all design tokens, the type pairing, every
component layout.

**Left behind:** the entire hero lineage — `hero-wave.tsx`, `wave-path.ts`,
`hero-controls.ts`, `glass-scene.tsx` (~1,750 lines) — and with it the
`three` / `@react-three/*` / `postprocessing` / `leva` dependencies. v2 ships
**no client JS for the hero at all**: `FlutedGlass` is a server component.

## 6. Status

Built: design tokens, `FlutedGlass`, hero (responsive across mobile / tablet /
desktop), new hero copy. `tsc` clean, `next build` clean, no console errors.

Next: Positioning and Pillars sections on the paper ground, then Work,
Services, About, Contact. Contact details in `lib/site.ts` are still
placeholders and must be confirmed before launch.
