import Link from "next/link";
import { SiteNav, SiteFooter } from "./site-chrome";

export const SHELL = "mx-auto max-w-[88rem] px-6 md:px-10";

/** Standard interior-page header: pale wash, eyebrow, headline, lede. */
export function PageHead({
  eyebrow,
  headline,
  accent,
  lede,
}: {
  eyebrow: string;
  headline: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <section className="bg-wash relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div aria-hidden className="grain-layer" />
      <div className={`${SHELL} relative`}>
        <p className="label text-on-paper-dim">{eyebrow}</p>
        <h1 className="display mt-6 max-w-4xl text-[clamp(2.3rem,5vw,4.2rem)]">
          {headline}
          {accent ? (
            <>
              {" "}
              <span className="text-gradient">{accent}</span>
            </>
          ) : null}
        </h1>
        {lede ? (
          <p className="mt-8 max-w-2xl text-[1.05rem] leading-relaxed text-on-paper-dim">
            {lede}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** The closing conversion band, shared by every interior page. */
export function ClosingCta({
  headline,
  body,
  cta = "Send us a deck",
}: {
  headline: string;
  body: string;
  cta?: string;
}) {
  return (
    <section className="bg-ink py-24 text-on-ink md:py-32">
      <div className={SHELL}>
        <p className="label text-on-ink-dim">No cost, no pitch</p>
        <h2 className="display mt-6 max-w-3xl text-[clamp(1.9rem,3.6vw,3rem)]">
          {headline}
        </h2>
        <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-on-ink-dim">
          {body}
        </p>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-on-ink px-7 py-4 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
        >
          {cta}
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </>
  );
}
