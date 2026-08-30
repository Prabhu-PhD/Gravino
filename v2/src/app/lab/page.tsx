import Image from "next/image";
import { LogoSphere } from "@/components/logo-sphere";

/* Judging surface for the live mark. Not part of the site — it exists so the
   bubble can be compared against the brand render, at the sizes it will
   actually be used, on both candidate grounds, before any of it is committed
   to a page layout. */

export const metadata = { title: "Lab — Gravino mark" };

function Lockup({ px, dark }: { px: number; dark?: boolean }) {
  return (
    <div className="flex items-center" style={{ gap: px * 0.04 }}>
      <span
        className="font-display font-medium tracking-[-0.03em]"
        style={{
          fontSize: px * 0.46,
          color: dark ? "var(--color-on-ink)" : "var(--color-on-paper)",
        }}
      >
        Grav
      </span>
      <LogoSphere style={{ width: px, height: px, marginLeft: -px * 0.12 }} />
    </div>
  );
}

export default function Lab() {
  return (
    <main>
      {/* --- Reference ------------------------------------------------ */}
      <section className="bg-paper-soft px-10 py-14">
        <p className="label text-on-paper-dim">Reference — brand render</p>
        <div className="mt-6 max-w-md overflow-hidden rounded-xl bg-white p-6">
          <Image
            src="/brand/logo-bubble.png"
            alt="Gravino logo bubble, as rendered in the brochure"
            width={600}
            height={603}
            className="w-full"
          />
        </div>
      </section>

      {/* --- Live, on paper ------------------------------------------- */}
      <section className="bg-paper px-10 py-16">
        <p className="label text-on-paper-dim">Live · paper ground</p>
        <div className="mt-10 flex flex-wrap items-end gap-16">
          <div>
            <LogoSphere style={{ width: 420, height: 420 }} />
            <p className="label mt-2 text-on-paper-dim">420 — hero</p>
          </div>
          <div>
            <LogoSphere style={{ width: 180, height: 180 }} />
            <p className="label mt-2 text-on-paper-dim">180 — section</p>
          </div>
          <div>
            <Lockup px={72} />
            <p className="label mt-4 text-on-paper-dim">72 — nav lockup</p>
          </div>
        </div>
      </section>

      {/* --- Live, on ink --------------------------------------------- */}
      <section className="bg-ink px-10 py-16 text-on-ink">
        <p className="label text-on-ink-dim">Live · ink ground</p>
        <div className="mt-10 flex flex-wrap items-end gap-16">
          <div>
            <LogoSphere style={{ width: 420, height: 420 }} />
            <p className="label mt-2 text-on-ink-dim">420 — hero</p>
          </div>
          <div>
            <LogoSphere style={{ width: 180, height: 180 }} />
            <p className="label mt-2 text-on-ink-dim">180 — section</p>
          </div>
          <div>
            <Lockup px={72} dark />
            <p className="label mt-4 text-on-ink-dim">72 — nav lockup</p>
          </div>
        </div>
      </section>

      {/* --- Live, on the brand gradient ------------------------------ */}
      <section
        className="px-10 py-16"
        style={{
          background:
            "linear-gradient(135deg, #e8eefb 0%, #eae6f8 40%, #f6ebf2 70%, #fdf7f4 100%)",
        }}
      >
        <p className="label text-on-paper-dim">Live · brochure gradient</p>
        <div className="mt-10">
          <LogoSphere style={{ width: 420, height: 420 }} />
        </div>
      </section>
    </main>
  );
}
