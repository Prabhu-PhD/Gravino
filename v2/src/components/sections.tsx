import Link from "next/link";
import Image from "next/image";
import { HeroMark } from "./hero-mark";
import { RibbonFigure } from "./ribbon-figure";
import { SHELL, SectionHead, CornerMarks, Pull } from "./editorial";
import { StatementBand } from "./page-shell";
import {
  HERO,
  PROBLEM,
  BALANCE,
  GROUPS,
  MODEL,
  COMPARISON,
  SECTORS,
  TEARDOWN,
  SITE,
} from "@/lib/site";

/* Section count for the running index. The only edit needed when a numbered
   section is added or removed. */
const TOTAL = "07";

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------ */

export function Hero() {
  return (
    <section className="bg-wash relative min-h-svh overflow-hidden">
      <div aria-hidden className="grain-layer" />

      {/* The grid, made visible. The reference set almost always shows its
          structure rather than hiding it. */}
      <div aria-hidden className={`${SHELL} pointer-events-none absolute inset-0`}>
        <div className="relative h-full">
          <span className="absolute inset-y-0 left-0 w-px bg-on-paper/10" />
          <span className="absolute inset-y-0 right-0 w-px bg-on-paper/10" />
        </div>
      </div>

      <div
        className={`${SHELL} relative grid min-h-svh items-center gap-8 pt-32 pb-20 lg:grid-cols-[1.18fr_0.82fr] lg:pt-24`}
      >
        <div className="max-w-3xl">
          <div className="flex items-center gap-5">
            <span className="label text-accent">01</span>
            <span className="h-px w-10 bg-on-paper/25" />
            <span className="label text-on-paper-dim">{HERO.eyebrow}</span>
          </div>

          {/* Sized to hold the brochure's three-line break. */}
          <h1 className="display mt-9 max-w-[46rem] text-[clamp(2.4rem,4.7vw,4.2rem)]">
            {HERO.headline[0]}
            <br />
            {HERO.headline[1]}{" "}
            <span className="text-gradient">{HERO.accent}</span>
          </h1>

          <p className="mt-8 max-w-xl text-base leading-relaxed text-on-paper-dim sm:text-[1.06rem]">
            {HERO.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={HERO.primary.href}
              className="group inline-flex items-center gap-2 rounded-full bg-on-paper px-6 py-3.5 text-sm font-medium text-paper transition-transform duration-300 hover:-translate-y-0.5"
            >
              {HERO.primary.label}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </Link>
            <Link
              href={HERO.secondary.href}
              className="inline-flex items-center rounded-full border border-on-paper/20 px-6 py-3.5 text-sm text-on-paper transition-colors duration-300 hover:border-on-paper/50"
            >
              {HERO.secondary.label}
            </Link>
          </div>

          <dl className="mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-on-paper/15 pt-6">
            {HERO.facts.map((f) => (
              <div key={f.k}>
                <dt className="font-display text-[1.7rem] tracking-tight">
                  {f.v}
                </dt>
                <dd className="label mt-2 text-on-paper-dim">{f.k}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The live mark. Hidden below lg: at phone widths it would either
            crowd the copy or shrink past the point where iridescence reads. */}
        <div className="relative hidden justify-self-center lg:block">
          <HeroMark style={{ width: "min(38vw, 30rem)", aspectRatio: "1" }} />
        </div>
      </div>

      <div
        className={`${SHELL} absolute inset-x-0 bottom-7 flex items-center justify-between`}
      >
        <p className="label text-on-paper-dim">
          {SITE.location} &nbsp;/&nbsp; {SITE.markets}
        </p>
        <p className="label hidden text-on-paper-dim sm:block">
          {SITE.lockupLine}
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 02 — The problem
 * ------------------------------------------------------------------------ */

export function Problem() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead index="02" total={TOTAL} label={PROBLEM.label}>
          You don&rsquo;t have five problems. You have one, in a dozen{" "}
          <span className="text-gradient">formats.</span>
        </SectionHead>

        <div className="mt-14 grid gap-10 border-t border-paper-line pt-10 md:grid-cols-2 md:gap-16">
          {PROBLEM.body.map((p) => (
            <p
              key={p.slice(0, 24)}
              className="text-[1.02rem] leading-relaxed text-on-paper-dim"
            >
              {p}
            </p>
          ))}
        </div>

        <div className="mt-20">
          <Pull>{PROBLEM.pull}</Pull>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 03 — Why it matters, carried by the balance render.
 *
 * The brochure's ribbon-and-sphere render literally depicts a sphere held in
 * balance, so it belongs against this copy and nowhere else on the page.
 * ------------------------------------------------------------------------ */

export function Balance() {
  return (
    <section className="bg-paper-soft py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead index="03" total={TOTAL} label={BALANCE.label}>
          Every high-stakes communication is a{" "}
          <span className="text-gradient">balancing act.</span>
        </SectionHead>

        <div className="mt-16 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="text-[1.02rem] leading-relaxed text-on-paper-dim">
              {BALANCE.body}
            </p>
            <p className="mt-10 font-display text-[clamp(1.5rem,2.7vw,2.2rem)] leading-snug tracking-[-0.025em]">
              A brilliant business that communicates unclearly is an{" "}
              <span className="text-gradient">undervalued</span> one.
            </p>
            <p className="mt-10 text-[1.02rem] leading-relaxed text-on-paper-dim">
              {BALANCE.close}
            </p>
          </div>

          {/* Live, not the still. Second WebGL context on this page after
              the hero mark — acceptable for two, but the reason /about keeps
              the static render rather than a third. */}
          <RibbonFigure caption={SITE.tagline} />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 04 — What we cover, as cards
 * ------------------------------------------------------------------------ */

export function Coverage() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead
          index="04"
          total={TOTAL}
          label="What we cover"
          lede="Organised around the outcome each produces — so you can see how much of your communications surface one team covers."
        >
          The full surface, ten disciplines{" "}
          <span className="text-gradient">deep.</span>
        </SectionHead>

        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {GROUPS.map((g) => (
            <article key={g.n} className="card relative p-8 md:p-10">
              <div className="flex items-baseline justify-between gap-4">
                <span className="label text-accent">{g.n}</span>
                <span className="label text-on-paper-dim">
                  {g.disciplines.length} disciplines
                </span>
              </div>
              <h3 className="mt-6 font-display text-[1.45rem] font-medium leading-snug tracking-[-0.02em]">
                {g.name}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-on-paper-dim">
                {g.premise}
              </p>
              <ul className="mt-8">
                {g.disciplines.map((d) => (
                  <li
                    key={d.n}
                    className="flex gap-5 border-t border-paper-line py-4"
                  >
                    <span className="label pt-1 text-on-paper-dim">{d.n}</span>
                    <span>
                      <span className="block text-[0.97rem] leading-snug">
                        {d.title}
                      </span>
                      <span className="label mt-1.5 block text-on-paper-dim">
                        {d.kind}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <Link
          href="/services"
          className="group mt-12 inline-flex items-center gap-2 text-sm font-medium"
        >
          All ten disciplines in depth
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 05 — The model, carried by the stack render.
 *
 * Ring, cube, sphere stacked in three — the brochure pairs this exact image
 * with these exact three points, so the pairing is the brand's own.
 * ------------------------------------------------------------------------ */

export function Model() {
  return (
    <section className="bg-paper-soft py-24 md:py-32">
      <div className={SHELL}>
        <SectionHead index="05" total={TOTAL} label="The Gravino model">
          How the work holds <span className="text-gradient">up.</span>
        </SectionHead>

        <div className="mt-16 grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <figure className="relative order-2 lg:order-1">
            <CornerMarks className="text-on-paper" />
            <div className="overflow-hidden rounded-2xl">
              <Image
                src="/brand/glass-stack.jpeg"
                alt="A glass ring, cube and sphere stacked in balance"
                width={3200}
                height={1800}
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="w-full object-cover"
              />
            </div>
          </figure>

          <div className="order-1 lg:order-2">
            {MODEL.map((m) => (
              <div
                key={m.n}
                className="grid gap-4 border-t border-paper-line py-8 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <p className="font-display text-4xl leading-none text-grad-2">
                  {m.n}
                </p>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                    {m.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[0.97rem] leading-relaxed text-on-paper-dim">
                    {m.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * 06 — The comparison. Dark band; the one place contrast does real work.
 * ------------------------------------------------------------------------ */

export function Comparison() {
  const last = COMPARISON.columns.length - 1;
  return (
    <section className="bg-ink py-24 text-on-ink md:py-32">
      <div className={SHELL}>
        <SectionHead
          index="06"
          total={TOTAL}
          label={COMPARISON.label}
          dark
          lede={COMPARISON.intro}
        >
          Why this beats the{" "}
          <span className="text-gradient">alternatives.</span>
        </SectionHead>

        {/* overflow-x-auto: the one element that cannot reflow below ~640px
            without becoming unreadable. */}
        <div className="mt-14 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr>
                <th className="label pb-5 font-normal text-on-ink-dim">&nbsp;</th>
                {COMPARISON.columns.map((c, i) => (
                  <th
                    key={c}
                    className={`pb-5 font-display text-lg font-medium tracking-[-0.02em] ${
                      i === last ? "text-accent-on-ink" : "text-on-ink-dim"
                    }`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((r) => (
                <tr key={r.k} className="border-t border-ink-line">
                  <th
                    scope="row"
                    className="label py-5 pr-8 font-normal text-on-ink-dim"
                  >
                    {r.k}
                  </th>
                  {r.v.map((v, i) => (
                    <td
                      key={i}
                      className={`py-5 pr-8 text-[0.97rem] ${
                        i === last
                          ? "bg-white/[0.04] text-on-ink"
                          : "text-on-ink-dim"
                      }`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-14">
          <Pull dark>{COMPARISON.close}</Pull>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            href="/for/ceo"
            className="label rounded-full border border-white/25 px-5 py-3 transition-colors hover:border-white/60"
          >
            If you&rsquo;re the CEO
          </Link>
          <Link
            href="/for/cfo"
            className="label rounded-full border border-white/25 px-5 py-3 transition-colors hover:border-white/60"
          >
            If you&rsquo;re the CFO
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * The statement band — full-bleed, the page's one loud moment.
 * Shares StatementBand with every interior page so there is exactly one
 * implementation of the fluted-pane-over-render motif.
 * ------------------------------------------------------------------------ */

export function Statement() {
  return (
    <StatementBand
      src="/brand/glass-sphere-swirl.jpeg"
      eyebrow={SITE.lockupLine}
    >
      Design is not a cost line. It is the{" "}
      <span className="text-gradient">difference</span> between being
      understood and being overlooked.
    </StatementBand>
  );
}

/* ---------------------------------------------------------------------------
 * 07 — Proof
 *
 * Sectors only. The three case studies in the brochure are entirely bracketed
 * placeholders — no client, no outcome — so they are not rendered.
 * ------------------------------------------------------------------------ */

export function Proof() {
  return (
    <section className="bg-paper py-24 md:py-28">
      <div className={SHELL}>
        <SectionHead index="07" total={TOTAL} label="Proof of work">
          Trusted across <span className="text-gradient">sectors.</span>
        </SectionHead>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line sm:grid-cols-2 lg:grid-cols-4">
          {SECTORS.map((s) => (
            <li key={s} className="bg-paper px-6 py-8">
              <span className="label text-on-paper-dim">{s}</span>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl text-[1.02rem] leading-relaxed text-on-paper-dim">
          A senior {SITE.teamSize}-person core team, a systemic process, and{" "}
          {SITE.experienceYears}+ years of combined experience — on engagements
          across {SITE.markets}.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * The offer — dark band, and the page's real conversion point.
 * ------------------------------------------------------------------------ */

export function Teardown() {
  return (
    <section className="bg-ink py-24 text-on-ink md:py-32">
      <div className={`${SHELL} grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20`}>
        <div>
          <div className="flex items-center gap-5">
            <span className="h-px w-10 bg-white/30" />
            <span className="label text-on-ink-dim">{TEARDOWN.label}</span>
          </div>
          <h2 className="display mt-8 text-[clamp(2.1rem,4.2vw,3.6rem)]">
            Start with a look, not a{" "}
            <span className="text-gradient">commitment.</span>
          </h2>
          <p className="mt-8 max-w-xl text-[1.02rem] leading-relaxed text-on-ink-dim">
            {TEARDOWN.body}
          </p>
          <Link
            href={TEARDOWN.cta.href}
            className="group mt-10 inline-flex items-center gap-2 rounded-full bg-on-ink px-7 py-4 text-sm font-medium text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            {TEARDOWN.cta.label}
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>

        <ul className="space-y-5 self-end">
          {TEARDOWN.terms.map((t) => (
            <li
              key={t.slice(0, 20)}
              className="border-t border-ink-line pt-5 text-sm leading-relaxed text-on-ink-dim"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
