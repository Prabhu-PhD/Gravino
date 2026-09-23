import {
  Page,
  PageHead,
  Statement,
  CtaBand,
  SHELL,
} from "@/components/page-shell";
import { GROUPS, BALANCE } from "@/lib/site";

export const metadata = {
  title: "What we cover",
  description:
    "Ten disciplines across capital and corporate narrative, brand and identity, growth and digital, and public and physical experience.",
};

/* THIS PAGE IS THE HOME PAGE'S CAPABILITY SECTION, EXPANDED.
 * ---------------------------------------------------------------------------
 * It went through a card grid, then a bordered list, then cards again, and
 * every version was a different design from the one thing it is a longer
 * version of. The home page already answers "what do you cover" in a
 * specific visual language, and arriving here from that section should feel
 * like the same room.
 *
 * So the language is lifted from it exactly, not approximated:
 *
 *   the group title    font-medium, violet  #a855f7
 *   each discipline    font-medium, sky     #38bdf8
 *   the explanation    slate-300, light
 *   what it includes   slate-400 bullets at text-xs
 *   the container      bg-black/10, backdrop blur, rounded-3xl
 *   the numeral        the oversized ghost figure the totem uses
 *
 * The one difference is deliberate: the home page shows ONE group at a time
 * behind a tab, because it is a teaser competing with a 3D scene. Here all
 * four are open, because this is the page you came to in order to read them.
 */

export default function Services() {
  return (
    <Page>
      <PageHead
        eyebrow="Comprehensive capability"
        headline="Four capabilities. One connected"
        accent="team."
        lede="From business communication to brand, growth and experience, we bring the disciplines together around what your business needs to achieve."
      />

      {GROUPS.map((g, i) => (
        <section
          key={g.n}
          className="relative overflow-hidden border-t border-white/[0.07] py-14 md:py-20"
          style={{
            background:
              i % 2
                ? "radial-gradient(circle at 70% 30%, #120d26 0%, #09090f 70%)"
                : "radial-gradient(circle at 25% 35%, #0f0c1d 0%, #06060a 75%)",
          }}
        >
          <div
            aria-hidden
            className={`pointer-events-none absolute h-[420px] w-[420px] rounded-full blur-[150px] ${
              i % 2
                ? "right-[8%] bottom-0 bg-[#20c4f4]/10"
                : "left-[8%] top-0 bg-[#7b3fe4]/14"
            }`}
          />

          <div className={`${SHELL} relative`}>
            <div className="lg:flex lg:items-start lg:gap-0">
              {/* The numeral, carried over from the home page totem. It
                  overlaps the panel on large screens exactly as it does
                  there; on smaller ones it sits above. */}
              <div className="relative z-20 shrink-0 lg:-mr-16 xl:-mr-20">
                <span className="block bg-gradient-to-b from-[#f0abfc] via-[#a855f7] to-[#38bdf8] bg-clip-text text-[clamp(3.5rem,11vw,7rem)] font-extralight leading-[0.85] tracking-tight text-transparent">
                  {g.n}
                </span>
              </div>

              <div className="relative z-10 mt-5 w-full rounded-3xl bg-black/20 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-8 lg:mt-0 lg:py-9 lg:pr-9 lg:pl-24 xl:pl-28">
                <h2 className="text-2xl font-medium leading-snug tracking-tight text-[#a855f7] sm:text-[28px] md:text-3xl">
                  {g.name}
                </h2>
                <p className="mt-3 max-w-2xl text-sm font-light leading-relaxed text-slate-300 md:text-[15px]">
                  {g.premise}
                </p>

                <div className="mt-8 grid gap-7 sm:gap-8 md:grid-cols-2 md:gap-x-10">
                  {g.disciplines.map((d) => (
                    <div key={d.n} className="space-y-2">
                      {/* kind is used as authored. Lower-casing it to match the
                          home page turned "ESG" into "esg". */}
                      <h3 className="text-sm font-medium leading-snug text-[#38bdf8] sm:text-[15px]">
                        {d.title}: {d.kind}
                      </h3>
                      <p className="text-xs font-light leading-relaxed text-slate-300 sm:text-sm md:text-[15px]">
                        {d.blurb}
                      </p>
                      <div className="space-y-1 pt-1 text-xs font-light text-slate-400">
                        {d.items.map((it) => (
                          <div key={it}>&bull; {it}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <Statement attribution="Why any of this matters">{BALANCE.pull}</Statement>

      <CtaBand
        headline="Not sure which of these you"
        accent="need?"
        body="Send us what you already have: a deck, a report, a brand piece. We come back with a one-page read on what is working, what is not, and which of the ten actually applies."
      />
    </Page>
  );
}
