import { GravityHero } from "@/components/gravity-hero";
import "../arun.css";

export const metadata = { title: "Cosmic hero — port preview" };

/* Preview route for the ported gravity hero.
   Kept off the home page until the downstream sections are ported too, so the
   working v2 home page is not broken half-way through the port.

   The empty sections below are not filler: the engine's scroll-lock logic
   looks up #what-we-cover, #proof-of-work, #teardown and #contact by id to
   decide when to release the pinned hero. Without them those lookups return
   null and the hero never unlocks. */
export default function CosmicPreview() {
  return (
    <div className="bg-[#09090f] text-slate-100 antialiased">
      <GravityHero />
      <section id="what-we-cover" className="min-h-screen bg-[#09090f]" />
      <section id="proof-of-work" className="min-h-screen bg-[#09090f]" />
      <section id="teardown" className="min-h-screen bg-[#09090f]" />
      <section id="contact" className="min-h-screen bg-[#09090f]" />
    </div>
  );
}
