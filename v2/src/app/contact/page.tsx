import { Page, PageHead, StatementBand, SHELL } from "@/components/page-shell";
import { SectionHead } from "@/components/editorial";
import { SITE, TEARDOWN } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Send us a deck and we'll return a one-page teardown — no cost, no pitch.",
};

const TOTAL = "02";

const STEPS = [
  [
    "You send something real",
    "An investor deck, a report, a brand piece — whatever is closest to the work that matters right now.",
  ],
  [
    "We send back a one-page teardown",
    "What's working, what's costing you, and what we'd change. No cost, and no pitch attached.",
  ],
  [
    "If it's useful, we talk scope",
    "A short conversation, then scope, approach and a clear quote. Nothing starts before that's agreed.",
  ],
] as const;

export default function Contact() {
  return (
    <Page>
      <PageHead
        headline="Start with a look, not a"
        accent="commitment."
        lede={TEARDOWN.body}
      />

      <section className="bg-paper py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead>
            One address, one{" "}
            reply.
          </SectionHead>

          {/* A mailto rather than a form: the site has no backend yet, and a
              form that silently goes nowhere is worse than an address that
              works. Swap for a route handler when there is somewhere to send
              it. TODO(confirm): WhatsApp number and Calendly link were both
              named as contact routes but neither has been supplied. */}
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                "Deck teardown request",
              )}`}
              className="card group flex flex-col justify-between p-8 transition-colors hover:border-accent md:p-10"
            >
              <div className="flex items-baseline justify-between">
                <span className="label text-accent">01</span>
                <span className="label text-on-paper-dim">Email</span>
              </div>
              <div className="mt-14">
                <span className="block font-display text-[clamp(1.3rem,2.4vw,1.9rem)] tracking-[-0.02em]">
                  {SITE.email}
                </span>
                <span className="label mt-3 inline-flex items-center gap-2 text-on-paper-dim">
                  Start a teardown
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </span>
              </div>
            </a>

            <div className="card flex flex-col justify-between p-8 md:p-10">
              <div className="flex items-baseline justify-between">
                <span className="label text-accent">02</span>
                <span className="label text-on-paper-dim">Where we are</span>
              </div>
              <div className="mt-14">
                <span className="block font-display text-[clamp(1.3rem,2.4vw,1.9rem)] tracking-[-0.02em]">
                  {SITE.location}
                </span>
                <span className="label mt-3 block text-on-paper-dim">
                  {SITE.markets}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-paper-soft py-24 md:py-32">
        <div className={SHELL}>
          <SectionHead>
            Three steps, and nothing starts before you{" "}
            agree it.
          </SectionHead>

          <div className="mt-14">
            {STEPS.map(([t, b], i) => (
              <div
                key={t}
                className="grid gap-4 border-t border-paper-line py-9 sm:grid-cols-[5rem_1fr] sm:gap-8"
              >
                <p className="font-display text-4xl leading-none text-grad-2">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3 className="font-display text-xl font-medium tracking-[-0.02em]">
                    {t}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.97rem] leading-relaxed text-on-paper-dim">
                    {b}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-paper-line bg-paper-line md:grid-cols-3">
            {TEARDOWN.terms.map((t) => (
              <li
                key={t.slice(0, 20)}
                className="bg-paper-soft px-6 py-7 text-sm leading-relaxed text-on-paper-dim"
              >
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <StatementBand
        src="/brand/glass-ribbon-balance.jpeg"
        objectPosition="70% center"
        fluteOn="left"
      >
        Send the deck. We&rsquo;ll tell you what we&rsquo;d{" "}
        change.
      </StatementBand>
    </Page>
  );
}
