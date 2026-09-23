import { GravityHero } from "@/components/gravity-hero";
import { ArunSections } from "@/components/arun-sections";
import { ArunRuntime } from "@/components/arun-runtime";
import "../arun.css";

export const metadata = { title: "Cosmic hero — port preview" };

/* Preview route for Arun's build running inside Next.
   Kept off the home page until it is signed off, so the working v2 home page
   is not broken half-way through.

   Note there is no #contact element. app4.js looks one up, but index4.html
   does not contain it either, so this matches his build rather than adding
   an element he does not have. */
export default function CosmicPreview() {
  return (
    <div className="bg-[#09090f] text-slate-100 antialiased selection:bg-[#7b3fe4]/30 selection:text-white">
      <GravityHero />
      <ArunSections />
      <ArunRuntime />
    </div>
  );
}
