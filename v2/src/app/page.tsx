import { SiteNav, SiteFooter } from "@/components/site-chrome";
import {
  Hero,
  Problem,
  Model,
  Coverage,
  Proof,
  Teardown,
} from "@/components/sections";

/* Six sections and a proof strip, down from nine.
   Two were cut for saying the same thing twice: Balance folded into Problem
   (one argument, previously split across two abstract setup sections), and
   the Statement band went entirely — it restated Balance's idea in bigger
   type without adding a fact. Its visual treatment survives on the closing
   CTA, which had content but no presence.

   Tonally: a light run, the dark peak at Coverage, a light breath, then the
   dark close. The freelancer/in-house comparison table now lives only on
   /for/cfo, where it is the entire argument rather than a detour. */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <Model />
        <Coverage />
        <Proof />
        <Teardown />
      </main>
      <SiteFooter />
    </>
  );
}
