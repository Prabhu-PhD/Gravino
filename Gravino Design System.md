# Gravino Design System

**Gravino** is a design & marketing agency — "a design department on tap." Their
positioning: a senior, structured design team that plugs in as the in-house
design function for companies with recurring design needs but no (or minimal)
in-house design headcount. Tagline: **"Where balance meets value."**

The whole brand revolves around **balance** — literally (a 3D glass ring
balanced on a beam is the hero motif) and figuratively (senior craft vs. fair
pricing, structure vs. flexibility).

## Sources

This system was built from one attached codebase — no Figma file or slide
decks were provided.

- `Gravino/` — a Next.js 15 (App Router) + TypeScript + Tailwind v4 marketing
  site, in progress (v0.1 brief, drafted 2026-06-19). Not yet deployed;
  domain reserved at `gravino.in`. Key paths referenced below:
  - `docs/brief.md` — positioning, audience, service architecture, sitemap, content fundamentals
  - `src/app/globals.css` — the coded color/type/radius/glass token system (source of truth for all tokens here)
  - `src/app/layout.tsx` — font wiring (Fraunces, Manrope, IBM Plex Mono via next/font/google)
  - `src/components/*.tsx` — Hero, Positioning, Pillars, ContactCta, SiteNav, SiteFooter, Cta, CurrencyToggle, Reveal, GlassScene (R3F glass hero)
  - `src/lib/site.ts`, `src/lib/currency.tsx` — copy content + multi-currency logic
  - `public/hero/*` — the 3D glass-ring render (real brand imagery, copied into `assets/imagery/`)
  - `Gravino_Web & Social Portfolio.pdf` / `Pricing Card_Gravino.pdf` — static
    collateral (older brand pass) showing client work samples and a pricing
    one-pager. Referenced for tone/pricing context only — not the source of
    the token system (see Visual Foundations for how this differs from the coded site).

Because only a codebase was attached (no Figma), the coded site's component
set **is** this system's component inventory — see Components below.

## Content fundamentals

See full section further down (search "CONTENT FUNDAMENTALS").

## Visual foundations

See full section further down (search "VISUAL FOUNDATIONS").

## Iconography

See full section further down (search "ICONOGRAPHY").

---

## Index

**Tokens** (`tokens/`, all `@import`ed from root `styles.css`):
`colors.css` · `typography.css` · `spacing.css` · `effects.css` (glass/shadow/motion + `.g-*` utility classes) · `base.css` (resets) · `fonts.css` (webfont loading)

**Components** (`components/<group>/`) — the full inventory the coded site defines, ported as generic primitives:
- `forms/Button` — pill CTA, primary gradient or ghost glass
- `forms/SegmentedToggle` — pill segmented control (generalized from the currency switch)
- `data-display/Badge` — small pill tag chip
- `data-display/GlassCard` — the core translucent glass panel (light/deep tone)
- `data-display/PillarCard` — numbered feature card (icon, tags, price) for the dark band
- `navigation/NavBar` — fixed pill nav, glass on scroll
- `navigation/Footer` — dark-band footer with contact/explore/social columns

**Intentional additions** (not literal 1:1 ports, generalized for reuse):
- `Badge` — lifted out of the inline pill-tag markup in `pillars.tsx` into its own reusable primitive.
- `SegmentedToggle` — generalized from `currency-toggle.tsx`'s USD/EUR/AED/INR switch to accept any string options.
- `GlassCard` — the `.glass` / `.glass-deep` CSS utilities from `globals.css`, extracted into a component so it's easy to reach for.

Not ported: `FromPrice` (currency-formatting logic, not a visual primitive — its
formatting lives in `tokens` conceptually but isn't a component) and `Reveal`
(a Framer Motion scroll-reveal wrapper, not a visual primitive).

**UI kits** (`ui_kits/<product>/`) — one product exists (the marketing website):
- `ui_kits/marketing-site/` — Home page recreation: nav, hero, positioning, four pillars (dark band), contact CTA, footer. Interactive currency toggle + mobile nav.

**Assets** (`assets/`):
- `imagery/balance-glass.jpg`, `balance-glass-mobile.jpg` — the real 3D glass-ring hero render (desktop + mobile crop), copied from `public/hero/`.
- `imagery/balance-glass-cutout.png` — isolated/cutout version of the same render.
- No logo file exists — see Iconography/Brand notes. The wordmark is set in type (`Manrope` extrabold), matching the live code.

**Foundation specimen cards** — small HTML cards under `guidelines/` populate the Design System tab: Colors, Type, Spacing, Glass & Shadow, Motion, Buttons-in-use.

**SKILL.md** — Claude Code-compatible skill wrapper for this system.

---

## CONTENT FUNDAMENTALS

**Tagline / one-liner:** *"Where balance meets value."* Positioning line: *"Your
on-demand design team — senior craft, systemic process, fair pricing."*

**Point of view — "we" for Gravino, "you" for the reader.** Copy speaks
directly to the buyer ("teams with constant design needs and no time to
hire", "Tell us what's on your plate") while Gravino refers to itself as "we"
("We'll come back with a plan"). Never third-person about the company.

**Casing:** sentence case everywhere — headlines, nav labels, button labels,
card titles. Never Title Case, never ALL CAPS except the mono "eyebrow" labels
(`Design department · on tap`, `THE GRAVINO MODEL` at ~0.72rem, uppercase,
tracked out +0.24em) and short meta chips.

**Sentence rhythm:** short, confident, declarative. Fragments used
deliberately for punch: *"Your on-demand design department."* Em/en-dashes and
middle-dots (`·`) break up meta rows instead of bullets: `75+ yrs combined
experience · US · Europe · Gulf`. Numbers spelled as numerals ("75+ years",
"4-member team"), not words.

**Emphasis device:** one italic word per headline in the display serif,
usually gradient-filled — *"Built like an in-house team. **Priced** like a
smart decision."* / *"Your on-demand **design** department."* This is the
single recurring rhetorical trick; don't overuse it (max one per headline).

**No emoji, anywhere.** No exclamation points in body copy. Tone is
transparent/fair/steady/confident — never hypey, never jokey. Numbers used to
back claims (75+ years combined experience, 4-person team) rather than vague
superlatives.

**Pricing copy convention:** always "from ₹X" / "starting from", never a bare
number — signals transparency without over-committing. Footnote pattern:
*"Pricing shown "from" — custom quotes after a quick chat."*

**CTA labels:** short, verb-first, lowercase-sentence-case — "Start a
project", "See the work", "Book a call". Never "Learn more" / "Click here" /
generic filler.

---

## VISUAL FOUNDATIONS

**Overall vibe:** editorial minimalism (generous whitespace, restrained type
hierarchy) crossed with premium 3D glass-render storytelling. Light and airy
by default; one dark "contrast band" section per page for drama, never more.

**Color:** a lavender/periwinkle/sky-blue/soft-pink pastel family sits behind
everything as a soft mesh gradient (`--mesh-gradient`, four large soft radial
blooms, low opacity, fixed to the viewport so it never scrolls). Ink is a deep
near-black violet (`#17152e`), never pure black. One saturated accent pair —
violet `#6d5de0` → grape `#8b7bf0` — is reserved for the primary CTA gradient,
links, and gradient-text emphasis words. The dark band uses a near-black
indigo (`#141031`/`#1d1942`), not pure black, with the same accent hues at low
opacity as glow blobs.

**Type:** three families, one job each. **Fraunces** (serif, supports
italic) for all display headlines — often mixed roman + italic in one
headline. **Manrope** (sans) for body copy, nav, UI labels, buttons. **IBM
Plex Mono** for "eyebrow" labels, meta rows, and prices — mono signals
"precise/transparent," reinforcing the pricing-transparency message. Display
sizes are fluid (`clamp()`), not fixed breakpoints. Tight tracking
(-0.02em) on display, wide tracking (+0.24em) on mono eyebrows.

**Spacing:** generous section rhythm — `clamp(5.5rem, 12vw, 10rem)` vertical
padding per section. Cards use ~1.75rem internal padding. Grids use a 5–8 unit
gap (1.25–2rem), never tight.

**Backgrounds:** no photography as full-bleed backgrounds. The signature
background is the fixed lavender mesh-gradient + a 5%-opacity fractal-noise
grain overlay (SVG turbulence, multiply blend) so the gradient never looks
flat/banded. The one full-bleed image asset is the 3D glass-ring render, used
as the hero's living centerpiece (not a background — it sits in its own
column/frame, non-interactive but reactive to cursor via a live three.js
scene, with a static JPG/WebP as the loading fallback).

**Imagery style:** a single recurring 3D render — glass/crystal rings of
varying sizes balanced on a tilted glass beam, translucent, refracting a
sky-blue → violet → pink gradient from within (no gray studio backdrop). Cool,
soft, dreamy, high-gloss — never warm, never gritty/grainy photography, no
people/lifestyle photography in the brand's own material (client work samples
in the portfolio PDF are a different, unrelated visual language — those are
proof-of-work for clients, not Gravino's own brand system).

**Glass system — the core surface language:**
- `.g-glass` (light glass): semi-opaque white gradient fill, soft white
  border, blurred (18px, saturate 150%), a soft outer shadow plus a 1px inset
  highlight. This is the default card/panel treatment on the light canvas.
- `.g-glass-soft`: a lighter-weight variant (12px blur, no inset highlight) —
  used for ghost buttons and the nav pill before scroll.
- `.g-glass-deep`: tuned for the dark band — near-transparent white overlay
  (10%→3%), white/12% border, 16px blur. Used for pillar/feature cards sitting
  on the indigo band.

**Corner radii:** two values only — `1.5rem` ("glass" radius, cards/panels),
`2.5rem` (large radius for the full-bleed dark band container), and `999px`
(pill — buttons, chips, nav capsule, toggle). No small/medium radius scale;
everything is either sharply pill-shaped or generously rounded.

**Shadows:** soft, large-blur, low-opacity outer shadows (`0 28px 60px -36px`)
rather than crisp drop shadows — shadows read as "glass floating," not "card
on paper." The primary CTA gets a tinted violet shadow instead of a neutral
gray one, which deepens further on hover.

**Borders:** hairline only, always semi-transparent (`ink 10%` on light,
`white 10–12%` on dark) — never a solid, opaque border color.

**Motion:** all easing uses one custom curve, `cubic-bezier(0.22, 1, 0.36,
1)` — a soft decelerate. Entrance = fade + rise (22px translateY, ~0.75–0.8s),
staggered ~0.08–0.1s per child, triggered on scroll-into-view (once). No
bounce, no spring overshoot, no infinite decorative loops. `prefers-reduced-motion` fully disables it.

**Hover states:** cards/buttons rise (`translateY(-6px)` for cards, `-2px`
for buttons) and their shadow deepens/tints violet — never a color swap,
never underline-on-hover for nav (nav links just shift ink→darker ink). Ghost
buttons brighten (50%→75% white opacity) rather than changing hue.

**Press/active states:** not explicitly defined in the source; the pattern
elsewhere (soft transform + shadow, no color swap) implies a would-be press
state should ease back toward resting position rather than "shrink," consistent with the glass/floating metaphor. Flagged as an open item — no explicit `:active` styling exists in the source to copy.

**Transparency & blur:** used constantly and deliberately — every card,
nav pill, and button is translucent-glass, never opaque solid fill (except
the accent-gradient primary CTA and the dark band itself). Backdrop-blur
values scale with surface importance: 12px (soft/ghost) → 16px (deep) → 18px
(primary glass).

**Layout rules:** nav is `position: fixed`, top, full-width, pill-shaped,
content max-width 72rem (`max-w-6xl`), centered. Sections generally share that
same 72rem reading measure; the dark pillars band breaks out to `max-w-7xl`
with rounded full-bleed edges as the one deliberate width variation per page.

---

## ICONOGRAPHY

No icon font, sprite sheet, or SVG library exists in the codebase — icons are
hand-authored inline SVGs per component (`pillars.tsx`), not sourced from a
system like Lucide/Heroicons. Style: **22×22, `viewBox="0 0 24 24"`, no fill,
`currentColor` stroke at 1.5px, round caps/joins** — a light, consistent line
weight matching the type's restraint. Only four icons exist today, one per
service pillar (deck/monitor, folded document, print stack, sparkle/star for
digital) — copied verbatim into `PillarCard.jsx` as `PillarIcons`. Reuse the
same stroke spec (1.5px, round, currentColor, 22px) for any new icon. No
emoji, no unicode glyphs-as-icons, and no PNG icons anywhere in the source.

**Logo status:** no logo file exists in the codebase or attachments — the
brief explicitly says *"Full asset kit + guidelines in progress."* The live
site renders the wordmark **`Gravino.`** as plain text (`Manrope` extrabold,
tight tracking) — the trailing period is a deliberate device, called out in
the brief as intentional. This system does the same: no logo asset was
fabricated. The static PDF collateral (portfolio, pricing card) shows the same
wordmark set in a different, rounder geometric sans — likely an earlier /
alternate brand pass — but since it's raster-only inside composed PDF pages
with no isolated source file, it was **not** extracted or used here to avoid
guessing at an unfinished mark. Flagging this for the user below.
