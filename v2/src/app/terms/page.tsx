import { pageMeta, breadcrumbLd } from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Page, PageHead, Section } from "@/components/page-shell";
import { SITE } from "@/lib/site";

export const metadata = pageMeta({
  path: "/terms/",
  title: "Terms & Disclaimer | Gravino",
  description:
    "Terms of use for the Gravino website, and what sending us a project enquiry does and does not commit you to.",
});

/* NOT LEGAL ADVICE, AND NOT YET REVIEWED BY A LAWYER. See the note in
   privacy/page.tsx. The commercial terms below restate what the brochure
   already promises a client; the site terms are ordinary and minimal. */

const SECTIONS: [string, string[]][] = [
  ["Using this site", [
    "The content here is published in good faith and for general information about what Gravino does. It is not an offer, a quotation or a contract.",
    "The text, imagery, layout and code of this site belong to Gravino. Please do not reproduce them as your own.",
  ]],
  ["Project enquiries", [
    "Sending a project enquiry through this site creates no obligation on either side. It is the start of a conversation, not an order.",
    "Anything we suggest in reply is based on what you have told us, and is not binding until scope and price are agreed in writing.",
  ]],
  ["What you send us", [
    "Material you send us stays confidential and is seen only by the team. We are happy to sign your NDA before you send anything.",
    "Please only send material you have the right to share. If something is under someone else's confidentiality obligation, get their clearance first.",
  ]],
  ["Commissioned work", [
    "Scope and price are agreed in writing before any paid work begins, after a conversation about what you actually need.",
    "On completion and settlement, the files and full copyright in the commissioned work transfer to you.",
  ]],
  ["Liability", [
    "We take care with this site and with the work, but we do not warrant that the site will be uninterrupted or error free, and we are not liable for indirect or consequential loss arising from use of the site.",
  ]],
  ["Governing law", [
    `These terms are governed by the laws of India, and the courts at ${SITE.location} have jurisdiction.`,
  ]],
];

export default function Terms() {
  return (
    <Page>
      <JsonLd data={breadcrumbLd("Terms & Disclaimer", "/terms/")} />
      <PageHead
        eyebrow="Terms & Disclaimer"
        headline="The terms, in plain"
        accent="English."
        lede="What this site is, what a project enquiry commits you to, and what happens to your material."
      />

      <Section>
        <div className="max-w-3xl space-y-10">
          {SECTIONS.map(([title, paras]) => (
            <div key={title} className="border-t border-white/12 pt-6">
              <h2 className="text-lg font-medium text-white">{title}</h2>
              {paras.map((p) => (
                <p key={p} className="mt-3 text-[0.95rem] font-light leading-relaxed text-slate-400">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <p className="border-t border-white/12 pt-6 text-sm font-light leading-relaxed text-slate-400">
            Anything unclear, write to{" "}
            <a href={`mailto:${SITE.email}`} className="text-slate-300 underline underline-offset-4 hover:text-white">
              {SITE.email}
            </a>
            . Last updated 2026.
          </p>
        </div>
      </Section>
    </Page>
  );
}
