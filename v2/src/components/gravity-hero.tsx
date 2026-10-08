import { CosmicNav } from "./cosmic-chrome";

/* ===========================================================================
 * The gravity hero - Arun's dual-hero scene, mounted inside Next.
 * ---------------------------------------------------------------------------
 * Markup converted from his index4.html rather than retyped, so the class
 * strings and element ids match what the engine expects exactly. The engine
 * finds its targets by id, so renaming anything here silently disables the
 * behaviour attached to it.
 *
 * THE ENGINE IS NOT PORTED. `public/arun/app4.js` is byte-identical to the
 * file Arun shipped, and it runs on the three r128 he shipped with it. See
 * `arun-runtime.tsx`, which loads it - this component is markup only, and
 * renders on the server.
 *
 * The scene carries several hundred hand-tuned values, and every defect the
 * earlier ES-module port produced - flattened colour, texture encoding, the
 * glass shell turning into a mirror - came from the r128 -> r184 jump that
 * the port itself introduced. Running his version removes that whole class
 * of bug instead of chasing it.
 * ======================================================================== */

export function GravityHero() {
  return (
    <>


        {/* ================================================================= */}
        {/* FIXED COSMIC NEBULA BACKGROUND — EXACT MATCH TO index.html          */}
        {/* ================================================================= */}
        <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none opacity-45 scale-105"
             style={{backgroundImage: "url('/arun/hero-bg.jpg')", opacity: "0.45", filter: "blur(10px)"}}></div>
        <div className="fixed inset-0 z-0 bg-gradient-to-b from-black/20 via-transparent to-black pointer-events-none"></div>

        {/* ================================================================= */}
        {/* FIXED 3D WEBGL CANVAS CONTAINER                                   */}
        {/* ================================================================= */}
        <div id="canvas-container"></div>

        {/* ================================================================= */}
        {/* ================================================================= */}
        {/* PERSISTENT TOP NAVIGATION — sleek sticky black box header         */}
        {/* ================================================================= */}
        <CosmicNav home />


        {/* The "Planetary Orbit" / "Return Home" toggle that sat here was
            removed at the client's request (2026-09-27): its label read as a
            second navigation and competed with "Start a Project", which is
            the one action that matters. Its look was given to that button in
            cosmic-chrome.tsx.

            Nothing is stranded by removing it. app4.js guards every lookup of
            #startCosmicTravelBtn, #cosmicBtnText and #cosmicToggleWrapper
            with a null check, and the second scene (the four capabilities)
            is still reached by scrolling, wheel and swipe, which is how most
            visitors got there anyway. */}

        {/* Mobile Navigation Drawer */}
{/* ================================================================= */}
        {/* HERO PINNED WRAPPER (100vh for seamless instant scroll from downstream sections) */}
        {/* ================================================================= */}
  
      {/* ================================================================= */}
        {/* HERO PINNED WRAPPER (100vh for seamless instant scroll from downstream sections) */}
        {/* ================================================================= */}
        {/* Skip-link target. A separate marker so none of the ids app4.js and
            ui.js look up are touched. */}
        <span id="main" tabIndex={-1} className="sr-only" />
        <div id="hero-pinned-wrapper" className="relative" style={{height: "100vh", zIndex: "10"}}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">

            {/* ============================================================= */}
            {/* HERO 1 UI — Where Balance Meets Value                          */}
            {/* ============================================================= */}
            <div id="hero1-ui" className="absolute inset-0 flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 pt-28 pb-8" style={{opacity: "1"}}>
              {/* Phones: the copy sat straight on the particle field and was
                  hard to read (review, 2026-10-08). A scrim behind the bottom
                  third, inside #hero1-ui so it fades out with the copy. */}
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/85 via-black/55 to-transparent lg:hidden" />
              {/* Desktop: the same problem where the copy sits, bottom right,
                  on the densest part of the swirl. A soft dark glow behind
                  that corner only; the orb and the swirl stay untouched. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block bg-[radial-gradient(ellipse_42%_46%_at_74%_78%,rgba(0,0,0,0.78),rgba(0,0,0,0.45)_55%,transparent_100%)]" />

              {/* Center Interactive Hint */}
              <div className="flex-grow flex items-center justify-center py-8 hero-ui-layer">
                <div className="hero-ui-interactive opacity-0 hover:opacity-100 transition-opacity duration-500 cursor-pointer select-none">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#a7b6f2]/80 bg-[#182447]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    • Drag the orbital moon or move cursor to interact with particle gravitational field •
                  </span>
                </div>
              </div>

              {/* Hero Content Bottom Area. relative z-[1]: above the phone scrim. */}
              <div className="relative z-[1] w-full hero-ui-layer">
                <div className="flex flex-col lg:flex-row items-end justify-between pb-6 gap-8">
                  <div className="hidden lg:block lg:w-5/12"></div>
                  <div className="w-full lg:w-7/12 lg:max-w-xl lg:ml-auto ml-auto lg:translate-x-6 xl:translate-x-10 -translate-y-6 sm:-translate-y-8 md:-translate-y-10 hero-ui-interactive space-y-4 text-left">
                    {/* The offer, on the first screen (the client, 2026-10-08).
                        The tagline is the eyebrow; the headline is the
                        positioning: an EMBEDDED partner. */}
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] block font-semibold mb-2">
                      Where Balance Meets Value
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">
                      The communications team <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8]">inside your business.</span>
                    </h1>
                    <p className="text-sm md:text-[15px] font-light text-slate-200 leading-relaxed max-w-sm sm:max-w-md">
                      Investor decks, reports, brand and campaigns, made by a senior team that works as part of yours.
                    </p>

                  </div>
                </div>
              </div>

            </div>
            {/* /hero1-ui */}

            {/* ============================================================= */}
            {/* HERO 2 UI: Title, Body, 4 Captions (2 left, 2 right over planet) & Footer Strip */}
            {/* ============================================================= */}
            <div id="hero2-ui" className="absolute inset-0 flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 pt-28 pb-8 pointer-events-none opacity-0 z-30">
              {/* Top/Middle Content Block: Title & Body (3 lines title, compact width) */}
              <div className="max-w-xl space-y-3 pt-10 sm:pt-14 md:pt-16">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] block font-semibold mb-2">
                  What we cover
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">
                  Four capabilities. <br />
                  <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8]">One embedded partner.</span>
                </h2>

                <p className="text-sm md:text-[15px] font-light text-slate-200 leading-relaxed max-w-sm sm:max-w-md">
                  The same people across every format, so nothing is lost between the deck, the brand and the campaign.
                </p>
                {/* Mobile (< md): the four disciplines as a plain list under the
                    body (the client, 2026-10-01), not four boxes. Each keeps its
                    dot colour from the captions over the planet. */}
                <ul className="md:hidden pt-2 max-w-lg space-y-2 pointer-events-auto">
                  {[
                    ["Business Communication", "bg-white"],
                    ["Brand Identity", "bg-[#24c1ff]"],
                    ["Marketing & Growth", "bg-[#cc4ec7]"],
                    ["Experience & Engagement", "bg-[#7642cf]"],
                  ].map(([label, dot]) => (
                    <li key={label} className="flex items-center gap-3 text-sm font-light text-slate-200">
                      <span aria-hidden className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${dot}`} />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4 Caption Boxes OVER THE PLANET: 2 on the left, 2 on the right (Black fill with transparency, generous padding) */}
              <div className="hidden md:block pointer-events-none">
                {/* 1. Left of planet - Upper: Business Communication (moved right over planet) */}
                <div id="caption-box-1" className="absolute pointer-events-auto flex items-center gap-3 bg-black/85 backdrop-blur-md border border-white/25 hover:border-white/70 rounded-xl shadow-2xl transition-all duration-200 cursor-default select-none" style={{left: "39%", top: "48%", padding: "10px 20px"}}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] flex-shrink-0"></span>
                  <span className="text-sm sm:text-[15px] font-medium text-white tracking-tight whitespace-nowrap">Business Communication</span>
                </div>

                {/* 2. Left of planet - Lower: Brand Identity (moved right over planet) */}
                <div id="caption-box-2" className="absolute pointer-events-auto flex items-center gap-3 bg-black/85 backdrop-blur-md border border-cyan-400/35 hover:border-cyan-400/80 rounded-xl shadow-2xl transition-all duration-200 cursor-default select-none" style={{left: "36%", top: "68%", padding: "10px 20px"}}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#24c1ff] shadow-[0_0_8px_#24c1ff] flex-shrink-0"></span>
                  <span className="text-sm sm:text-[15px] font-medium text-white tracking-tight whitespace-nowrap">Brand Identity</span>
                </div>

                {/* 3. Right of planet - Upper: Marketing & Growth */}
                <div id="caption-box-3" className="absolute pointer-events-auto flex items-center gap-3 bg-black/85 backdrop-blur-md border border-pink-400/35 hover:border-pink-400/80 rounded-xl shadow-2xl transition-all duration-200 cursor-default select-none" style={{left: "74%", top: "46%", padding: "10px 20px"}}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#cc4ec7] shadow-[0_0_8px_#cc4ec7] flex-shrink-0"></span>
                  <span className="text-sm sm:text-[15px] font-medium text-white tracking-tight whitespace-nowrap">Marketing &amp; Growth</span>
                </div>

                {/* 4. Right of planet - Lower: Experience & Engagement */}
                <div id="caption-box-4" className="absolute pointer-events-auto flex items-center gap-3 bg-black/85 backdrop-blur-md border border-purple-400/35 hover:border-purple-400/80 rounded-xl shadow-2xl transition-all duration-200 cursor-default select-none" style={{left: "72%", top: "68%", padding: "10px 20px"}}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7642cf] shadow-[0_0_8px_#7642cf] flex-shrink-0"></span>
                  <span className="text-sm sm:text-[15px] font-medium text-white tracking-tight whitespace-nowrap">Experience &amp; Engagement</span>
                </div>
              </div>

              {/* Direct Explore Capabilities Pill Button */}
              <div className="flex justify-center pt-2 pb-1 hero-ui-interactive pointer-events-auto">
                <a href="#what-we-cover" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-400/40 hover:border-purple-400 bg-purple-950/60 hover:bg-purple-900/80 backdrop-blur text-xs tracking-wider text-purple-200 hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                  <span>See what we cover</span>
                  <svg className="w-3.5 h-3.5 transform group-hover:translate-y-0.5 transition-transform text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                </a>
              </div>

            </div>
            {/* /hero2-ui */}

            {/* ============================================================= */}
            {/* SVG LEADER LINES: connects fixed caption boxes to 3D planetary rings */}
            {/* ============================================================= */}
            <svg id="ring-lines-svg" className="fixed inset-0 w-full h-full pointer-events-none z-20" style={{opacity: "0"}}>
              <defs>
                <filter id="glow-white" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffffff"/>
                </filter>
                <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#24c1ff"/>
                </filter>
                <filter id="glow-pink" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#cc4ec7"/>
                </filter>
                <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#7642cf"/>
                </filter>
              </defs>

              <path id="leader-line-1" fill="none" stroke="rgba(255, 255, 255, 0.40)" strokeWidth="1.2" strokeDasharray="4 3"/>
              <circle id="ring-dot-1" r="3.5" fill="#ffffff" filter="url(#glow-white)"/>

              <path id="leader-line-2" fill="none" stroke="rgba(36, 193, 255, 0.50)" strokeWidth="1.2" strokeDasharray="4 3"/>
              <circle id="ring-dot-2" r="3.5" fill="#24c1ff" filter="url(#glow-cyan)"/>

              <path id="leader-line-3" fill="none" stroke="rgba(204, 78, 199, 0.50)" strokeWidth="1.2" strokeDasharray="4 3"/>
              <circle id="ring-dot-3" r="3.5" fill="#cc4ec7" filter="url(#glow-pink)"/>

              <path id="leader-line-4" fill="none" stroke="rgba(118, 66, 207, 0.50)" strokeWidth="1.2" strokeDasharray="4 3"/>
              <circle id="ring-dot-4" r="3.5" fill="#7642cf" filter="url(#glow-purple)"/>
            </svg>


          </div>
        </div>
        {/* /hero-pinned-wrapper */}

        {/* ================================================================= */}
        {/* ALL DOWNSTREAM SECTIONS — z-20 + solid backgrounds over fixed canvas*/}
        {/* ================================================================= */}

        {/* ================================================================= */}
        {/* SECTION 2: FOUR CAPABILITIES (Index 4: Dark Totem Design)        */}
        {/* ================================================================= */}
  
    </>
  );
}
