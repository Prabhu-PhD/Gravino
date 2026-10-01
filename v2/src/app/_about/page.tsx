/* ===========================================================================
 * PARKED -- NOT PART OF THE SITE.
 * ---------------------------------------------------------------------------
 * The client asked (2026-09-27) for About to be hidden completely: not in the
 * nav, not in the footer, not in the sitemap, and not reachable by URL,
 * because they do not want to show the team yet.
 *
 * The leading underscore is what does that. Next's App Router treats a folder
 * named _something as private and never routes or builds it, so /about/ does
 * not exist in the export at all. Merely unlinking it was not enough: /about/
 * is the most guessable URL on any site, and this page is built to show the
 * team. The names and bios themselves are NOT in this repo (it is public):
 * see the note on ABOUT.team.people in site.ts for where they are.
 *
 * TO BRING IT BACK: rename src/app/_about to src/app/about, and restore the
 * About entries in cosmic-chrome.tsx (NAV and the footer "Pages" list) and in
 * sitemap.ts ROUTES. Resolve the TODO(confirm) on ABOUT in site.ts first: the
 * team's years add up to 65 while the site says 75+.
 * ======================================================================== */

import { Page, PageHead, Section, Head, SectionMark, CtaBand } from "@/components/page-shell";
import { Reveal, CountUp } from "@/components/story";
import { BalanceBeam, Reach } from "@/components/infographics";
import { d } from "@/lib/stagger";
import { SITE, BALANCE, ABOUT, MARKETS } from "@/lib/site";

export const metadata = {
  title: "About",
  description: `${ABOUT.lede}`,
};

/* ===========================================================================
 * /about -- who Gravino is.
 * ---------------------------------------------------------------------------
 * The embedded-partner argument moved to /why-gravino. This page answers the
 * questions an About page is for: who are these people, what do they believe,
 * how are they set up, and where are they.
 *
 * NOTHING HERE IS INVENTED. Every line traces to the brochure, the brief or
 * the earlier live site (sources listed on ABOUT in site.ts). There is no
 * origin story because none has been written: when/why/by whom Gravino was
 * founded is the one thing this page is still missing, and it is not a gap to
 * fill with plausible prose.
 *
 * TODO(confirm) before publishing: the team's years add to 65 while the facts
 * row says SITE.experienceYears (75+). See the note on ABOUT.
 * ======================================================================== */

const FACTS = [
  { value: SITE.teamSize, suffix: "", label: "senior people, and every client works with all of them" },
  { value: SITE.experienceYears, suffix: "+", label: "years of experience between them" },
  { value: 10, suffix: "", label: "disciplines, from the investor deck to the launch film" },
  { value: MARKETS.length, suffix: "", label: `markets: ${MARKETS.join(", ")}` },
];

/** Years bars are scaled against the longest career on the team. */
const MAX_YEARS = Math.max(...ABOUT.team.people.map((p) => p.years));

export default function About() {
  return (
    <Page>
      <PageHead figure eyebrow={ABOUT.eyebrow} headline={ABOUT.headline} accent={ABOUT.accent} lede={ABOUT.lede} />

      {/* 01 -- who we are, as four facts that count up. */}
      <Section orbs>
        <SectionMark n="01" label={ABOUT.who.label} />
        <Head accent={ABOUT.who.accent} lede={ABOUT.who.lede}>
          {ABOUT.who.headline}
        </Head>

        <Reveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f, i) => (
            <div
              key={f.label}
              className="st-fade relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 backdrop-blur-sm"
              style={d(i)}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <CountUp
                to={f.value}
                suffix={f.suffix}
                className="block text-[clamp(3rem,6vw,4.25rem)] font-extralight leading-none tracking-tight text-white"
              />
              <span aria-hidden className="mt-4 block h-px w-10 bg-gradient-to-r from-[#a78bfa] to-[#38bdf8]" />
              <p className="mt-4 text-[0.9rem] font-light leading-relaxed text-slate-300">{f.label}</p>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* 02 -- what we believe: the balancing act, drawn as a beam that tips
          and then settles level. */}
      <Section tone="raised">
        <SectionMark n="02" label={ABOUT.believe.label} />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Head accent={ABOUT.believe.accent}>{ABOUT.believe.headline}</Head>
            <p className="mt-6 text-[clamp(1.25rem,2vw,1.6rem)] font-light leading-snug text-white">
              {BALANCE.headline}
            </p>
            <p className="mt-4 text-[1rem] font-light leading-relaxed text-slate-400">{BALANCE.body}</p>
            <p className="mt-6 border-l-2 border-[#a78bfa]/60 pl-4 text-[1rem] font-light italic leading-relaxed text-slate-200">
              {BALANCE.pull}
            </p>
          </div>
          <Reveal className="rounded-3xl border border-white/[0.07] bg-black/25 p-5 md:p-8">
            <BalanceBeam />
          </Reveal>
        </div>
      </Section>

      {/* 03 -- the team. Each card carries a years bar scaled to the longest
          career, so the row reads as a small chart as well as four bios. */}
      <Section orbs>
        <SectionMark n="03" label={ABOUT.team.label} />
        <Head accent={ABOUT.team.accent} lede={ABOUT.team.lede}>
          {ABOUT.team.headline}
        </Head>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {ABOUT.team.people.map((m) => (
            <Reveal
              key={m.name}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 backdrop-blur-sm md:p-7"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
              <div className="flex items-center gap-4">
                {/* Monogram until real photographs exist. */}
                <div className="st-pop relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#a78bfa] via-[#60a5fa] to-[#38bdf8] p-[1.5px]">
                  <span className="grid h-full w-full place-items-center rounded-full bg-[#120d26] text-sm font-medium tracking-wider text-white">
                    {m.initials}
                  </span>
                </div>
                <div className="st-fade min-w-0" style={d(1)}>
                  <h3 className="text-[1.2rem] font-normal leading-tight text-white">{m.name}</h3>
                  <p className="mt-1 text-sm text-[#a78bfa]">{m.role}</p>
                </div>
              </div>

              <div className="st-fade mt-6" style={d(2)}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">Experience</span>
                  <span className="text-sm text-white">
                    <CountUp to={m.years} suffix="+" /> years
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <svg viewBox="0 0 100 1" preserveAspectRatio="none" className="block h-full w-full" aria-hidden>
                    <rect
                      className="st-grow-x"
                      style={d(3)}
                      x="0"
                      y="0"
                      width={(m.years / MAX_YEARS) * 100}
                      height="1"
                      fill={`url(#yr-${m.initials})`}
                    />
                    <defs>
                      <linearGradient id={`yr-${m.initials}`} x1="0" x2="1">
                        <stop offset="0" stopColor="#a78bfa" />
                        <stop offset="1" stopColor="#38bdf8" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>

              <p className="st-fade mt-5 text-[0.925rem] font-light leading-relaxed text-slate-400" style={d(4)}>
                {m.bio}
              </p>
              <ul className="st-fade mt-5 flex flex-wrap gap-2" style={d(5)}>
                {m.tags.map((t) => (
                  <li key={t} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* 04 -- how we are built. */}
      <Section tone="raised">
        <SectionMark n="04" label={ABOUT.principles.label} />
        <Head accent={ABOUT.principles.accent}>{ABOUT.principles.headline}</Head>

        <Reveal className="mt-10 grid gap-4 md:grid-cols-2">
          {ABOUT.principles.items.map((p, i) => (
            <div
              key={p.title}
              className="st-fade flex gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-7"
              style={d(i, 0.14)}
            >
              <span className="mt-1 text-[clamp(1.6rem,3vw,2.2rem)] font-extralight leading-none text-[#a78bfa]/80">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-[1.15rem] font-normal leading-snug text-white">{p.title}</h3>
                <p className="mt-2 text-[0.925rem] font-light leading-relaxed text-slate-400">{p.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </Section>

      {/* 05 -- where we work. */}
      <Section orbs>
        <SectionMark n="05" label={ABOUT.reach.label} />
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Head accent={ABOUT.reach.accent} lede={ABOUT.reach.lede}>
            {ABOUT.reach.headline}
          </Head>
          <Reveal className="rounded-3xl border border-white/[0.07] bg-black/25 p-5 md:p-8">
            <Reach home="Chennai" markets={MARKETS} />
          </Reveal>
        </div>
      </Section>

      <CtaBand
        headline="See whether the standard"
        accent="holds up."
        body="Tell us about the deck, report, brand, film or campaign in front of you. One of the four of us comes back within a working day with questions, an approach and a clear next step."
      />
    </Page>
  );
}
