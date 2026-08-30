import Link from "next/link";
import { Logomark } from "./logomark";
import { SITE, NAV, SOCIALS } from "@/lib/site";

/* Nav and footer. */

function Wordmark({ dark = false, px = 21 }: { dark?: boolean; px?: number }) {
  return (
    <Link href="/" aria-label={`${SITE.name} — home`} className="inline-block">
      <Logomark px={px} dark={dark} />
    </Link>
  );
}

export function SiteNav() {
  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between px-6 py-6 md:px-10">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="label text-on-paper-dim transition-colors hover:text-on-paper"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contact"
          className="label rounded-full bg-on-paper px-4 py-2.5 text-paper transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
        >
          Send us a deck
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-ink px-6 pt-16 pb-10 text-on-ink md:px-10">
      <div className="mx-auto max-w-[88rem]">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div>
            <Wordmark dark px={26} />
            <p className="label mt-4 text-on-ink-dim">{SITE.lockupLine}</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-on-ink-dim">
              {SITE.tagline}. One senior team for the full surface of how your
              business communicates.
            </p>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="label text-on-ink-dim">Site</p>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm hover:text-accent-on-ink">
                {n.label}
              </Link>
            ))}
          </nav>

          <nav className="flex flex-col gap-3">
            <p className="label text-on-ink-dim">For</p>
            <Link href="/for/ceo" className="text-sm hover:text-accent-on-ink">
              Chief executives
            </Link>
            <Link href="/for/cfo" className="text-sm hover:text-accent-on-ink">
              Chief financial officers
            </Link>
          </nav>

          <div className="flex flex-col gap-3">
            <p className="label text-on-ink-dim">Contact</p>
            <a href={`mailto:${SITE.email}`} className="text-sm hover:text-accent-on-ink">
              {SITE.email}
            </a>
            <p className="text-sm text-on-ink-dim">{SITE.location}</p>
            <p className="text-sm text-on-ink-dim">{SITE.markets}</p>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink-line pt-6">
          <p className="label text-on-ink-dim">
            &copy; {new Date().getFullYear()} {SITE.name} &nbsp;/&nbsp;{" "}
            {SITE.domain}
          </p>
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} className="label text-on-ink-dim hover:text-on-ink">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
