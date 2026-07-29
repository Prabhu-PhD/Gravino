"use client";

import { useEffect, useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { CurrencyToggle } from "./currency-toggle";
import { Cta } from "./cta";

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-pill px-4 py-2.5 transition-all duration-500 sm:px-5 ${
          scrolled ? "glass" : "border border-transparent"
        }`}
      >
        <a href="#top" className="text-xl font-extrabold tracking-tight text-ink">
          {SITE.wordmark}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CurrencyToggle />
          <Cta href="#contact" className="px-4 py-2">
            Start a project
          </Cta>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center text-ink md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`mx-auto mt-2 max-w-6xl overflow-hidden transition-all duration-500 md:hidden ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="glass flex flex-col gap-1 rounded-glass p-4">
          {NAV.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/60 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <div className="mt-2 flex items-center justify-between gap-3 px-1">
            <CurrencyToggle />
            <Cta href="#contact" className="px-4 py-2">
              Start a project
            </Cta>
          </div>
        </div>
      </div>
    </header>
  );
}
