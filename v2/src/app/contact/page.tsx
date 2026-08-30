import { Page, PageHead, SHELL } from "@/components/page-shell";
import { SITE, TEARDOWN } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Send us a deck and we'll return a one-page teardown — no cost, no pitch.",
};

export default function Contact() {
  return (
    <Page>
      <PageHead
        eyebrow={TEARDOWN.label}
        headline="Start with a look, not a"
        accent="commitment."
        lede={TEARDOWN.body}
      />

      <section className="bg-paper py-24 md:py-32">
        <div className={`${SHELL} grid gap-16 md:grid-cols-[1fr_1fr] md:gap-24`}>
          <div>
            <p className="label text-on-paper-dim">How to reach us</p>

            {/* A mailto rather than a form: the site has no backend yet, and a
                form that silently goes nowhere is worse than an address that
                works. Swap for a route handler when there is somewhere to
                send it. TODO(confirm): WhatsApp number and Calendly link were
                both named as contact routes but neither has been supplied. */}
            <a
              href={`mailto:${SITE.email}?subject=${encodeURIComponent(
                "Deck teardown request",
              )}`}
              className="group mt-8 flex items-baseline justify-between gap-6 border-t border-paper-line py-6"
            >
              <span>
                <span className="label text-on-paper-dim">Email</span>
                <span className="mt-2 block font-display text-[clamp(1.3rem,2.4vw,1.9rem)] tracking-[-0.02em]">
                  {SITE.email}
                </span>
              </span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                &rarr;
              </span>
            </a>

            <div className="border-t border-paper-line py-6">
              <span className="label text-on-paper-dim">Where we are</span>
              <span className="mt-2 block text-[1.02rem]">{SITE.location}</span>
              <span className="mt-1 block text-[1.02rem] text-on-paper-dim">
                {SITE.markets}
              </span>
            </div>
          </div>

          <div>
            <p className="label text-on-paper-dim">What happens next</p>
            <ol className="mt-8 space-y-8">
              {[
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
              ].map(([t, b], i) => (
                <li key={t} className="flex gap-6 border-t border-paper-line pt-6">
                  <span className="label pt-1 text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-display text-lg font-medium tracking-[-0.02em]">
                      {t}
                    </span>
                    <span className="mt-2 block text-[0.97rem] leading-relaxed text-on-paper-dim">
                      {b}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <ul className="mt-12 space-y-3">
              {TEARDOWN.terms.map((t) => (
                <li key={t.slice(0, 20)} className="text-sm text-on-paper-dim">
                  — {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </Page>
  );
}
