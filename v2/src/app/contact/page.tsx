import { Page, PageHead, Section, SHELL } from "@/components/page-shell";
import { TeardownForm } from "@/components/teardown-form";
import { SITE, TEARDOWN } from "@/lib/site";

export const metadata = {
  title: "Contact",
  description:
    "Send a deck, a report or a brand piece. We reply with a one-page teardown inside 24 hours. No cost, no pitch.",
};

/* Rebuilt around the form. The previous version was a numbered list of
   contact details with a mailto link, and no way to actually start anything
   from the page. "Start a project" in the nav now lands here, so the form is
   the page: it sits above the fold, and everything else supports it.

   The form posts to /send.php and the mail arrives at create@gravino.in. It
   no longer opens the visitor's mail client and asks them to send their own
   enquiry. */

export default function Contact() {
  return (
    <Page>
      <PageHead
        eyebrow="Start a project"
        headline="Send one thing. Get a page back inside"
        accent="24 hours."
        lede={TEARDOWN.body}
      />

      <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#09090f] py-16 md:py-20">
        <div className={`${SHELL} relative`}>
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            {/* The form first on every width: it is the point of the page. */}
            <div className="rounded-3xl border border-white/10 bg-[#0d0b18] p-6 sm:p-8">
              <TeardownForm />
            </div>

            <div className="lg:pt-2">
              <h2 className="text-[clamp(1.4rem,2.6vw,1.9rem)] font-light leading-[1.2] tracking-tight text-white">
                What happens next
              </h2>

              <ol className="mt-7 space-y-6">
                {[
                  ["We read it ourselves", "Not a form queue. One of the four reads what you send."],
                  ["You get one page back", "What is working, what it is costing you, what we would change."],
                  ["Only then, a quote", "Scope and price fixed after a short conversation, never before."],
                ].map(([title, body], i) => (
                  <li key={title} className="flex gap-5">
                    <span className="mt-0.5 text-sm font-mono text-[#a78bfa]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-base font-medium text-white">{title}</h3>
                      <p className="mt-1.5 text-[0.95rem] font-light leading-relaxed text-slate-400">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-10 border-t border-white/10 pt-7">
                <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
                  Or reach us directly
                </h3>
                <a
                  href={`mailto:${SITE.email}`}
                  className="mt-4 block text-lg font-light text-white underline-offset-4 transition-colors hover:text-[#a78bfa] hover:underline"
                >
                  {SITE.email}
                </a>
                <p className="mt-3 text-sm text-slate-400">{SITE.location}</p>
                <p className="mt-1 text-sm text-slate-500">{SITE.markets}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section tone="raised">
        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-slate-500">
          The terms, up front
        </h2>
        <ul className="mt-6 grid gap-x-12 gap-y-5 md:grid-cols-3">
          {TEARDOWN.terms.map((t) => (
            <li
              key={t}
              className="border-t border-white/12 pt-4 text-[0.95rem] font-light leading-relaxed text-slate-400"
            >
              {t}
            </li>
          ))}
        </ul>
      </Section>
    </Page>
  );
}
