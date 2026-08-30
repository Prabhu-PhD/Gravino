import { SiteNav, SiteFooter } from "@/components/site-chrome";
import { FlutedEdge } from "@/components/editorial";
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
        <FlutedEdge />
        <Coverage />
        <Comparison />
        <Statement />
        <FlutedEdge flip />
        <Proof />
        <Teardown />
      </main>
      <SiteFooter />
    </>
  );
}
