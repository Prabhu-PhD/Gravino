# Gravino — Website Brief & Sitemap
*Draft v0.1 · 2026-06-19 · for review/sign-off*

---

## 1. Positioning (the core idea)

**Gravino is a design department on tap** — a structured, senior team that becomes the in-house design function for companies that have *recurring* design needs but no (or minimal) design workforce.

- **Tagline:** *Where Balance Meets Value.*
- **The balance:** senior quality (75+ years combined experience, systemic process) **vs.** competitive, transparent pricing.
- **Hero offer:** the **Retainer / Package** model — predictable monthly design capacity. Hourly and Project models are the secondary on-ramps.

**One-liner draft:** *"Your on-demand design team — senior craft, systemic process, fair pricing. Decks, documents, print, and digital, delivered on a steady cadence."*

## 2. Audience

- **Geography:** Global, prioritising **US, Europe, and Gulf** markets. Implications: English-first, international tone, timezone/response-time messaging, currency shown for the buyer (see §5), WhatsApp + Calendly as primary contact (familiar to Gulf + international buyers).
- **ICP:** Any industry with **recurring design tasks + minimal design headcount** — e.g. VC/finance, consulting, education consultancies, real estate, SaaS, events. They need volume + consistency, not a one-off.
- **Buyer pain we speak to:** "We constantly need decks/docs/collateral, but hiring a full design team isn't worth it." → Gravino is the answer.

## 3. Differentiators (why Gravino)

1. **Structured & systemic** — a repeatable process, not freelancer chaos.
2. **Senior team** — 75+ years combined experience; no juniors learning on your dime.
3. **Four deep specialisms** — Presentations, Documentation, Print, Digital.
4. **Value** — competitive Indian rates → premium output at a fraction of US/EU agency cost.
5. **Transparent** — published "starting from" pricing; open files + copyright transfer on full payment.

*Competitive set: any Indian design agency. Our edge vs. them = the systemic process + senior bench + international polish. Our edge vs. US/EU agencies = price.*

## 4. Brand snapshot (from existing collateral)

- **Logo:** text-based wordmark **"Gravino."** (the period is a deliberate device). Full asset kit + guidelines in progress.
- **Visual language:** glassmorphism, soft gradient mesh (lavender / periwinkle / sky-blue / soft-pink), translucent 3D glass rings balanced on a beam, dark glass cards, generous whitespace.
- **Voice:** transparent, fair, steady, confident. "The right mix of quality and value."

## 5. Service architecture

Four pillars (lead with these; brand/identity work folds in as a sub-offering):

| Pillar | Example deliverables | "Starting from" (indicative, INR) |
|---|---|---|
| **Presentations** | Investor/pitch decks, sales decks, keynote design, template systems | *from ₹15,000 (~$180) — indicative, confirm* |
| **Documentation** | Reports, whitepapers, annual reports, proposals, manuals, multipage brochures | from ₹20,000 |
| **Print** | Brochures, flyers, packaging, stationery, event collateral | from ₹20,000 |
| **Digital** | Social media, web banners, email, UI/UX, motion (+ logo/brand identity) | Social from ₹1,500 · Web UI/UX from ₹1,50,000 |

**Engagement models** (from pricing card): Hourly (₹4k–₹12k), Project (fixed), **Retainer (from ₹1,00,000/mo ≈ 120 hrs — the hero)**.

> **Open item:** Presentations & Documentation need real "starting from" anchors, since they're your headline specialties but aren't on the current card.

## 6. Sitemap (5 pages + 1 case-study template)

Global: sticky nav with persistent **"Start a project"** CTA · footer (contact, socials, "starting from" note, GST/legal).

1. **Home** — animated glass/balance hero + core message → positioning ("design department on tap") → 4 service pillars → featured work (flagship case-study teaser + gallery preview) → why Gravino (75+ yrs, systemic process, value) → pricing teaser ("from…") → testimonials (when available) → CTA band.
2. **Work** — **flagship case study: LiMRA** (problem → approach → solution → result) + **filterable visual gallery** (by pillar or client: The Grid, loool…).
3. **Services** — 4 pillars in depth + deliverables + "starting from" pricing + 3 engagement models + "how we work" process + CTA.
4. **About** — origin story · systemic approach · 75+ yrs · **4-member team section (bios + photos)** · values · CTA.
5. **Contact** — **all four pathways**: inquiry form (→ email), WhatsApp, email, Calendly embed · response-time + timezone note.
6. **/work/[case-study]** — template for the flagship deep-dive (and future case studies).

Nav = Home · Work · Services · About · Contact.

## 7. Design direction

- **Aesthetic:** editorial minimalism (à la nomoredesign) + premium glass renders & storytelling (à la Noomo) + smooth, fast scroll-flow (à la Hashgraph). Light gradient-mesh canvas, dark glass cards for contrast, lots of air.
- **Motion (phased — see §8):** text-reveal animations, scroll-triggered sequences, hover/cursor micro-interactions, an interactive glass/balance hero.
- **Colour tokens (derived from collateral — confirm when guidelines land):** lavender `#C9B8F0`, periwinkle `#A9B4F5`, sky `#BBD4F2`, soft-pink `#F2C6DD`, deep indigo card `#0E1330`, glass-white overlays.
- **Type (cost-effective web pairing, confirm):** display/headlines + wordmark in a modern grotesque (**General Sans** or **Satoshi**); body in **Inter**. Premium alternative: PP Neue Montreal.

## 8. Technical approach

- **Stack:** Next.js (App Router) + TypeScript + Tailwind, **Framer Motion** for UI animation, **React Three Fiber / three.js** for the glass hero.
- **Hosting:** Vercel (free/low tier) on **gravino.in**.
- **Forms:** serverless route → email (Resend/Formspree); extensible to a CRM later.
- **Motion phasing (to honour the reference bar without over-scoping v1):**
  - **Phase 1 (launch):** exceptional layout + CSS glassmorphism + Framer Motion text/scroll animation + a high-quality hero glass element (3D render exported as video/sequence *or* a lightweight three.js scene). Fast, distinctive, shippable.
  - **Phase 2 (post-launch):** full interactive three.js glass hero, advanced scroll storytelling, richer cursor interactions — true Noomo-tier polish.

## 9. Decisions

**Locked (2026-06-19):** Currency = **multi-currency toggle (USD / EUR / AED / INR)** · Flagship case study = **LiMRA** · Motion = **phased (ship v1, then three.js in phase 2)**.

**Still to confirm:**
1. **Positioning angle** — confirm "design department on tap" / "your on-demand design team," or adjust.
2. **Service pillars** — confirm the 4-pillar structure (and that brand/logo lives under Digital).
3. **Presentations & Documentation pricing** — confirm/override the indicative anchors (Presentations from ₹15,000 · Documentation from ₹20,000).

## 10. Roadmap

Discovery ✅ → **Brief + sitemap (this, awaiting sign-off)** → design direction (I'll scaffold the Next.js project + build the Home hero & design system as a *coded* prototype for approval) → build page-by-page → launch on gravino.in. Sign-off at each step.
