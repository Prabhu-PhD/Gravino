/* ===========================================================================
 * Arun's downstream sections, verbatim.
 * ---------------------------------------------------------------------------
 * From lines 456-891 of his index4.html: what-we-cover, portfolio, teardown,
 * the footer and the teardown modal.
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
 * The markup is checked at generation time for backticks, backslashes and
 * ${, none of which it contains, so it needs no escaping inside the template
 * literal below.
 * ======================================================================== */

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
          Comprehensive Capability
        </span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">
          <span class="block whitespace-nowrap">Four Capabilities.</span>
          <span class="block whitespace-nowrap font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8]">One Connected</span>
          <span class="block whitespace-nowrap font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1 inline-block">Team.</span>
        </h2>
        <p class="text-xs sm:text-sm md:text-[15px] font-light text-slate-300 leading-relaxed max-w-sm sm:max-w-md">
          From business communication to brand, growth and experience—we bring the disciplines together around what your business needs to achieve.
        </p>
      </div>

      <!-- RIGHT STAGE: Numbers overlapping the Translucent Black Box -->
      <div class="w-full lg:w-[67%] xl:w-[69%] flex flex-col lg:flex-row items-center relative z-20">
        
        <!-- MIDDLE: 01, 02, 03, 04 Totem (Overlapping the box by half) -->
        <div class="w-full lg:w-auto flex flex-col items-center justify-center select-none py-4 lg:py-0 overflow-visible relative z-30 pointer-events-auto lg:-mr-[75px] xl:-mr-[85px]">
          <div id="totem-numbers" class="flex flex-col items-center justify-center -space-y-1 sm:-space-y-2 overflow-visible w-full">
            
            <button class="num-selector active" data-target="cap-1" aria-label="01 Business Communication">
              <span class="num-text">01</span>
              <span class="num-label">Business Communication</span>
            </button>
            
            <button class="num-selector" data-target="cap-2" aria-label="02 Brand & Identity">
              <span class="num-text">02</span>
              <span class="num-label">Brand &amp; Identity</span>
            </button>
            
            <button class="num-selector" data-target="cap-3" aria-label="03 Marketing & Growth">
              <span class="num-text">03</span>
              <span class="num-label">Marketing &amp; Growth</span>
            </button>
            
            <button class="num-selector" data-target="cap-4" aria-label="04 Experience & Engagement">
              <span class="num-text">04</span>
              <span class="num-label">Experience &amp; Engagement</span>
            </button>

          </div>
        </div>

        <!-- RIGHT: Interactive Content Panels Stage (Translucent Glass Box with soft blur, No Outline, Overlapped by Numbers) -->
        <div class="w-full flex-1 bg-black/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:py-10 lg:pr-10 lg:pl-28 xl:pl-32 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative z-20">
          <div class="cap-panel-stage relative w-full">

            <!-- 01. BUSINESS COMMUNICATION -->
            <div id="cap-1" class="cap-content-panel is-active space-y-6">
              <h3 class="cap-title text-2xl sm:text-[28px] md:text-3xl font-medium tracking-tight text-[#a855f7] leading-snug">
                Make Every Business<br>Conversation Count.
              </h3>
              <div class="space-y-6 sm:space-y-7 pt-1">
                <div class="cap-item-1 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Communicate with clarity — corporate &amp; business communication
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    From company presentations to executive communications, we turn complex business information into clear, compelling narratives.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Corporate presentations</div>
                    <div>&bull; Annual reports &amp; business documents</div>
                    <div>&bull; Executive &amp; internal communications</div>
                  </div>
                </div>

                <div class="cap-item-2 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Win the room — investor &amp; stakeholder communication
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Build the story, structure the message and design the materials that help leaders communicate with confidence.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Investor presentations</div>
                    <div>&bull; Boardroom presentations</div>
                    <div>&bull; Pitch decks &amp; proposals</div>
                  </div>
                </div>

                <div class="cap-item-3 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Lead with authority — thought leadership
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Turn expertise into communication that builds credibility, influence and trust.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Whitepapers</div>
                    <div>&bull; Reports &amp; insights</div>
                    <div>&bull; Case studies &amp; newsletters</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 02. BRAND & IDENTITY -->
            <div id="cap-2" class="cap-content-panel space-y-6">
              <h3 class="cap-title text-2xl sm:text-[28px] md:text-3xl font-medium tracking-tight text-[#a855f7] leading-snug">
                Build a Brand<br>People Recognise.
              </h3>
              <div class="space-y-6 sm:space-y-7 pt-1">
                <div class="cap-item-1 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Define your difference — brand strategy
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Find the position, purpose and promise that give your business a distinctive place in the market.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Brand strategy</div>
                    <div>&bull; Positioning &amp; messaging</div>
                    <div>&bull; Naming &amp; brand architecture</div>
                  </div>
                </div>

                <div class="cap-item-2 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Make it recognisable — visual identity
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Create a visual system that makes your value visible, consistent and unmistakably yours.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Logo &amp; identity systems</div>
                    <div>&bull; Brand guidelines</div>
                    <div>&bull; Visual communication</div>
                  </div>
                </div>

                <div class="cap-item-3 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Bring the brand to life — brand experience
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Extend your identity across every touchpoint so the brand feels consistent wherever people meet it.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Brand touchpoints &amp; collateral</div>
                    <div>&bull; Environmental &amp; spatial design</div>
                    <div>&bull; Brand launch &amp; rollout</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 03. MARKETING & GROWTH -->
            <div id="cap-3" class="cap-content-panel space-y-6">
              <h3 class="cap-title text-2xl sm:text-[28px] md:text-3xl font-medium tracking-tight text-[#a855f7] leading-snug">
                Turn Attention<br>into Pipeline.
              </h3>
              <div class="space-y-6 sm:space-y-7 pt-1">
                <div class="cap-item-1 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Launch with momentum — go-to-market communication
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Plan and execute product launches and market entries that generate immediate traction and interest.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Product launch campaigns</div>
                    <div>&bull; Go-to-market strategy</div>
                    <div>&bull; Content marketing &amp; distribution</div>
                  </div>
                </div>

                <div class="cap-item-2 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Scale your presence — always-on marketing
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Maintain continuous marketing momentum through consistent communication across your most important channels.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Social &amp; digital content</div>
                    <div>&bull; Campaign creative &amp; execution</div>
                    <div>&bull; Website design &amp; development</div>
                  </div>
                </div>

                <div class="cap-item-3 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Convert at every touchpoint — sales enablement
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Equip sales teams with the communication assets they need to close conversations faster.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Sales decks &amp; collateral</div>
                    <div>&bull; Product one-pagers</div>
                    <div>&bull; Proposal design &amp; templates</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 04. EXPERIENCE & ENGAGEMENT -->
            <div id="cap-4" class="cap-content-panel space-y-6">
              <h3 class="cap-title text-2xl sm:text-[28px] md:text-3xl font-medium tracking-tight text-[#a855f7] leading-snug">
                Make Every Interaction<br>Memorable.
              </h3>
              <div class="space-y-6 sm:space-y-7 pt-1">
                <div class="cap-item-1 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Deliver seamless interactions — digital product communication
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Design the interfaces, onboarding flows and product communication that make digital products feel effortless.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; UX/UI design</div>
                    <div>&bull; Product onboarding &amp; microcopy</div>
                    <div>&bull; Feature announcement communication</div>
                  </div>
                </div>

                <div class="cap-item-2 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Create an impression — spatial &amp; physical brand experience
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Extend brand communication into real-world spaces, creating environments that leave lasting impressions.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Environmental &amp; spatial branding</div>
                    <div>&bull; Event &amp; exhibition design</div>
                    <div>&bull; Print &amp; packaging design</div>
                  </div>
                </div>

                <div class="cap-item-3 space-y-2">
                  <h4 class="text-sm sm:text-[15px] font-medium text-[#38bdf8] leading-snug">
                    Bring stories to life — film, motion &amp; multimedia
                  </h4>
                  <p class="text-xs sm:text-sm md:text-[15px] text-slate-300 font-light leading-relaxed">
                    Use motion, sound and moving image to communicate complex ideas with emotional resonance.
                  </p>
                  <div class="text-xs text-slate-400 font-light space-y-1 pt-1">
                    <div>&bull; Brand films &amp; video</div>
                    <div>&bull; 2D &amp; 3D motion design</div>
                    <div>&bull; Interactive presentations &amp; digital tools</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- SECTION: PORTFOLIO SHOWCASE (CINEMATIC FULL-BLEED SLIDER) -->
  <section id="portfolio" class="page-section relative w-full h-screen min-h-screen overflow-hidden bg-[#09090f] text-white flex flex-col justify-between pb-8 sm:pb-12 pt-8 sm:pt-10 scroll-mt-0 border-t border-b border-white/10" aria-label="Portfolio Showcase">
    <!-- Full-bleed horizontal accent line crossing screen edge-to-edge above title -->
    <div id="portfolioAccentLine" class="absolute left-0 right-0 w-full h-[1px] pointer-events-none z-[5] transition-all duration-300"></div>

    <!-- Active Background Layers for Smooth Cinematic Cross-fade -->
    <div class="portfolio-bg-stage absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div id="portfolioBgA" class="portfolio-bg-slide absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out will-change-transform scale-100 opacity-100" style="background-image: url('assets/portfolio-1.jpg');"></div>
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
            <h2 id="portfolioTitle" class="portfolio-anim-item text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15] pb-1 inline-block">
              Aura <span class="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1 inline-block">Pay</span>
            </h2>
            <p id="portfolioDesc" class="portfolio-anim-item text-xs sm:text-sm md:text-[15px] font-light text-slate-300 leading-relaxed max-w-lg">
              Zero-knowledge biometric authentication and ultra-low latency transaction clearing for sovereign wealth and high-volume banking systems.
            </p>
          </div>

          <!-- Right: Compact Uniform Thumbnails & Navigation Arrows -->
          <div class="lg:col-span-6 xl:col-span-7 flex flex-col items-start lg:items-end gap-3 pb-1 relative z-20">
            <!-- Floating Thumbnails Strip (Uniform size, no text) -->
            <div id="portfolioThumbsTrack" class="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
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





  <!-- SECTION: START WITH A LOOK (CTA) -->
  <section id="teardown" class="page-section py-24 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/10 bg-gradient-to-b from-[#09090f] via-[#13172e] to-[#050507] relative overflow-hidden scroll-mt-20">
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7b3fe4]/15 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#20c4f4]/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div class="lg:col-span-7 space-y-6">
          <span class="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] font-semibold block mb-2">No Pitch Attached</span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">Start with a look, <br><span class="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] pb-1 inline-block">not a commitment.</span></h2>
          <p class="text-xs sm:text-sm md:text-[15px] font-light text-slate-300 leading-relaxed">Send us your current investor deck, report, or brand piece. We'll send back a one-page teardown — what's working, what's costing you, and what we'd change — at no cost, with no pitch attached. It's the fastest way to see how we think.</p>
          <p class="text-xs sm:text-sm md:text-[15px] font-light text-slate-400 leading-relaxed">How we start: tell us what's on your plate; we come back with scope, approach, and a clear quote after a short conversation. Your files and full copyright transfer to you on completion. What you share stays confidential.</p>
          <div class="pt-4 text-base sm:text-lg font-light text-white flex flex-wrap items-center gap-6 border-t border-white/15">
            <span class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-[#20c4f4]"></span>Clarity</span>
            <span class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-[#7b3fe4]"></span>Strategy</span>
            <span class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-[#ec4899]"></span>Scale</span>
          </div>
        </div>
        <div class="lg:col-span-5 flex justify-center lg:justify-end">
          <div class="w-full max-w-md space-y-5 bg-black/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative">
            <span class="text-xs font-mono uppercase tracking-wider text-[#20c4f4] font-semibold block">Confidential Review</span>
            <h3 class="text-xl font-semibold text-white">Request a Free Teardown</h3>
            <p class="text-xs text-slate-300 leading-relaxed font-light">Receive an actionable review of your current deck, report, or brand piece within 24 hours.</p>
            <button class="trigger-teardown btn-gravino w-full text-center py-3.5"><span>Start a Project &rarr;</span></button>
            <div class="text-[11px] font-mono text-slate-400 text-center pt-2 flex items-center justify-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              100% Confidential &middot; Full NDA Available
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- FOOTER
       Rebuilt. His was one row: a logo, seven links and a copyright line.
       It carried no address, no location, no route to the pages that answer
       a buyer's next question, and it repeated in-page anchors as though
       they were destinations.

       This is the same information architecture the interior pages' footer
       already used, in the cosmic treatment: who we are, where to go, and
       how to reach us - with the in-page anchors kept separate from the
       pages, because they are not the same kind of thing. -->
  <footer class="page-section pt-16 pb-10 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/10" style="background: radial-gradient(circle at 50% 35%, #0f0c1d 0%, #06060a 65%, #000000 100%);">
    <div class="max-w-7xl mx-auto">

      <div class="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">

        <!-- Brand block -->
        <div class="col-span-2 sm:col-span-3 lg:col-span-2 lg:pr-10">
          <img src="/assets/logo.png" alt="Gravino — Value Has Gravity" class="h-8 w-auto object-contain">
          <p class="mt-5 text-[11px] font-mono uppercase tracking-[0.18em] text-[#a78bfa]">
            Where Balance Meets Value
          </p>
          <p class="mt-4 max-w-xs text-sm font-light leading-relaxed text-slate-400">
            One senior team for the full surface of how your business
            communicates — decks, reports, brand, motion and campaigns.
          </p>
        </div>

        <!-- On this page -->
        <nav class="flex flex-col gap-3">
          <p class="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">On this page</p>
          <a href="#what-we-cover" class="text-sm text-slate-300 hover:text-white transition-colors">What we cover</a>
          <a href="#portfolio" class="text-sm text-slate-300 hover:text-white transition-colors">Portfolio</a>
          <a href="#teardown" class="text-sm text-slate-300 hover:text-white transition-colors">Free teardown</a>
        </nav>

        <!-- Pages -->
        <nav class="flex flex-col gap-3">
          <p class="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">Pages</p>
          <a href="/services" class="text-sm text-slate-300 hover:text-white transition-colors">What we cover</a>
          <a href="/about" class="text-sm text-slate-300 hover:text-white transition-colors">About</a>
          <a href="/contact" class="text-sm text-slate-300 hover:text-white transition-colors">Contact</a>
          <a href="/for/ceo" class="text-sm text-slate-300 hover:text-white transition-colors">For chief executives</a>
          <a href="/for/cfo" class="text-sm text-slate-300 hover:text-white transition-colors">For CFOs</a>
        </nav>

        <!-- Contact -->
        <div class="flex flex-col gap-3">
          <p class="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">Contact</p>
          <a href="mailto:create@gravino.in" class="text-sm text-slate-300 hover:text-white transition-colors break-all">create@gravino.in</a>
          <p class="text-sm text-slate-400">Chennai, India</p>
          <p class="text-sm text-slate-500">US &middot; Europe &middot; Gulf &middot; India</p>
        </div>

      </div>

      <div class="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="text-xs font-mono text-slate-500">&copy; 2026 Gravino &nbsp;/&nbsp; gravino.in</p>
        <p class="text-xs font-mono text-slate-500">75+ years between four people, Chennai</p>
      </div>

    </div>
  </footer>

  <!-- INTERACTIVE TEARDOWN / PROJECT KICKOFF MODAL -->
  <div id="teardownModal" class="modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
    <div class="modal-content w-full max-w-xl bg-[#182447] border border-[#a7b6f2]/25 rounded-3xl shadow-2xl p-6 sm:p-10 relative">
      <button id="closeTeardownBtn" class="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close modal">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
      <div id="formStateInitial">
        <div class="mb-6">
          <span class="text-xs font-mono uppercase tracking-wider text-[#20c4f4]">Start with a look, not a commitment</span>
          <h3 class="text-2xl font-light text-white mt-1">Get Your 1-Page Teardown</h3>
          <p class="text-slate-300 text-xs sm:text-sm mt-2">Send us your current investor deck, report, or brand piece. We'll send back what's working, what's costing you, and what we'd change — at no cost, with no pitch attached.</p>
        </div>
        <form id="teardownForm" class="space-y-4">
          <div><label class="block text-xs font-mono text-slate-300 mb-1">Your Name *</label><input type="text" required name="name" placeholder="Jane Doe" class="w-full bg-[#09090f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7b3fe4]"></div>
          <div><label class="block text-xs font-mono text-slate-300 mb-1">Work Email *</label><input type="email" required name="email" placeholder="jane@company.com" class="w-full bg-[#09090f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7b3fe4]"></div>
          <div><label class="block text-xs font-mono text-slate-300 mb-1">Company / Project *</label><input type="text" required name="company" placeholder="Acme Technologies" class="w-full bg-[#09090f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7b3fe4]"></div>
          <div><label class="block text-xs font-mono text-slate-300 mb-1">Asset for Review *</label><select name="asset" class="w-full bg-[#09090f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7b3fe4]"><option value="deck">Investor Pitch Deck</option><option value="report">Annual / ESG Impact Report</option><option value="brand">Brand Identity &amp; Positioning</option><option value="motion">Product Launch Film / Video Narrative</option><option value="other">Full Surface Communications</option></select></div>
          <div><label class="block text-xs font-mono text-slate-300 mb-1">Link to Deck or Brief Context (Optional)</label><input type="text" name="link" placeholder="https://docsend.com/view/... or brief note" class="w-full bg-[#09090f] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7b3fe4]"></div>
          <div class="pt-3"><button type="submit" class="btn-gravino w-full py-3 text-sm">Submit for Confidential Review &rarr;</button></div>
          <p class="text-[11px] text-slate-400 text-center font-mono">Files remain strictly confidential. Full copyright transfer on completion.</p>
        </form>
      </div>
      <div id="formStateSuccess" class="hidden text-center py-8 space-y-4">
        <div class="w-14 h-14 rounded-full bg-[#20c4f4]/20 border border-[#20c4f4] text-[#20c4f4] mx-auto flex items-center justify-center"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
        <h3 class="text-2xl font-light text-white">Your Email Is Ready to Send</h3>
        <p class="text-slate-300 text-sm max-w-md mx-auto">Your mail app should have opened with the request filled in — hit send and it reaches us directly. Once it lands, we'll send back your confidential 1-page teardown within 24 hours. No pitch attached.</p>
        <p class="text-slate-400 text-xs max-w-md mx-auto">Nothing happened? Write to <a href="mailto:create@gravino.in" class="text-[#20c4f4] underline">create@gravino.in</a>.</p>
        <button onclick="document.getElementById('teardownModal').classList.remove('active')" class="btn-gravino-outline text-xs mt-4">Close Window</button>
      </div>
    </div>
  </div>

`;
