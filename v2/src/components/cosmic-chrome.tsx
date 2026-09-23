"use client";

import { useEffect, useRef } from "react";

/* ===========================================================================
 * The site chrome — ONE nav and ONE footer, used by every page.
 * ---------------------------------------------------------------------------
 * There used to be two of each. The home page carried Arun's fixed cosmic
 * header and footer; the interior pages carried our own editorial pair from
 * the earlier v2 build. Re-pitching the design tokens dark made the two halves
 * share a palette, but not a language: different logos, different labels for
 * the same destinations, a header that was fixed on one page and absolute on
 * the others, and two unrelated footers. This file is that duplication
 * removed.
 *
 * TERMINOLOGY. The two navs also disagreed about what the pages are called,
 * and one label was doing two jobs — "What We Cover" was both an in-page
 * anchor on the home page AND the name of /services. Standardised here:
 *
 *     What We Cover  -> /services
 *     Portfolio      -> the home page's portfolio section
 *     About          -> /about
 *     Contact        -> /contact
 *
 * "The Model" and "Why Embedded" are gone. Both were dead anchors in Arun's
 * build that were pointed at /services and /about as a repair; keeping them
 * meant two names for each page. This is a copy decision rather than a code
 * one — easy to change, and it lives in NAV below.
 *
 * WHO DRIVES THE INTERACTIONS. On the home page Arun's own scripts already
 * own this markup: ui.js binds the mobile drawer and app4.js toggles
 * `.scrolled` on #main-header. Binding React handlers there too would fire
 * everything twice and the drawer would open and immediately close. So the
 * home page renders `<CosmicNav home />` and leaves the behaviour to his
 * scripts; every other page gets the React implementation, which is the same
 * behaviour written out. The markup is identical either way.
 * ======================================================================== */

const NAV = [
  { label: "What We Cover", href: "/services/" },
  { label: "Portfolio", anchor: "portfolio" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
] as const;

/** In-page on the home page; back to the home page from anywhere else. */
function hrefFor(item: (typeof NAV)[number], home: boolean) {
  if (!("anchor" in item)) return item.href;
  return home ? `#${item.anchor}` : `/#${item.anchor}`;
}

export function CosmicNav({ home = false }: { home?: boolean }) {
  const drawer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* The header is transparent over the hero and gains a background once the
       page moves. On the home page app4.js already does exactly this; running
       both is harmless because it is an idempotent classList toggle on the
       same element, and it means an interior page behaves the same without
       loading the 3D engine to get it. */
    const header = document.getElementById("main-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // On the home page ui.js owns the drawer — see the header comment.
    if (home) return;
    const el = drawer.current;
    if (!el) return;
    const panel = el.querySelector("div");
    const open = () => {
      el.classList.remove("hidden");
      requestAnimationFrame(() => {
        el.classList.add("opacity-100");
        panel?.classList.remove("-translate-y-full");
      });
    };
    const close = () => {
      el.classList.remove("opacity-100");
      panel?.classList.add("-translate-y-full");
      setTimeout(() => el.classList.add("hidden"), 300);
    };
    const btn = document.getElementById("mobileMenuBtn");
    const closeBtn = document.getElementById("closeMobileMenuBtn");
    btn?.addEventListener("click", open);
    closeBtn?.addEventListener("click", close);
    // Tapping a link should dismiss the drawer, not leave it over the page.
    el.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
    return () => {
      btn?.removeEventListener("click", open);
      closeBtn?.removeEventListener("click", close);
    };
  }, [home]);

  return (
    <>
      <header
        id="main-header"
        className="fixed top-0 left-0 w-full z-50 px-6 sm:px-10 md:px-14 lg:px-20 pt-7 pb-4 flex items-center justify-between bg-transparent border-b border-transparent pointer-events-auto"
      >
        <a
          href="/"
          className="flex items-center hero-ui-interactive group"
          aria-label="Gravino, home"
        >
          <img
            src="/arun/logo.png"
            alt="Gravino, Value Has Gravity"
            className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85"
          />
        </a>

        <div className="flex items-center gap-6 sm:gap-8 hero-ui-interactive">
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[13px] font-medium tracking-wide text-slate-300">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={hrefFor(item, home)}
                className="hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* On the home page this opens the teardown modal, which ui.js binds
              by class. Off it there is no modal, so it goes to /contact. */}
          {home ? (
            <button className="trigger-teardown text-xs font-medium px-4 py-2 rounded-full border border-white/20 text-white hover:border-white/60 hover:bg-white/[0.08] transition-all flex items-center gap-1.5 shadow-sm">
              <span>Start a Project</span>
              <span className="text-xs">&rarr;</span>
            </button>
          ) : (
            <a
              href="/contact/"
              className="text-xs font-medium px-4 py-2 rounded-full border border-white/20 text-white hover:border-white/60 hover:bg-white/[0.08] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>Start a Project</span>
              <span className="text-xs">&rarr;</span>
            </a>
          )}

          <button
            id="mobileMenuBtn"
            className="md:hidden text-slate-300 hover:text-white p-1.5 rounded-lg border border-white/10 hover:border-white/30 transition-all"
            aria-label="Open mobile menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <div
        id="mobileMenuDrawer"
        ref={drawer}
        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 hidden opacity-0 transition-opacity duration-300 hero-ui-interactive"
      >
        <div className="p-6 bg-[#111118]/95 border-b border-white/10 -translate-y-full transition-transform duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <a href="/" className="flex items-center">
              <img src="/arun/logo.png" alt="Gravino" className="h-7 w-auto object-contain" />
            </a>
            <button id="closeMobileMenuBtn" className="text-slate-400 hover:text-white p-2" aria-label="Close menu">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-4 pt-5 text-base">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={hrefFor(item, home)}
                className="mobile-nav-link text-slate-200 hover:text-white py-1.5"
              >
                {item.label}
              </a>
            ))}
            {home ? (
              <button className="trigger-teardown w-full mt-3 py-3 px-4 rounded-full bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] text-white font-semibold text-center shadow-lg">
                Start a Project / Free Teardown
              </button>
            ) : (
              <a
                href="/contact/"
                className="w-full mt-3 py-3 px-4 rounded-full bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] text-white font-semibold text-center shadow-lg"
              >
                Start a Project / Free Teardown
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------------
 * The footer. Static markup, no behaviour — the home page and the interior
 * pages render the same component.
 * ------------------------------------------------------------------------ */

export function CosmicFooter({ home = false }: { home?: boolean }) {
  const prefix = home ? "" : "/";
  const onPage = [
    { label: "What we cover", href: `${prefix}#what-we-cover` },
    { label: "Portfolio", href: `${prefix}#portfolio` },
    { label: "Free teardown", href: `${prefix}#teardown` },
  ];

  return (
    <footer
      className="page-section pt-16 pb-8 px-6 sm:px-10 md:px-14 lg:px-20 border-t border-white/10"
      style={{
        background:
          "radial-gradient(circle at 50% 35%, #0f0c1d 0%, #06060a 65%, #000000 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2 lg:pr-10">
            <img
              src="/assets/logo.png"
              alt="Gravino, Value Has Gravity"
              className="h-8 w-auto object-contain"
            />
            <p className="mt-5 text-[11px] font-mono uppercase tracking-[0.18em] text-[#a78bfa]">
              Where Balance Meets Value
            </p>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-slate-400">
              One senior team for the full surface of how your business
              communicates: decks, reports, brand, motion and campaigns.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
              On the home page
            </p>
            {onPage.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm text-slate-300 hover:text-white transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
              Pages
            </p>
            <a href="/services/" className="text-sm text-slate-300 hover:text-white transition-colors">What we cover</a>
            <a href="/about/" className="text-sm text-slate-300 hover:text-white transition-colors">About</a>
            <a href="/contact/" className="text-sm text-slate-300 hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
              Contact
            </p>
            <a
              href="mailto:create@gravino.in"
              className="text-sm text-slate-300 hover:text-white transition-colors break-all"
            >
              create@gravino.in
            </a>
            <p className="text-sm text-slate-400">Chennai, India</p>
            <p className="text-sm text-slate-400">US &middot; Europe &middot; Gulf &middot; India</p>
          </div>
        </div>

        {/* Legal row. The vanity line that used to sit here ("75+ years
            between four people") was a claim, not a footer: it belongs in the
            body copy where it is argued, not under a rule where nobody reads
            it. Statutory links go here instead. */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/privacy/" className="text-xs text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="/terms/" className="text-xs text-slate-400 hover:text-white transition-colors">Terms &amp; Disclaimer</a>
            <a href="mailto:create@gravino.in" className="text-xs text-slate-400 hover:text-white transition-colors">Report an issue</a>
          </nav>

          {/* Set as a small mark rather than a sentence: name, rule, year. */}
          <p className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400">
            <span className="text-slate-300">Gravino</span>
            <span aria-hidden className="h-px w-6 bg-white/20" />
            <span>All rights reserved</span>
            <span aria-hidden className="h-px w-6 bg-white/20" />
            <span>2026</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
