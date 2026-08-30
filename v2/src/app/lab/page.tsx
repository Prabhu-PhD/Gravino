import Image from "next/image";
import { LogoSphere } from "@/components/logo-sphere";

/* Judging surface for the live mark, next to the brand render it is chasing.
   Not part of the site.

   Deliberately only THREE canvases. Every <LogoSphere> is its own <Canvas>
   and therefore its own WebGL context, each with its own PMREM of a 2048px
   environment. An earlier version of this page put seven on screen and the
   browser stopped responding to scroll. That is worth remembering for the
   real site too: the mark is a hero element, not something to sprinkle. */

export const metadata = { title: "Lab — Gravino mark" };

export default function Lab() {
  return (
    <main>
      <section className="bg-paper px-10 py-14">
        <p className="label text-on-paper-dim">
          Reference (left) &nbsp;·&nbsp; Live (right)
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-8">
          <div className="w-[420px] rounded-xl bg-white p-4">
            <Image
              src="/brand/logo-bubble.png"
              alt="Gravino logo bubble, as rendered in the brochure"
              width={600}
              height={603}
              className="w-full"
              priority
            />
          </div>
          <LogoSphere style={{ width: 420, height: 420 }} />
        </div>
      </section>

      <section className="bg-ink px-10 py-14 text-on-ink">
        <p className="label text-on-ink-dim">Live · ink ground</p>
        <div className="mt-8 flex items-center gap-10">
          <LogoSphere style={{ width: 300, height: 300 }} />
          <div className="flex items-center">
            <span className="font-display text-4xl font-medium tracking-[-0.03em]">
              Grav
            </span>
            <LogoSphere
              style={{ width: 76, height: 76, marginLeft: -8 }}
              satellite={false}
            />
          </div>
        </div>
        <p className="label mt-6 text-on-ink-dim">
          300 — section &nbsp;·&nbsp; 76 — nav lockup
        </p>
      </section>
    </main>
  );
}
