import Link from "next/link";
import { HeroMark } from "./hero-mark";
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

/* ---------------------------------------------------------------------------
 * Shared furniture
 * ------------------------------------------------------------------------ */

function Label({ children, dark }: { children: string; dark?: boolean }) {
  return (
    <p className={`label ${dark ? "text-on-ink-dim" : "text-on-paper-dim"}`}>
      {children}
    </p>
  );
}

const SHELL = "mx-auto max-w-[88rem] px-6 md:px-10";

/* ---------------------------------------------------------------------------
 * Hero
 * ------------------------------------------------------------------------ */

export function Hero() {
  return (
    <section className="bg-wash relative min-h-svh overflow-hidden">
      <div aria-hidden className="grain-layer" />

      <div
        className={`${SHELL} relative grid min-h-svh items-center gap-8 pt-32 pb-16 lg:grid-cols-[1.18fr_0.82fr] lg:pt-24`}
      >
        {/* Copy */}
        <div className="max-w-3xl">
          <Label>{HERO.eyebrow}</Label>

          {/* Sized to hold the brochure's three-line break. At 5.6vw the
              first line overflowed the column and it fell to four. */}
          <h1 className="display mt-6 max-w-[46rem] text-[clamp(2.4rem,4.7vw,4.2rem)]">
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

          <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6">
            {HERO.facts.map((f) => (
              <div key={f.k}>
                <dt className="font-display text-2xl tracking-tight">{f.v}</dt>
                <dd className="label mt-2 text-on-paper-dim">{f.k}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* The mark. Hidden below lg: at phone widths it would either crowd the
            copy or shrink to the size where the iridescence stops reading. */}
        <div className="hidden justify-self-center lg:block">
          <HeroMark style={{ width: "min(38vw, 30rem)", aspectRatio: "1" }} />
        </div>
      </div>

      <p className="label absolute inset-x-0 bottom-7 mx-auto max-w-[88rem] px-6 text-on-paper-dim md:px-10">
        {SITE.location} &nbsp;/&nbsp; {SITE.markets}
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * The problem
 * ------------------------------------------------------------------------ */

export function Problem() {
  return (
    <section className="bg-paper py-28 md:py-36">
      <div className={SHELL}>
        <Label>{PROBLEM.label}</Label>
        <h2 className="display mt-6 max-w-4xl text-[clamp(2rem,3.9vw,3.4rem)]">
          {PROBLEM.headline}
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:gap-16">
          {PROBLEM.body.map((p) => (
            <p key={p.slice(0, 24)} className="text-[1.02rem] leading-relaxed text-on-paper-dim">
              {p}
            </p>
          ))}
        </div>

        <blockquote className="mt-20 max-w-3xl border-l-2 border-accent pl-7">
          <p className="font-display text-[clamp(1.35rem,2.3vw,1.9rem)] leading-snug tracking-[-0.02em]">
            {PROBLEM.pull}
          </p>
        </blockquote>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * Why it matters — where the tagline earns its place
 * ------------------------------------------------------------------------ */

export function Balance() {
  return (
    <section className="bg-paper-soft py-28 md:py-36">
      <div className={`${SHELL} grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20`}>
        <div>
          <Label>{BALANCE.label}</Label>
          <h2 className="display mt-6 text-[clamp(1.9rem,3.4vw,3rem)]">
            {BALANCE.headline}
          </h2>
        </div>
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
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * What we cover
 * ------------------------------------------------------------------------ */

export function Coverage() {
  return (
    <section id="cover" className="bg-paper py-28 md:py-36">
      <div className={SHELL}>
        <Label>What we cover</Label>
        <h2 className="display mt-6 max-w-3xl text-[clamp(2rem,3.9vw,3.4rem)]">
          The full surface, ten disciplines{" "}
          <span className="text-gradient">deep.</span>
        </h2>
        <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-on-paper-dim">
          Organised around the outcome each produces — so you can see how much
          of your communications surface one team covers.
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-paper-line sm:grid-cols-2">
          {GROUPS.map((g) => (
            <div key={g.n} className="bg-paper p-8 md:p-10">
              <div className="flex items-baseline gap-4">
                <span className="label text-accent">{g.n}</span>
                <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                  {g.name}
                </h3>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-on-paper-dim">
                {g.premise}
              </p>
              <ul className="mt-7 space-y-3">
                {g.disciplines.map((d) => (
                  // kind on its own line: inline after the title it wraps
                  // mid-phrase and the two halves stop being distinguishable.
                  <li key={d.n} className="flex gap-4 border-t border-paper-line pt-3">
                    <span className="label pt-1.5 text-on-paper-dim">{d.n}</span>
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
            </div>
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
 * The model
 * ------------------------------------------------------------------------ */

export function Model() {
  return (
    <section className="bg-paper-soft py-28 md:py-36">
      <div className={SHELL}>
        <Label>The Gravino model</Label>
        <h2 className="display mt-6 text-[clamp(2rem,3.9vw,3.4rem)]">
          How the work holds up.
        </h2>
        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {MODEL.map((m) => (
            <div key={m.n}>
              <p className="font-display text-4xl text-grad-2">{m.n}</p>
              <h3 className="mt-5 font-display text-xl font-medium tracking-[-0.02em]">
                {m.title}
              </h3>
              <p className="mt-4 text-[0.97rem] leading-relaxed text-on-paper-dim">
                {m.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------------
 * The comparison — dark band. The one section where contrast does real work.
 * ------------------------------------------------------------------------ */

export function Comparison() {
  const lastCol = COMPARISON.columns.length - 1;
  return (
    <section className="bg-ink py-28 text-on-ink md:py-36">
      <div className={SHELL}>
        <Label dark>{COMPARISON.label}</Label>
        <h2 className="display mt-6 text-[clamp(2rem,3.9vw,3.4rem)]">
          {COMPARISON.headline}
        </h2>
        <p className="mt-6 max-w-2xl text-[1.02rem] leading-relaxed text-on-ink-dim">
          {COMPARISON.intro}
        </p>

        {/* overflow-x-auto: the table is the one element that cannot reflow
            below ~640px without becoming unreadable. */}
        <div className="mt-14 -mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr>
                <th className="label pb-5 font-normal text-on-ink-dim">&nbsp;</th>
                {COMPARISON.columns.map((c, i) => (
                  <th
                    key={c}
                    className={`pb-5 font-display text-lg font-medium tracking-[-0.02em] ${
                      i === lastCol ? "text-accent-on-ink" : "text-on-ink-dim"
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
                  <th scope="row" className="label py-5 pr-8 font-normal text-on-ink-dim">
                    {r.k}
                  </th>
                  {r.v.map((v, i) => (
                    <td
                      key={i}
                      className={`py-5 pr-8 text-[0.97rem] ${
                        i === lastCol ? "text-on-ink" : "text-on-ink-dim"
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

        <p className="mt-14 max-w-3xl font-display text-[clamp(1.35rem,2.3vw,1.9rem)] leading-snug tracking-[-0.02em]">
          {COMPARISON.close}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
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
 * Proof
 *
 * Sectors only. The three case studies in the brochure are entirely bracketed
 * placeholders — no client, no outcome — so they are not rendered. Inventing
 * specifics on a page whose whole argument is credibility would be the worst
 * possible trade.
 * ------------------------------------------------------------------------ */

export function Proof() {
  return (
    <section className="bg-paper py-24">
      <div className={SHELL}>
        <Label>Proof of work</Label>
        <h2 className="display mt-6 text-[clamp(1.8rem,3.2vw,2.8rem)]">
          Trusted across sectors.
        </h2>
        <ul className="mt-10 flex flex-wrap gap-x-3 gap-y-3">
          {SECTORS.map((s) => (
            <li
              key={s}
              className="label rounded-full border border-paper-line px-4 py-2.5 text-on-paper-dim"
            >
              {s}
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
    <section className="bg-ink py-28 text-on-ink md:py-36">
      <div className={`${SHELL} grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:gap-20`}>
        <div>
          <Label dark>{TEARDOWN.label}</Label>
          <h2 className="display mt-6 text-[clamp(2.1rem,4.2vw,3.6rem)]">
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
