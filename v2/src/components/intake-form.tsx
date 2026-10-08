"use client";

import { createContext, useContext, useEffect, useId, useState } from "react";
import {
  FORM_ENDPOINT,
  buildPayload,
  isSuccess,
  errorFrom,
} from "@/lib/form-transport";
import { NEXT_STEPS } from "@/lib/next-steps";

/* ===========================================================================
 * The project intake form. ONE implementation, rendered in two places: inside
 * the modal every "Start a Project" button opens, and inline on /contact.
 *
 * It replaced the free one-page teardown offer (the client, 2026-10-01): the
 * site now asks for a project, not for a deck to review. The fields are what
 * a first reply needs to be useful: who, what kind of work, by when, roughly
 * what budget, and how they heard of us.
 * ---------------------------------------------------------------------------
 * It posts to whatever form-transport.ts selects: by default send.php on our
 * own server, which mails it on through Resend. It does not open the
 * visitor's mail client.
 *
 * THREE THINGS FIXED AFTER REVIEW, all the same underlying fault: the form
 * was built to look like a form rather than to be used.
 *
 * 1. PLACEHOLDERS. Every field carried a stock demo value: "Jane Doe",
 *    "jane@company.com", "Acme Technologies", "+91 98765 43210". That is
 *    filler. It repeats the label directly above it, it makes real input
 *    compete with grey text that also looks like input, and on an agency's
 *    own site it reads as a template nobody edited. Gone. The labels say what
 *    each field is, which is their job. The ONE placeholder left is on the
 *    project details field, where the question is genuinely open-ended.
 *
 * 2. ROUNDING. rounded-xl on every field and rounded-full on the button, in a
 *    design language whose own panels sit much tighter. Pulled back so the
 *    form looks like it belongs to the page it is on.
 *
 * 3. HEIGHT ON MOBILE. Six stacked fields at py-3 with space-y-5 filled the
 *    viewport before the submit button appeared, so on a phone you could not
 *    see the thing you were being asked to do. Padding and gaps are tighter,
 *    email and phone share a row at every width, and the modal aligns to the
 *    top on small screens so it scrolls naturally instead of centring a box
 *    taller than the screen.
 *
 * SECOND ROUND (the client, 2026-10-08): "no CTAs or directional aids after
 * they fill the form", a focus highlight "too hard", and choices hidden in
 * dropdowns. So: pills for every choice, two labelled groups, a lighter
 * focus state, errors written under the field they belong to, and a success
 * screen that says what happens next and offers the next useful thing.
 * ======================================================================== */

/* The options. `value` is what arrives in the email, so it is written to be
   read there; `label` (and `hint`) is what the pill shows, kept short so a
   row of pills scans. No dashes in ranges: "to". */
type Option = { value: string; label?: string; hint?: string };

const SERVICES: Option[] = [
  { value: "Investor or board deck" },
  { value: "Annual, ESG or impact report" },
  { value: "Brand identity" },
  { value: "Film or motion" },
  { value: "Campaign or digital marketing" },
  { value: "Something else" },
];
const TIMELINES: Option[] = [
  { value: "Within 2 weeks" },
  { value: "Within a month" },
  { value: "1 to 3 months" },
  { value: "Flexible" },
];
const BUDGETS: Option[] = [
  { value: "Under ₹2 lakh (under $2,500)", label: "Under ₹2 lakh", hint: "under $2,500" },
  { value: "₹2 to 5 lakh ($2,500 to $6,000)", label: "₹2 to 5 lakh", hint: "$2.5k to 6k" },
  { value: "₹5 to 15 lakh ($6,000 to $18,000)", label: "₹5 to 15 lakh", hint: "$6k to 18k" },
  { value: "Over ₹15 lakh (over $18,000)", label: "Over ₹15 lakh", hint: "over $18k" },
  { value: "Not sure yet" },
];
const SOURCES: Option[] = [
  { value: "Referral" },
  { value: "LinkedIn" },
  { value: "Search" },
  { value: "Other" },
];

type State = "idle" | "sending" | "sent" | "error";

/* The form renders twice on /contact (inline, and inside the hidden modal),
   so error ids carry a per-form prefix or aria-describedby could point at
   the other form's message. */
const IdPrefix = createContext("intake");
type Errors = Partial<Record<string, string>>;

/* Fields read as wells cut into the card: a slightly darker ground and an
   inset shadow. FOCUS WAS TOO HEAVY (the client, 2026-10-08): a solid violet
   border plus a 3px ring shouted on every click. Now the ring is gone and
   the border warms to a half-strength violet while the well lightens a
   touch: still a plain focus indicator (WCAG 2.4.7), just not a loud one.
   (Text fields match :focus-visible on every focus, mouse included, so a
   ring there would have come straight back.) */
const FIELD_CLASS =
  "w-full rounded-lg border border-white/12 bg-black/40 px-4 py-3 text-[0.95rem] text-white " +
  "shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] placeholder:text-slate-400 " +
  "transition-[border-color,background-color] duration-200 outline-none " +
  "hover:border-white/20 focus:border-[#a78bfa]/55 focus:bg-black/25 " +
  "aria-[invalid=true]:border-red-400/60 aria-[invalid=true]:focus:border-red-300/70";

function Label({
  children,
  optional,
  as: Tag = "span",
}: {
  children: React.ReactNode;
  optional?: boolean;
  as?: "span" | "legend";
}) {
  return (
    <Tag
      className="mb-1.5 block text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400"
    >
      {children}
      {optional ? (
        <span className="ml-2 normal-case tracking-normal text-slate-500">optional</span>
      ) : (
        <span aria-hidden className="ml-1 text-[#a78bfa]">
          *
        </span>
      )}
    </Tag>
  );
}

/** A field's own error, announced and tied to the field by id. */
function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 text-[12.5px] text-red-300">
      {message}
    </p>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
  hint,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  error?: string;
}) {
  const prefix = useContext(IdPrefix);
  const errId = `${prefix}-${name}-error`;
  const hintId = `${prefix}-${name}-hint`;
  return (
    <label className="block">
      <Label optional={!required}>{label}</Label>
      <input
        type={type}
        name={name}
        autoComplete={autoComplete}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={[hint ? hintId : "", error ? errId : ""].filter(Boolean).join(" ") || undefined}
        className={FIELD_CLASS}
      />
      {hint && !error ? (
        <span id={hintId} className="mt-1 block text-[11.5px] text-slate-500">
          {hint}
        </span>
      ) : null}
      <ErrorText id={errId} message={error} />
    </label>
  );
}

/* Pills: every option visible, one tap to choose (the client, 2026-10-08,
   over dropdowns that hid the budget ranges until opened). Underneath they
   are ordinary radio buttons in a fieldset, so arrow keys, screen readers
   and form data all behave as a radio group does. Optional groups can be
   cleared by tapping the chosen pill again. */
function Pills({
  legend,
  name,
  options,
  required = false,
  error,
}: {
  legend: string;
  name: string;
  options: Option[];
  required?: boolean;
  error?: string;
}) {
  const [value, setValue] = useState("");
  const errId = `${useContext(IdPrefix)}-${name}-error`;
  return (
    <fieldset
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errId : undefined}
      data-pills={name}
    >
      <Label as="legend" optional={!required}>
        {legend}
      </Label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label key={o.value} className="cursor-pointer">
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => setValue(o.value)}
                onClick={() => {
                  if (!required && checked) setValue("");
                }}
                className="peer sr-only"
              />
              <span
                className={
                  "inline-flex items-baseline gap-1.5 rounded-full border px-3.5 py-[7px] text-[13px] leading-snug transition-colors duration-150 " +
                  "peer-focus-visible:ring-2 peer-focus-visible:ring-[#a78bfa]/60 peer-focus-visible:ring-offset-1 peer-focus-visible:ring-offset-[#111129] " +
                  (checked
                    ? "border-[#a78bfa]/70 bg-[#7b3fe4]/25 text-white"
                    : error
                      ? "border-red-400/40 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white"
                      : "border-white/12 bg-white/[0.03] text-slate-300 hover:border-white/30 hover:text-white")
                }
              >
                {checked ? (
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3 w-3 shrink-0 self-center text-[#c4b5fd]" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : null}
                <span>{o.label ?? o.value}</span>
                {o.hint ? <span className={checked ? "text-[11.5px] text-violet-200/80" : "text-[11.5px] text-slate-500"}>{o.hint}</span> : null}
              </span>
            </label>
          );
        })}
      </div>
      <ErrorText id={errId} message={error} />
    </fieldset>
  );
}

/** A small heading that splits the form into the two things it asks about. */
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="flex items-center gap-3 text-[10.5px] font-mono uppercase tracking-[0.22em] text-[#20c4f4]/80">
        {title}
        <span aria-hidden className="h-px flex-1 bg-white/10" />
      </p>
      {children}
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Our own validation instead of the browser's. The browser's bubbles cannot
   point at a visually hidden radio, appear one at a time, and vanish as soon
   as you move; these sit under the field they belong to until it is fixed. */
function validate(f: Record<string, string>): Errors {
  const e: Errors = {};
  if (!f.name) e.name = "Please tell us your name.";
  if (!f.email) e.email = "We need an email to reply to.";
  else if (!EMAIL_RE.test(f.email)) e.email = "That email does not look right.";
  if (!f.phone) e.phone = "A number lets us call if that is quicker.";
  else if (f.phone.replace(/\D/g, "").length < 7) e.phone = "That number looks too short.";
  if (!f.service) e.service = "Choose the closest fit.";
  if (!f.timeline) e.timeline = "Choose a rough timeline.";
  if (!f.details) e.details = "A line or two is enough.";
  return e;
}

/** What the success screen echoes back. */
type Sent = { first: string; email: string; service: string; timeline: string; budget: string; who: string; confirmation: boolean };

export function IntakeForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Sent | null>(null);
  // Remounts the fields (clearing pills too) when a new enquiry starts.
  const [round, setRound] = useState(0);
  const prefix = `intake${useId().replace(/:/g, "")}`;

  /* In the modal, a closed dialog should open on a fresh form next time,
     not on the last visitor's thank-you. */
  useEffect(() => {
    if (!compact) return;
    const modal = document.getElementById("intakeModal");
    if (!modal) return;
    const watcher = new MutationObserver(() => {
      if (!modal.classList.contains("active")) {
        window.setTimeout(() => {
          setState((s) => (s === "sent" ? "idle" : s));
          setSent(null);
          setRound((r) => r + 1);
        }, 300);
      }
    });
    watcher.observe(modal, { attributes: true, attributeFilter: ["class"] });
    return () => watcher.disconnect();
  }, [compact]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form).entries());
    const fields: Record<string, string> = {};
    for (const [k, v] of Object.entries(raw)) fields[k] = typeof v === "string" ? v.trim() : "";

    const found = validate(fields);
    setErrors(found);
    const firstBad = Object.keys(found)[0];
    if (firstBad) {
      // Focus the first problem: the input itself, or a group's first pill.
      const el =
        form.querySelector<HTMLElement>(`[name="${firstBad}"]:not([type="radio"])`) ??
        form.querySelector<HTMLElement>(`[data-pills="${firstBad}"] input`);
      el?.focus();
      setState("idle");
      return;
    }

    setState("sending");
    setError("");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildPayload(raw)),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !isSuccess(body)) {
        throw new Error(errorFrom(body) || "That did not send. Please email create@gravino.in directly.");
      }
      setSent({
        first: fields.name.split(/\s+/)[0] ?? "",
        email: fields.email,
        service: fields.service,
        timeline: fields.timeline,
        budget: fields.budget,
        who: fields.company || fields.name,
        confirmation: (body as Record<string, unknown>)?.confirmation === true,
      });
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error && err.message ? err.message : "That did not send. Please email create@gravino.in directly.",
      );
    }
  }

  if (state === "sent" && sent) {
    return <Success sent={sent} inModal={compact} />;
  }

  /* Clear a field's error as soon as the visitor changes it. */
  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (name && errors[name]) setErrors(({ [name]: _gone, ...rest }) => rest);
  };

  return (
    <IdPrefix.Provider value={prefix}>
    <form key={round} onSubmit={onSubmit} onChange={onChange} noValidate className="space-y-6">
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Group title="About you">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Your name" name="name" required autoComplete="name" error={errors.name} />
          <Field label="Company" name="company" autoComplete="organization" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
          {/* The country code is what makes the WhatsApp button in our lead
              email work; without it we have to guess. */}
          <Field label="Phone" name="phone" type="tel" required autoComplete="tel" hint="With country code" error={errors.phone} />
        </div>
      </Group>

      <Group title="The project">
        <Pills legend="Service" name="service" options={SERVICES} required error={errors.service} />
        <Pills legend="Timeline" name="timeline" options={TIMELINES} required error={errors.timeline} />
        <Pills legend="Budget" name="budget" options={BUDGETS} />
        <label className="block">
          <Label>Project details</Label>
          <textarea
            name="details"
            rows={compact ? 3 : 4}
            aria-required
            aria-invalid={errors.details ? true : undefined}
            aria-describedby={errors.details ? `${prefix}-details-error` : undefined}
            placeholder="What is it, who is it for, and what has to be true when it is done?"
            className={`${FIELD_CLASS} resize-y`}
          />
          <ErrorText id={`${prefix}-details-error`} message={errors.details} />
        </label>
        <Pills legend="How you found us" name="source" options={SOURCES} />
      </Group>

      {Object.keys(errors).length ? (
        <p role="alert" className="sr-only">
          {Object.keys(errors).length === 1 ? "One field needs attention." : `${Object.keys(errors).length} fields need attention.`}
        </p>
      ) : null}

      {state === "error" ? (
        <p role="alert" className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <div className="space-y-3">
        <button
          type="submit"
          disabled={state === "sending"}
          className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(123,63,228,0.8)] transition-all duration-200 hover:shadow-[0_14px_36px_-10px_rgba(123,63,228,0.95)] disabled:opacity-60"
        >
          {state === "sending" ? "Sending" : "Send project details"}
          <span
            aria-hidden
            className={state === "sending" ? "animate-pulse" : "transition-transform duration-200 group-hover:translate-x-0.5"}
          >
            &rarr;
          </span>
        </button>

        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-[11px] leading-relaxed text-slate-400">
          <span>Confidential</span>
          <span aria-hidden className="text-slate-700">&middot;</span>
          <span>Reply within a working day</span>
          <span aria-hidden className="text-slate-700">&middot;</span>
          <span>Copyright transfers to you</span>
        </p>
      </div>
    </form>
    </IdPrefix.Provider>
  );
}

/* After sending. It used to be a tick and one line, a dead end (the client,
   2026-10-08). Now it confirms WHAT was received, says what happens next and
   when, and offers the two useful things to do meanwhile: send the deck or
   brief, and look at the work. */
function Success({ sent, inModal }: { sent: Sent; inModal: boolean }) {
  const filesHref =
    "mailto:create@gravino.in?subject=" +
    encodeURIComponent(`Files for: ${sent.who}`) +
    "&body=" +
    encodeURIComponent("Attached: the deck, brief or links for the project I just described on gravino.in.\n\n");
  const close = () => document.getElementById("closeIntakeBtn")?.click();

  return (
    <div className="py-2" role="status">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#20c4f4]/70 bg-[#20c4f4]/12 text-[#20c4f4]">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-light text-white">
          {sent.first ? `Thank you, ${sent.first}.` : "Thank you."} It reached us.
        </h3>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="What you sent">
        {[sent.service, sent.timeline, sent.budget].filter(Boolean).map((t) => (
          <li key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[12px] text-slate-300">
            {t}
          </li>
        ))}
      </ul>

      {/* The same three steps the /contact page promises (lib/next-steps). */}
      <ol className="mt-6 space-y-3.5">
        {NEXT_STEPS.map(([title, body], i) => (
          <Step key={title} n={i + 1} title={title}>
            {body}
          </Step>
        ))}
      </ol>
      <p className="mt-3 text-[12.5px] text-slate-400">
        Replies go to <span className="text-slate-200">{sent.email}</span>.
      </p>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-[13.5px] font-medium text-white">Have a deck, brief or reference?</p>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-300">
          {sent.confirmation
            ? `We have emailed a confirmation to ${sent.email}. Reply to it with any files or links and they join this enquiry.`
            : "Send it to us now and it joins this enquiry, so the first reply can already speak to it."}
        </p>
        {sent.confirmation ? null : (
          <a
            href={filesHref}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#20c4f4]/40 bg-[#20c4f4]/10 px-4 text-[13px] font-medium text-cyan-100 transition-colors hover:border-[#20c4f4]/80 hover:bg-[#20c4f4]/15"
          >
            Email a deck or brief
            <span aria-hidden>&rarr;</span>
          </a>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <a
          href="/portfolio/"
          className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(123,63,228,0.8)]"
        >
          See our work
          <span aria-hidden>&rarr;</span>
        </a>
        {inModal ? (
          <button type="button" onClick={close} className="min-h-11 rounded-lg px-4 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
            Done
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border border-white/15 font-mono text-[11px] text-slate-300">
        {n}
      </span>
      <div>
        <p className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#a78bfa]">{title}</p>
        <p className="mt-0.5 text-[13.5px] leading-relaxed text-slate-300">{children}</p>
      </div>
    </li>
  );
}

/* The project intake modal, rendered on EVERY page.
 *
 * It used to live only on the home page, where Arun's ui.js opened it by
 * class. Everywhere else "Start a Project" was a link to /contact, which is
 * not what the button says it does: it says it starts a project, so it should
 * open the form.
 *
 * The handlers below run on every page INCLUDING the home page, where ui.js
 * binds the same triggers. That double binding is safe because both do the
 * same idempotent thing: add or remove one class and set one style. Detecting
 * ui.js instead would be racy, since ArunRuntime injects it after mount.
 *
 * What this adds over ui.js: closing on the backdrop and on Escape, and
 * restoring focus. A modal you can only leave by finding the small x is a
 * trap on a phone.
 */
export function IntakeModal() {
  useEffect(() => {
    const modal = document.getElementById("intakeModal");
    if (!modal) return;

    /* Closed, the overlay is still in the DOM (it is shown by a class), so
     * without this a screen reader would read the whole form a second time
     * on every page, and Tab would walk into fields nobody can see. `inert`
     * removes it from both until it opens. */
    modal.setAttribute("inert", "");

    /* Tie `inert` to the open state itself rather than to open()/close().
     * On the home page ui.js also opens this dialog, including from buttons
     * it injects after this effect has run, which the trigger list below
     * never sees. If inert only lifted inside open(), a dialog opened by
     * ui.js would appear on screen and refuse every click and keystroke.
     * Watching the class makes it correct whoever opens or closes it. */
    const sync = () => {
      if (modal.classList.contains("active")) modal.removeAttribute("inert");
      else modal.setAttribute("inert", "");
    };
    const watcher = new MutationObserver(sync);
    watcher.observe(modal, { attributes: true, attributeFilter: ["class"] });

    // Where focus goes back to when the dialog closes: the button that
    // opened it, so a keyboard user is not dropped at the top of the page.
    let returnTo: HTMLElement | null = null;

    const open = (e?: Event) => {
      returnTo = (e?.currentTarget as HTMLElement) ?? (document.activeElement as HTMLElement);
      modal.removeAttribute("inert");
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
      // Focus the first field so a keyboard user lands inside the dialog.
      modal.querySelector<HTMLInputElement>("input[name='name']")?.focus();
    };
    const close = () => {
      modal.classList.remove("active");
      modal.setAttribute("inert", "");
      document.body.style.overflow = "";
      returnTo?.focus();
      returnTo = null;
    };

    const triggers = Array.from(
      document.querySelectorAll<HTMLElement>(".trigger-intake"),
    );
    triggers.forEach((t) => t.addEventListener("click", open));

    document.getElementById("closeIntakeBtn")?.addEventListener("click", close);

    // Clicking the backdrop, but not the panel itself.
    const onBackdrop = (e: MouseEvent) => {
      if (e.target === modal) close();
    };
    modal.addEventListener("click", onBackdrop);

    const onKey = (e: KeyboardEvent) => {
      if (!modal.classList.contains("active")) return;
      if (e.key === "Escape") {
        close();
        return;
      }
      // Keep Tab inside the dialog while it is open (aria-modal promises it).
      if (e.key === "Tab") {
        const f = Array.from(
          modal.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      watcher.disconnect();
      triggers.forEach((t) => t.removeEventListener("click", open));
      modal.removeEventListener("click", onBackdrop);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      id="intakeModal"
      className="modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intakeModalTitle"
        className="modal-content relative my-auto w-full max-w-lg rounded-2xl border border-[#a7b6f2]/25 bg-[#111129] p-5 shadow-2xl sm:p-7"
      >
        {/* 44px: the one control everyone on a phone needs to hit. */}
        <button
          id="closeIntakeBtn"
          className="absolute top-3 right-3 grid h-11 w-11 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#20c4f4]">
          Start a project
        </p>
        <h3 id="intakeModalTitle" className="mt-1.5 text-xl font-light text-white">
          Tell us what you are working on
        </h3>
        <p className="mt-1.5 mb-5 text-sm leading-relaxed text-slate-300">
          A few details and we come back within a working day with questions,
          an approach and a clear next step.
        </p>

        <IntakeForm compact />
      </div>
    </div>
  );
}
