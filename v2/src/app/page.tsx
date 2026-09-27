import { pageMeta, websiteLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { GravityHero } from "@/components/gravity-hero";
import { ArunSections } from "@/components/arun-sections";
import { ArunRuntime } from "@/components/arun-runtime";
import { CosmicFooter } from "@/components/cosmic-chrome";
import { TeardownModal } from "@/components/teardown-form";
import "./arun.css";

/* The home page: Arun's cosmic build, running his own engine and markup.

   The previous light home page lives in git history — see the commit shown
   by `git log -- src/app/page.tsx` immediately before this one. Its copy
   model in src/lib/site.ts is still live and still drives /about, /services,
   /contact.

   There is no #contact element. app4.js looks one up, but index4.html does
   not contain it either, so this matches his build rather than inventing an
   element he does not have. */
/* The home page's own metadata. It used to live in the root layout, where
   every other page inherited it: see src/lib/seo.ts. */
export const metadata = pageMeta({
  path: "/",
  title: "Gravino | Business communications partner, Chennai",
  description:
    "One senior team for the full surface of how your business communicates: investor decks, reports, brand, motion and campaigns. Where Balance Meets Value.",
});

export default function Home() {
  return (
    <div className="bg-[#09090f] text-slate-100 antialiased selection:bg-[#7b3fe4]/30 selection:text-white">
      <JsonLd data={websiteLd()} />
      <GravityHero />
      <ArunSections />
      <TeardownModal />
      <CosmicFooter />
      <ArunRuntime />
    </div>
  );
}
