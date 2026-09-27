import { Page, PageHead, Section, Card } from "@/components/page-shell";

export const metadata = {
  title: "Page not found",
  robots: { index: false },
};

/* ===========================================================================
 * The 404 page.
 * ---------------------------------------------------------------------------
 * Replaces Next's built-in default, which the live site was serving through
 * .htaccess (ErrorDocument 404 /404.html): a bare "404 | This page could not
 * be found." with no nav, no brand and no way back. That mattered more once
 * /about/ was taken down, since anyone following an old link lands here.
 *
 * It is a normal interior page on purpose: the same nav, the same head, the
 * planet on the right, and a short list of the places a visitor was most
 * likely trying to reach. `output: "export"` writes this to out/404.html,
 * which is the file .htaccess already points at, so no server change is
 * needed.
 * ======================================================================== */

const DESTINATIONS = [
  { href: "/", title: "Home", body: "Where everything starts." },
  { href: "/services/", title: "What we cover", body: "Ten disciplines, from the investor deck to the launch film." },
  { href: "/why-gravino/", title: "Why Gravino", body: "What working with an embedded partner is like." },
  { href: "/portfolio/", title: "Portfolio", body: "The work, and what changed because of it." },
] as const;

export default function NotFound() {
  return (
    <Page>
      <PageHead
        figure
        eyebrow="Page not found"
        headline="This page has"
        accent="drifted off."
        lede="The link may be old, or the address mistyped. Everything else is one click away."
      />

      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {DESTINATIONS.map((d) => (
            <a key={d.href} href={d.href} className="group block rounded-2xl">
              <Card className="h-full p-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-[1.15rem] font-normal text-white">{d.title}</h2>
                  <span aria-hidden className="text-cyan-300 transition-transform group-hover:translate-x-0.5">
                    &rarr;
                  </span>
                </div>
                <p className="mt-2 text-[0.925rem] font-light leading-relaxed text-slate-400">{d.body}</p>
              </Card>
            </a>
          ))}
        </div>
      </Section>
    </Page>
  );
}
