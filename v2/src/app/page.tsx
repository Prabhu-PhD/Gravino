import { SiteNav, SiteFooter } from "@/components/site-chrome";
import {
  Hero,
  Problem,
  Balance,
  Coverage,
  Model,
  Comparison,
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
        <Coverage />
        <Model />
        <Comparison />
        <Proof />
        <Teardown />
      </main>
      <SiteFooter />
    </>
  );
}
