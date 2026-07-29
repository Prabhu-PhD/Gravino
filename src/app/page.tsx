import { Hero } from "@/components/hero";
import { Positioning } from "@/components/positioning";
import { Pillars } from "@/components/pillars";
import { ContactCta } from "@/components/contact-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <Positioning />
      <Pillars />
      <ContactCta />
    </>
  );
}
