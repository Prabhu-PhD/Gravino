/* ===========================================================================
 * Arun's downstream sections, verbatim.
 * ---------------------------------------------------------------------------
 * From lines 456-891 of his index4.html: what-we-cover, portfolio, the CTA,
 * The footer moved out to cosmic-chrome.tsx and the project intake modal to
 * intake-form.tsx, so every page renders the same one of each.
 *
 * His proof-of-work section ("Credibility At Scale") was removed at the
 * client's request. It was also the last light-on-white section on the page.
 *
 * This is HTML rather than JSX on purpose. The three scripts that drive these
 * sections - ui.js, capabilities.js and app4.js - are his, unmodified, and
 * they find their targets by id and class and then mutate the DOM directly.
 * Converting the markup to JSX would mean React and his scripts both claiming
 * ownership of the same nodes, and would silently drop the inline onclick on
 * the modal's close button. Injecting the markup as-is keeps one owner.
 *
 * WHERE THE COPY LIVES: here. Editing the words on these sections means
 * editing this file, not site.ts. That is the trade for using his build
 * unmodified, and it is the one real cost of the approach.
 *
 * The markup is checked at generation time for backticks and backslashes,
 * none of which it contains. It does contain two ${...} insertions: the
 * generated "What we cover" totem and panels.
 * ======================================================================== */

import { CAPABILITIES, deliverableTileHtml } from "./capabilities";

/* "What we cover" is generated from content/capabilities.ts, the one source
   for the four capability names and their deliverables (the client,
   2026-10-08). The ids and classes Arun's capabilities.js relies on
   (num-selector, data-target, cap-N, cap-content-panel, is-active,
   cap-title, cap-item-N) are kept exactly. */
const esc = (t: string) => t.replace(/&/g, "&amp;");

const TOTEM_HTML = CAPABILITIES.map(
  (c, i) => `            <button class="num-selector${i === 0 ? " active" : ""}" data-target="cap-${i + 1}" aria-label="${c.n} ${esc(c.name)}">
              <span class="num-text">${c.n}</span>
              <span class="num-label">${esc(c.name)}</span>
            </button>`,
).join("\n");

const PANELS_HTML = CAPABILITIES.map(
  (c, i) => `            <div id="cap-${i + 1}" class="cap-content-panel${i === 0 ? " is-active" : ""}">
              <span class="cap-mobile-label">${c.n}</span>
              <h3 class="cap-title text-2xl sm:text-[28px] md:text-3xl font-medium tracking-tight text-[#c084fc] leading-snug">${esc(c.name)}</h3>
              <p class="cap-item-1 mt-2 text-sm md:text-[15px] text-slate-200 font-light leading-relaxed">${esc(c.line)}</p>
              <ul class="cap-item-2 dl-grid mt-6" aria-label="What we make">${c.deliverables.map(deliverableTileHtml).join("")}</ul>
              <a class="cap-item-3 cap-more" href="/services/#${c.id}">See ${esc(c.name)} in detail <span aria-hidden="true">&rarr;</span></a>
            </div>`,
).join("\n");

export const ARUN_SECTIONS_HTML = String.raw`
  <section id="what-we-cover" class="page-section relative overflow-visible bg-black text-white min-h-screen flex items-center justify-center py-20 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-20 scroll-mt-0 border-b border-white/10" style="background: radial-gradient(circle at 50% 35%, #0f0c1d 0%, #06060a 65%, #000000 100%);">

    <!-- Top feathering gradient to seamlessly blend from the hero space into section 2 -->
    <div class="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-[#06060a]/60 to-transparent pointer-events-none z-0"></div>

    <!-- Subtle Cosmic Glow Orbs matching Hero 2 -->
    <div class="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#7b3fe4]/10 rounded-full blur-[140px] pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#20c4f4]/08 rounded-full blur-[130px] pointer-events-none"></div>

    <div class="max-w-7xl w-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-0 relative z-10 overflow-visible">

      <!-- 3D Particle Circle Ring behind Title & Totem Numbers -->
      <div id="sec2-ring-container" class="absolute pointer-events-none z-0 overflow-visible left-1/2 top-[32%] lg:left-[28%] lg:top-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] sm:w-[820px] sm:h-[820px] lg:w-[940px] lg:h-[940px] opacity-100">
        <canvas id="sec2-ring-canvas" class="w-full h-full block"></canvas>
      </div>

      <!-- LEFT COLUMN: Headline & Subtitle -->
      <div class="w-full lg:w-[32%] xl:w-[30%] space-y-6 flex flex-col justify-center text-left relative z-10">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] block font-semibold mb-2">
          What we cover
        </span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-light tracking-tight text-white leading-[1.15]">
          From the board deck <span class="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1">to the launch film.</span>
        </h2>
        <p class="text-sm md:text-[15px] font-light text-slate-200 leading-relaxed max-w-sm sm:max-w-md [text-shadow:0_1px_14px_rgba(0,0,0,0.95)] lg:[text-shadow:none]">
          One team across all four, so your story stays the same in every format.
        </p>
      </div>

      <!-- RIGHT STAGE: Numbers overlapping the Translucent Black Box -->
      <div class="w-full lg:w-[67%] xl:w-[69%] flex flex-col lg:flex-row items-center relative z-20">

        <!-- MIDDLE: 01, 02, 03, 04 Totem (Overlapping the box by half) -->
        <div class="w-full lg:w-auto flex flex-col items-center justify-center select-none py-4 lg:py-0 overflow-visible relative z-30 pointer-events-auto lg:-mr-[75px] xl:-mr-[85px]">
          <div id="totem-numbers" class="flex flex-col items-center justify-center -space-y-1 sm:-space-y-2 overflow-visible w-full">
${TOTEM_HTML}
          </div>
        </div>

        <!-- RIGHT: Interactive Content Panels Stage -->
        <div class="w-full flex-1 bg-black/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:py-10 lg:pr-10 lg:pl-28 xl:pl-32 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative z-20">
          <div class="cap-panel-stage relative w-full">
${PANELS_HTML}
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- SECTION: PORTFOLIO SHOWCASE (CINEMATIC FULL-BLEED SLIDER) -->
  <script type="application/json" id="portfolioData">{{PORTFOLIO_DATA}}</script>
  <!-- pt-28 (was pt-8 / sm:pt-10): the section snaps to the top of the
       viewport, under the fixed header (73px desktop, 89px phone, measured),
       which covered the WORK eyebrow. 112px clears it on both. Below lg the
       section may grow past one screen (min-h-screen, not h-screen), so the
       extra top room cannot push the arrows out of a short phone's view. -->
  <section id="portfolio" class="page-section relative w-full min-h-screen lg:h-screen overflow-hidden bg-[#09090f] text-white flex flex-col justify-between pb-8 sm:pb-12 pt-28 scroll-mt-0 border-t border-b border-white/10" aria-label="Portfolio Showcase">
    <!-- Full-bleed horizontal accent line crossing screen edge-to-edge beneath the title -->
    <div id="portfolioAccentLine" class="absolute left-0 right-0 w-full h-[1px] pointer-events-none z-[5] transition-all duration-300"></div>

    <!-- Active Background Layers for Smooth Cinematic Cross-fade -->
    <div class="portfolio-bg-stage absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div id="portfolioBgA" class="portfolio-bg-slide absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform scale-100 opacity-100" style="background-image: url('{{PORTFOLIO_STAGE}}'); background-position: {{PORTFOLIO_STAGE_POS}};"></div>
      <div id="portfolioBgB" class="portfolio-bg-slide absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform scale-105 opacity-0"></div>

      <!-- Atmospheric Gradient Overlays for pristine legibility and depth -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/25 z-[2]"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#09090f] via-black/40 to-transparent z-[2]"></div>
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#7b3fe4]/15 via-transparent to-transparent z-[2]"></div>
    </div>

    <!-- Top Stage: Eyebrow text at the top of the image/stage -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 w-full mb-auto">
      <div class="flex items-center gap-2">
        <span class="inline-block w-4 h-[1.5px] bg-[#a78bfa]"></span>
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] font-semibold">
          Work
        </span>
      </div>
    </div>

    <!-- Main Bottom Stage: Texts on Left, Thumbnails & Arrows on Right -->
    <div id="portfolioBottomStage" class="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-14 lg:px-20 w-full">
      <div id="portfolioStageInner" class="relative w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end pt-8 sm:pt-10 md:pt-12 relative z-10">
          
          <!-- Left: ONLY Title and Body text -->
          <div class="lg:col-span-6 xl:col-span-5 space-y-3 pb-1 relative z-10" id="portfolioTextContainer">
            <span id="portfolioKind" class="portfolio-anim-item inline-block rounded-full border border-white/20 bg-black/40 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-slate-200">{{PORTFOLIO_KIND}}</span>
            <!-- mb-5 (over space-y-3's 12px) opens room for the accent line,
                 which ui.js centres in the gap beneath the title. -->
            <h2 id="portfolioTitle" class="portfolio-anim-item text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15] pb-1 mb-5 block">
              {{PORTFOLIO_TITLE_HTML}}
            </h2>
            <p id="portfolioDesc" class="portfolio-anim-item text-xs sm:text-sm md:text-[15px] font-light text-slate-300 leading-relaxed max-w-lg">
              {{PORTFOLIO_SUMMARY}}
            </p>
            <!-- Added: the way into each case study. ui.js keeps its href and
                 label in step with the project on screen. Styled as the site's
                 primary action (Start a Project), because it is this
                 section's one action. -->
            <a id="portfolioReadMore" href="{{PORTFOLIO_HREF}}" aria-label="Read more: {{PORTFOLIO_TITLE_TEXT}} case study" class="portfolio-anim-item group mt-3 inline-flex min-h-11 items-center gap-2 rounded-full border border-cyan-400/40 bg-black/75 px-5 py-2 font-mono text-[11px] uppercase tracking-wider text-cyan-200 shadow-xl backdrop-blur-md transition-all duration-300 hover:border-cyan-300 hover:bg-black/95 hover:text-white">
              <span aria-hidden class="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Read more</span>
              <span aria-hidden class="text-cyan-300 transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </a>
          </div>

          <!-- Right: Compact Uniform Thumbnails & Navigation Arrows -->
          <div class="lg:col-span-6 xl:col-span-7 flex flex-col items-start lg:items-end gap-3 pb-1 relative z-20">
            <!-- Floating Thumbnails Strip (Uniform size, no text) -->
            <!-- The strip scrolls sideways, and a sideways scroller clips
                 vertically too, so a hovered card (lifted 6px, scaled 1.03,
                 25px cyan glow, 45px drop shadow) was cut off at the top.
                 Padding gives it that room; the matching negative margins
                 keep the strip exactly where it was (net 8px / 1px, as the
                 old py-2 px-1). -->
            <div id="portfolioThumbsTrack" class="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar pt-[36px] pb-[46px] px-[28px] -mt-[28px] -mb-[38px] -mx-[27px] scroll-smooth">
              <!-- Dynamically populated by ui.js -->
            </div>

            <!-- Prev and Next Navigation Buttons -->
            <div class="flex items-center gap-2.5 pt-1">
              <button id="portfolioPrev" class="w-10 h-10 rounded-full border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-white/20 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg" aria-label="Previous Slide">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button id="portfolioNext" class="w-10 h-10 rounded-full border border-white/25 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white hover:border-white hover:bg-white/20 active:scale-95 transition-all duration-200 cursor-pointer shadow-lg" aria-label="Next Slide">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>





  <!-- SECTION: START A PROJECT (CTA). Was the free one-page review offer
       until 2026-10-01; now it asks for the project itself. Rebuilt
       2026-10-08 (review): it said "Start a Project" twice, ran two
       paragraphs and a "Clarity / Strategy / Scale" line that said nothing.
       Now: who has trusted us, one sentence, one button. -->
  <section id="start-a-project" class="page-section py-20 sm:py-24 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/10 bg-gradient-to-b from-[#09090f] via-[#13172e] to-[#050507] relative overflow-hidden scroll-mt-20">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7b3fe4]/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#20c4f4]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="max-w-7xl mx-auto relative z-10">

      <!-- Proof: who has trusted us with the work. -->
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10 pb-10 mb-12 border-b border-white/10">
        <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] font-semibold shrink-0">Trusted by</span>
        <ul class="flex flex-wrap items-center gap-x-10 gap-y-3 text-2xl sm:text-[28px] font-light tracking-tight text-white/85" aria-label="Clients">
          <li>LiMRA</li>
          <li>The Grid</li>
        </ul>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <div class="lg:col-span-7 space-y-5">
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] font-semibold block mb-2">Start a project</span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">Tell us what you are <span class="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1">working on.</span></h2>
          <p class="text-sm md:text-[15px] font-light text-slate-200 leading-relaxed max-w-xl">Tell us what it is and when it is due. A senior member of our team replies within a working day.</p>
        </div>
        <div class="lg:col-span-5 lg:justify-self-end w-full max-w-md space-y-4">
          <button class="trigger-intake btn-gravino w-full text-center py-3.5"><span>Start a project &rarr;</span></button>
          <p class="text-[11px] font-mono text-slate-400 text-center flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
            <span>Confidential</span><span aria-hidden="true" class="text-slate-600">&middot;</span><span>NDA available</span><span aria-hidden="true" class="text-slate-600">&middot;</span><span>Copyright transfers to you</span>
          </p>
        </div>
      </div>
    </div>
  </section>

`;
