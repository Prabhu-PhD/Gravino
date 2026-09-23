import { Page, PageHead, Section, SHELL } from "@/components/page-shell";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Privacy Policy",
  description: "What Gravino collects through this website, why, and how to have it removed.",
};

/* NOT LEGAL ADVICE, AND NOT YET REVIEWED BY A LAWYER.
   This is an accurate description of what the site actually does: one form,
   posting to one PHP endpoint, mailed to one address, with no analytics, no
   cookies and no third-party scripts. It is written from the code rather than
   from a template, so it does not claim practices we do not have.
   India's DPDP Act 2023 obligations should be checked against it before
   launch, and the entity name and grievance officer need filling in. */

const SECTIONS: [string, string[]][] = [
  ["What we collect", [
    "If you submit the form on this site, we receive the name, email address and phone number you enter, plus the company name, the category you select and any note or link you add.",
    "The server also records the IP address the submission came from and the time it arrived, which is standard for a web form and helps us identify automated abuse.",
  ]],
  ["What we do not do", [
    "This site sets no cookies, runs no analytics, and loads no advertising or tracking scripts. There is no visitor profiling and no third-party pixel of any kind.",
    "We do not sell, rent or share what you send us with anyone outside Gravino.",
  ]],
  ["Why we hold it", [
    "Solely to answer you. A submission is a request for a teardown or a conversation, and the details are what let us reply and, if it goes further, to quote for work.",
  ]],
  ["Where it goes", [
    `Submissions are emailed to ${SITE.email} and held in that mailbox. Any material you send us for review is treated as confidential and is not shown to anyone outside the team.`,
  ]],
  ["How long we keep it", [
    "Enquiry emails are kept while the conversation is live and for a reasonable period after, so we can pick up a thread you return to. Ask us to delete yours and we will.",
  ]],
  ["Your rights", [
    `Write to ${SITE.email} to ask what we hold about you, to have it corrected, or to have it deleted. We will action it and confirm when it is done.`,
  ]],
];

export default function Privacy() {
  return (
    <Page>
      <PageHead
        eyebrow="Privacy Policy"
        headline="What we collect, and"
        accent="why."
        lede="Short, because the site does very little. One form, one mailbox, no tracking."
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

          <p className="border-t border-white/12 pt-6 text-sm font-light leading-relaxed text-slate-500">
            Questions about any of this go to{" "}
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
