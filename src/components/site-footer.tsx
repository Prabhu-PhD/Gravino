import { NAV, SITE, SOCIALS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative mt-6 bg-deep text-cream">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="text-3xl font-extrabold tracking-tight text-cream">
              {SITE.wordmark}
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/70">
              A design department on tap — senior craft, systemic process, fair
              pricing.
            </p>
            <p className="mt-4 text-xs text-cream/50">{SITE.location}</p>
          </div>

          <FooterCol title="Contact">
            <FooterLink href={`mailto:${SITE.email}`}>{SITE.email}</FooterLink>
            <FooterLink href="#contact">WhatsApp</FooterLink>
            <FooterLink href="#contact">Book a call</FooterLink>
          </FooterCol>

          <FooterCol title="Explore">
            {NAV.map((l) => (
              <FooterLink key={l.label} href={l.href}>
                {l.label}
              </FooterLink>
            ))}
          </FooterCol>

          <FooterCol title="Social">
            {SOCIALS.map((s) => (
              <FooterLink key={s.label} href={s.href}>
                {s.label}
              </FooterLink>
            ))}
          </FooterCol>
        </div>

        <div className="mt-14 mb-6 h-px bg-white/10" />

        <div className="flex flex-col items-start justify-between gap-3 text-xs text-cream/50 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {SITE.tagline}.
          </p>
          <p>
            Pricing shown “from” — custom quotes after a quick chat. GST/taxes
            extra where applicable.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-periwinkle">
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-cream/70 transition-colors hover:text-cream"
      >
        {children}
      </a>
    </li>
  );
}
