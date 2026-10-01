"use client";

/* ===========================================================================
 * The case-study toolbar: how a visitor moves around the portfolio.
 * ---------------------------------------------------------------------------
 * A case study is an immersive page in the project's own brand, so it gets a
 * slim toolbar instead of the full site nav:
 *
 *   [Gravino]  Work / Pivo  (Concept brand pitch)    01/01  <  [grid]  >  [x]
 *
 *   Close (x, or Esc)  back to where the visitor came from on this site (the
 *                      home slider, the index), or the index if they arrived
 *                      from outside, so Close never leaves the site.
 *   All work (grid)    the portfolio index.
 *   Previous / Next    neighbouring case studies, wrapping round. Rendered only
 *                      when there is more than one case study; with one, they
 *                      would lead back to the same page.
 *
 * Every control is a 44px target with a visible label for screen readers and
 * a tooltip for the mouse.
 * ======================================================================== */

import { useEffect } from "react";

type Link = { href: string; title: string } | null;

export function CaseToolbar({
  title,
  kind,
  index,
  total,
  prev,
  next,
}: {
  title: string;
  kind: string;
  index: number;
  total: number;
  prev: Link;
  next: Link;
}) {
  const close = () => {
    const ref = document.referrer;
    let sameSite = false;
    try {
      sameSite = !!ref && new URL(ref).origin === window.location.origin;
    } catch {
      sameSite = false;
    }
    if (sameSite && window.history.length > 1) window.history.back();
    else window.location.href = "/portfolio/";
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Esc belongs to the project form while it is open.
      if (e.key !== "Escape") return;
      if (document.querySelector("#intakeModal.active")) return;
      close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-3 px-4 sm:px-6">
        <a href="/" aria-label="Gravino, home" className="shrink-0 rounded-md">
          <img src="/arun/logo.png" alt="" className="h-8 w-auto" />
        </a>

        <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
          <ol className="flex min-w-0 items-center gap-2 text-sm">
            <li className="hidden sm:block">
              <a href="/portfolio/" className="text-slate-400 transition-colors hover:text-white">Work</a>
            </li>
            <li aria-hidden className="hidden text-slate-600 sm:block">/</li>
            <li className="min-w-0 leading-tight" aria-current="page">
              <span className="block truncate font-medium text-white">{title}</span>
              {/* Under the title on phones: the kind is never hidden, since it is
                  what keeps a concept pitch from reading as a commission. */}
              <span className="block truncate font-mono text-[10px] uppercase tracking-wider text-slate-400 md:hidden">{kind}</span>
            </li>
            <li className="hidden shrink-0 rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-slate-300 md:block">
              {kind}
            </li>
          </ol>
        </nav>

        {total > 1 ? (
          <span className="hidden font-mono text-xs tabular-nums text-slate-400 sm:block" aria-label={`Project ${index + 1} of ${total}`}>
            {pad(index + 1)} / {pad(total)}
          </span>
        ) : null}

        <div className="flex items-center gap-1">
          {prev ? (
            <IconLink href={`/portfolio/${prev.href}/`} label={`Previous project: ${prev.title}`}>
              <path d="M15 19l-7-7 7-7" />
            </IconLink>
          ) : null}
          <IconLink href="/portfolio/" label="All work">
            <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
            <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
            <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
            <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
          </IconLink>
          {next ? (
            <IconLink href={`/portfolio/${next.href}/`} label={`Next project: ${next.title}`}>
              <path d="M9 5l7 7-7 7" />
            </IconLink>
          ) : null}
          <button
            type="button"
            onClick={close}
            title="Close (Esc)"
            aria-label="Close this case study"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-slate-200 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      className="grid h-11 w-11 place-items-center rounded-full text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
    </a>
  );
}
