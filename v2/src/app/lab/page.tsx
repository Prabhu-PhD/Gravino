import Image from "next/image";
import { LabScenes } from "@/components/lab-scenes";

/* Judging surface for the live glass scenes, next to the brand renders they
   are chasing. Not part of the site.

   Canvas count is kept low on purpose: every scene is its own WebGL context
   with its own PMREM of a 2048px environment. An earlier version of this page
   put seven on screen and the browser stopped responding to scroll. */

/* Not part of the site: noindex as well as the robots.txt disallow, since a
   disallow only asks crawlers not to fetch — it does not stop a page that was
   linked from somewhere else being indexed. */
export const metadata = {
  title: "Lab — glass",
  robots: { index: false, follow: false },
};

export default function Lab() {
  return (
    <main>
      <section className="bg-paper px-10 py-12">
        <p className="label text-on-paper-dim">
          Reference (left) &nbsp;·&nbsp; Live (right)
        </p>
      </section>

      <section className="bg-paper px-10 pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl bg-white">
            <Image
              src="/brand/glass-ribbon-balance.jpeg"
              alt="Brand render: a glass sphere balanced on a folded glass ribbon"
              width={3200}
              height={1800}
              className="w-full"
              priority
            />
          </div>
          <LabScenes scene="ribbon" />
        </div>
      </section>

      <section className="bg-paper-soft px-10 py-16">
        <p className="label text-on-paper-dim">The mark</p>
        <div className="mt-8 flex flex-wrap items-center gap-10">
          <div className="w-[300px] rounded-2xl bg-white p-4">
            <Image
              src="/brand/logo-bubble.png"
              alt="Brand render: the Gravino bubble"
              width={600}
              height={603}
              className="w-full"
            />
          </div>
          <LabScenes scene="mark" />
        </div>
      </section>
    </main>
  );
}
