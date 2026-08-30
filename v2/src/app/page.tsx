import { SiteNav, SiteFooter } from "@/components/site-chrome";
import {
  Hero,
  Problem,
  Model,
  Coverage,
  Comparison,
  Proof,
  Teardown,
} from "@/components/sections";

/* Six sections and a proof strip, down from nine.
   Two were cut for saying the same thing twice: Balance folded into Problem
   (one argument, previously split across two abstract setup sections), and
   the Statement band went entirely — it restated Balance's idea in bigger
   type without adding a fact. Its visual treatment survives on the closing
   CTA, which had content but no presence.

   Tonally the page still reads as two movements: a light run, then the dark
   block carrying the two heaviest arguments, then a light breath and the
   dark close. */
export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <Model />
        <Coverage />
        <Comparison />
        <Proof />
        <Teardown />
      </main>
      <SiteFooter />
    </>
  );
}
