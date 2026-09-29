import { notFound } from "next/navigation";
import { CASES, getCase } from "@/lib/work";
import { CaseView } from "@/components/case/case-view";
import { JsonLd } from "@/components/json-ld";
import { pageMeta, breadcrumbTrailLd, caseStudyLd } from "@/lib/seo";
import "../case.css";

/* One static page per case study in src/lib/work.ts. `output: "export"`
   needs every slug up front, and dynamicParams = false makes an unknown slug
   a real 404 rather than an attempt to render nothing. */
export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) return {};
  return pageMeta({
    path: `/portfolio/${c.slug}/`,
    title: `${c.title} | ${c.kind} | Gravino`,
    description: c.summary,
    image: { url: c.cover, width: 1600, height: 896, alt: `${c.title}: ${c.kind}` },
  });
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCase((await params).slug);
  if (!c) notFound();
  return (
    <>
      <JsonLd data={breadcrumbTrailLd([["Home", "/"], ["Work", "/portfolio/"], [c.title, `/portfolio/${c.slug}/`]])} />
      <JsonLd data={caseStudyLd(c)} />
      <CaseView study={c} />
    </>
  );
}
