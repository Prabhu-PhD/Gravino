import { Page, PageHead, Statement, CtaBand, SHELL } from "@/components/page-shell";
import { WORKS } from "@/lib/work";

export const metadata = {
  title: "Portfolio",
  description:
    "Four pieces of work, each told as what was at stake, what we did about it, and what changed.",
};

/* Each work is one full section rather than a card in a grid, because a case
   study is an argument and an argument needs room to be made. The image and
   the story alternate sides so the page has a rhythm you can feel scrolling
   without a device announcing each change.

   The four beats (situation, approach, made, outcome) are the order a buyer
   reads in. See work.ts, which also carries the warning that every client
   here is still a placeholder. */

export default function Portfolio() {
  return (
    <Page>
      <PageHead
        eyebrow="Selected work"
        headline="Four problems, and what we did"
        accent="about them."
        lede="Not a gallery. Each one is the situation we walked into, the decision we made, and what changed as a result."
      />

      {WORKS.map((w, i) => {
        const flip = i % 2 === 1;
        return (
          <section
            key={w.n}
            className={`relative overflow-hidden border-t border-white/[0.07] py-16 md:py-24 ${
              i % 2 ? "bg-[#0d0b18]" : "bg-[#09090f]"
            }`}
          >
            <div className={`${SHELL} relative`}>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Image. `order` flips it on large screens only; on a phone
                    the picture always comes first, because it is the thing
                    that makes you decide whether to read on. */}
                <div className={flip ? "lg:order-2" : ""}>
                  <div className="relative overflow-hidden rounded-xl border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.image}
                      alt={`${w.name}, ${w.sector}`}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090f]/70 via-transparent to-transparent"
                    />
                  </div>
                </div>

                <div className={flip ? "lg:order-1" : ""}>
                  <div className="flex items-baseline gap-4">
                    <span className="text-sm font-mono text-[#a78bfa]">{w.n}</span>
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                      {w.sector} &middot; {w.year}
                    </span>
                  </div>

                  <h2 className="mt-4 text-[clamp(1.9rem,4vw,3rem)] font-light leading-[1.1] tracking-[-0.03em] text-white">
                    {w.name}
                  </h2>

                  <p className="mt-4 max-w-xl text-lg font-light leading-[1.5] text-slate-200">
                    {w.summary}
                  </p>

                  <dl className="mt-8 space-y-5 border-t border-white/10 pt-7">
                    <div>
                      <dt className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                        The situation
                      </dt>
                      <dd className="mt-2 max-w-xl text-[0.95rem] font-light leading-relaxed text-slate-400">
                        {w.situation}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-500">
                        What we did
                      </dt>
                      <dd className="mt-2 max-w-xl text-[0.95rem] font-light leading-relaxed text-slate-400">
                        {w.approach}
                      </dd>
                    </div>
                  </dl>

                  <ul className="mt-7 flex flex-wrap gap-2">
                    {w.made.map((m) => (
                      <li
                        key={m}
                        className="rounded-md border border-white/12 px-3 py-1.5 text-xs text-slate-400"
                      >
                        {m}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-7 border-l-2 border-[#a78bfa]/60 pl-5 text-base font-light leading-relaxed text-white">
                    {w.outcome}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <Statement attribution="How we work">
        Every one of these started the same way: something important had to be
        explained to people who would decide with it.
      </Statement>

      <CtaBand
        headline="Send us the one that is bothering"
        accent="you."
        body="A deck, a report, a brand piece. We come back with a single page on what is working, what it is costing you, and what we would change. No cost, no pitch."
      />
    </Page>
  );
}
