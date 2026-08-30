import Link from "next/link";
import Image from "next/image";
import { SiteNav, SiteFooter } from "./site-chrome";
import { SHELL, CornerMarks } from "./editorial";
import { FlutedPane } from "./fluted-pane";
import { SITE } from "@/lib/site";

export { SHELL } from "./editorial";

/* ===========================================================================
 * Interior-page shell, carrying the same editorial system as the home page:
 * a visible grid, a running index, hairline rules, corner ticks, and one
 * loud full-bleed moment per page.
 * ======================================================================== */

/** The hero's visible measure lines, reused so every page sits on one grid. */
function GridLines() {
  return (
    <div aria-hidden className={`${SHELL} pointer-events-none absolute inset-0`}>
      <div className="relative h-full">
        <span className="absolute inset-y-0 left-0 w-px bg-on-paper/10" />
        <span className="absolute inset-y-0 right-0 w-px bg-on-paper/10" />
      </div>
    </div>
  );
}

export function PageHead({
  headline,
  accent,
  lede,
}: {
  headline: string;
  accent?: string;
  lede?: string;
}) {
  return (
    <section className="bg-wash relative overflow-hidden pt-36 pb-20 md:pt-44 md:pb-28">
      <div aria-hidden className="grain-layer" />
      <GridLines />
      <div className={`${SHELL} relative`}>
        <h1 className="display max-w-4xl text-[clamp(2.3rem,4.9vw,4.1rem)]">
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

        <div className="mt-14 flex items-center justify-between border-t border-on-paper/15 pt-5">
          <span className="label text-on-paper-dim">{SITE.location}</span>
          <span className="label hidden text-on-paper-dim sm:block">
            {SITE.lockupLine}
          </span>
        </div>
      </div>
    </section>
  );
}

/**
 * The full-bleed loud moment. One per page, always a brand render behind big
 * type with a fluted pane over one half — the Southern West International /
 * Clarity motif. `objectPosition` lets the same three renders read as
 * different images across pages rather than repeating a crop.
 */
export function StatementBand({
  src,
  objectPosition = "center",
  children,
  fluteOn = "right",
}: {
  src: string;
  objectPosition?: string;
  children: React.ReactNode;
  fluteOn?: "left" | "right";
}) {
  const right = fluteOn === "right";
  return (
    <section className="relative isolate overflow-hidden bg-ink text-on-ink">
      <Image
        src={src}
        alt=""
        aria-hidden
        width={3200}
        height={1800}
        sizes="100vw"
        style={{ objectPosition }}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: right
            ? "linear-gradient(90deg, rgba(10,8,18,0.9) 0%, rgba(10,8,18,0.66) 48%, rgba(10,8,18,0.12) 100%)"
            : "linear-gradient(270deg, rgba(10,8,18,0.9) 0%, rgba(10,8,18,0.66) 48%, rgba(10,8,18,0.12) 100%)",
        }}
      />
      {/* Half the band is seen through fluted glass — the image itself is
          sliced and offset per rib, not overlaid with stripes. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <FlutedPane
          src={src}
          side={fluteOn}
          objectPosition={objectPosition}
        />
      </div>

      <div className={`${SHELL} py-24 md:py-36`}>
        {/* Held to the un-fluted half. The glass side is bright and busy —
            any copy crossing onto it stops being readable, which is exactly
            what happened the first time this ran full width. */}
        <p
          className={`display text-[clamp(1.9rem,4vw,3.4rem)] text-white md:max-w-[46%] ${
            right ? "max-w-3xl" : "ml-auto max-w-3xl text-right"
          }`}
        >
          {children}
        </p>
      </div>
    </section>
  );
}

/** The closing conversion band, shared by every interior page. */
export function ClosingCta({
  headline,
  accent,
  body,
  cta = "Send us a deck",
}: {
  headline: string;
  /** Kept in the signature so callers need no edit; rendered at full weight
   *  rather than in the gradient, which each page spends once in its h1. */
  accent?: string;
  body: string;
  cta?: string;
}) {
  return (
    <section className="bg-ink py-24 text-on-ink md:py-32">
      <div className={SHELL}>
        <div className="h-px w-full bg-ink-line" />
        <h2 className="display mt-10 max-w-3xl text-[clamp(1.9rem,3.8vw,3.2rem)]">
          {headline}
          {accent ? <> {accent}</> : null}
        </h2>
        <p className="mt-7 max-w-xl text-[1.02rem] leading-relaxed text-on-ink-dim">
          {body}
        </p>
        <Link
          href="/contact"
          className="group mt-10 inline-flex items-center gap-2 rounded-full bg-on-ink px-7 py-4 text-sm font-medium text-ink transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
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

/** A framed figure — corner ticks plus rounded crop, as used on the home page. */
export function Figure({
  src,
  alt,
  caption,
  sizes = "(max-width: 1024px) 100vw, 45vw",
}: {
  src: string;
  alt: string;
  caption?: string;
  sizes?: string;
}) {
  return (
    <figure className="relative">
      <CornerMarks className="text-on-paper" />
      <div className="overflow-hidden rounded-2xl">
        <Image
          src={src}
          alt={alt}
          width={3200}
          height={1800}
          sizes={sizes}
          className="w-full object-cover"
        />
      </div>
      {caption ? (
        <figcaption className="label mt-4 text-on-paper-dim">
          {caption}
        </figcaption>
      ) : null}
    </figure>
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
