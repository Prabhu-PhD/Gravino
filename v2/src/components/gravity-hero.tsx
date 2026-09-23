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


        {/* Floating Planetary Orbit Toggle Button (Positioned in top-right) */}
        <div id="cosmicToggleWrapper" className="fixed top-[82px] right-6 sm:right-10 md:right-14 lg:right-20 z-40 pointer-events-auto transition-all duration-300">
          <button id="startCosmicTravelBtn" className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 hover:bg-black/95 border border-cyan-400/40 hover:border-cyan-300 backdrop-blur-md transition-all duration-300 shadow-xl text-[11px] font-mono tracking-wider uppercase text-cyan-200 hover:text-white cursor-pointer group">
            <span className="w-2 h-2 rounded-full bg-cyan-400 group-hover:scale-125 transition-transform animate-pulse"></span>
            <span id="cosmicBtnText">Planetary Orbit</span>
            <span className="text-cyan-300 text-xs group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
{/* ================================================================= */}
        {/* HERO PINNED WRAPPER (100vh for seamless instant scroll from downstream sections) */}
        {/* ================================================================= */}
  
      {/* ================================================================= */}
        {/* HERO PINNED WRAPPER (100vh for seamless instant scroll from downstream sections) */}
        {/* ================================================================= */}
        <div id="hero-pinned-wrapper" className="relative" style={{height: "100vh", zIndex: "10"}}>
          <div className="sticky top-0 h-screen w-full overflow-hidden">

            {/* ============================================================= */}
            {/* HERO 1 UI — Where Balance Meets Value                          */}
            {/* ============================================================= */}
            <div id="hero1-ui" className="absolute inset-0 flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-20 pt-28 pb-8" style={{opacity: "1"}}>

              {/* Center Interactive Hint */}
              <div className="flex-grow flex items-center justify-center py-8 hero-ui-layer">
                <div className="hero-ui-interactive opacity-0 hover:opacity-100 transition-opacity duration-500 cursor-pointer select-none">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#a7b6f2]/80 bg-[#182447]/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    • Drag the orbital moon or move cursor to interact with particle gravitational field •
                  </span>
                </div>
              </div>

              {/* Hero Content Bottom Area */}
              <div className="w-full hero-ui-layer">
                <div className="flex flex-col lg:flex-row items-end justify-between pb-6 gap-8">
                  <div className="hidden lg:block lg:w-5/12"></div>
                  <div className="w-full lg:w-7/12 lg:max-w-lg lg:ml-auto ml-auto lg:translate-x-6 xl:translate-x-10 -translate-y-6 sm:-translate-y-8 md:-translate-y-10 hero-ui-interactive space-y-4 text-left">
                    <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#a78bfa] block font-semibold mb-2">
                      Value Has Gravity
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">
                      What Has Value, <br /><span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8]">Has Gravity.</span>
                    </h1>
                    <p className="text-xs sm:text-sm md:text-[15px] font-light text-slate-300 leading-relaxed max-w-sm sm:max-w-md">
                      Gravity draws things together. Balance gives them form. And when the two meet, value becomes something people can feel, recognise and remember.
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
                  Embedded Communications Partner
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-light tracking-tight text-white leading-[1.15]">
                  One Team for Every <br />
                  Business Communication &amp; <br />
                  <span className="font-normal text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#38bdf8]">Marketing Need.</span>
                </h2>

                <p className="text-xs sm:text-sm md:text-[15px] font-light text-slate-300 leading-relaxed max-w-sm sm:max-w-md">
                  From business communication and brand identity to marketing and experiences, Gravino brings every discipline together under one connected team.
                </p>
              </div>

              {/* 4 Caption Boxes OVER THE PLANET: 2 on the left, 2 on the right (Black fill with transparency, generous padding) */}
              <div className="hidden md:block pointer-events-none">
                {/* 1. Left of planet - Upper: Business Communication (moved right over planet) */}
                <div id="caption-box-1" className="absolute pointer-events-auto flex items-center gap-3 bg-black/85 backdrop-blur-md border border-white/25 hover:border-white/70 rounded-xl shadow-2xl transition-all duration-200 cursor-default select-none" style={{left: "39%", top: "48%", padding: "10px 20px"}}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_#ffffff] flex-shrink-0"></span>
                  <span className="text-sm sm:text-[15px] font-medium text-white tracking-tight whitespace-nowrap">Business Communication</span>
                </div>

                {/* 2. Left of planet - Lower: Brand & Identity (moved right over planet) */}
                <div id="caption-box-2" className="absolute pointer-events-auto flex items-center gap-3 bg-black/85 backdrop-blur-md border border-cyan-400/35 hover:border-cyan-400/80 rounded-xl shadow-2xl transition-all duration-200 cursor-default select-none" style={{left: "36%", top: "68%", padding: "10px 20px"}}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#24c1ff] shadow-[0_0_8px_#24c1ff] flex-shrink-0"></span>
                  <span className="text-sm sm:text-[15px] font-medium text-white tracking-tight whitespace-nowrap">Brand &amp; Identity</span>
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

              {/* Mobile (< md): 2x2 grid below text with black transparency fill */}
              <div className="md:hidden pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-lg pointer-events-auto">
                <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                  <span className="text-xs sm:text-sm font-medium text-white block">Business Communication</span>
                </div>
                <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md border border-cyan-400/30 rounded-xl px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#24c1ff]"></span>
                  <span className="text-xs sm:text-sm font-medium text-white block">Brand &amp; Identity</span>
                </div>
                <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md border border-pink-400/30 rounded-xl px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#cc4ec7]"></span>
                  <span className="text-xs sm:text-sm font-medium text-white block">Marketing &amp; Growth</span>
                </div>
                <div className="flex items-center gap-3 bg-black/85 backdrop-blur-md border border-purple-400/30 rounded-xl px-4 py-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#7642cf]"></span>
                  <span className="text-xs sm:text-sm font-medium text-white block">Experience &amp; Engagement</span>
                </div>
              </div>

              {/* Direct Explore Capabilities Pill Button */}
              <div className="flex justify-center pt-2 pb-1 hero-ui-interactive pointer-events-auto">
                <a href="#what-we-cover" className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-purple-400/40 hover:border-purple-400 bg-purple-950/60 hover:bg-purple-900/80 backdrop-blur text-xs tracking-wider text-purple-200 hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                  <span>Explore 4 Capabilities</span>
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
