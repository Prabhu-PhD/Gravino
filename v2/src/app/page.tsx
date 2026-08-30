import { SiteNav, SiteFooter } from "@/components/site-chrome";
import {
  Hero,
  Problem,
  Balance,
  Model,
  Coverage,
  Comparison,
  Statement,
  Proof,
  Teardown,
} from "@/components/sections";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Problem />
        <Balance />
        <Model />
        <Coverage />
        <Comparison />
        <Statement />
        <Proof />
        <Teardown />
      </main>
      <SiteFooter />
    </>
  );
}
