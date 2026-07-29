import { Cta } from "./cta";
import { Reveal } from "./reveal";
import { SITE } from "@/lib/site";

const WAYS = ["Inquiry form", "WhatsApp", "Email", "Book a call"];

export function ContactCta() {
  return (
    <section id="contact" className="relative">
      <div className="section mx-auto max-w-6xl px-5">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:px-14 sm:py-20">
            <div
              className="pointer-events-none absolute inset-x-0 -top-24 mx-auto h-64 w-[60%] rounded-full blur-3xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(169,180,245,0.45), transparent 70%)",
              }}
            />
            <p className="eyebrow relative">Let’s talk</p>
            <h2 className="relative mx-auto mt-5 max-w-2xl font-display text-[clamp(2rem,5vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-ink">
              Ready to add a{" "}
              <span className="italic text-gradient">design department?</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted">
              Tell us what’s on your plate. We’ll come back with a plan and a
              transparent “from” quote — usually within one business day.
            </p>
            <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
              <Cta href={`mailto:${SITE.email}`}>Start a project</Cta>
              <Cta href="#" variant="ghost">
                Book a call
              </Cta>
            </div>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-faint">
              {WAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
