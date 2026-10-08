"use client";

import { createContext, useContext, useEffect, useId, useRef, useState } from "react";
import {
  FORM_ENDPOINT,
  buildPayload,
  isSuccess,
  errorFrom,
} from "@/lib/form-transport";

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

/** What the success screen needs. `ref` lets a link be added afterwards. */
type Sent = { first: string; email: string; summary: string[]; who: string; confirmation: boolean; ref: string };

/** "Under ₹2 lakh (under $2,500)" -> "Under ₹2 lakh" for the one-line summary. */
const shortBudget = (b: string) => b.replace(/\s*\(.*\)\s*$/, "");

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
      const b = body as Record<string, unknown>;
      setSent({
        first: fields.name.split(/\s+/)[0] ?? "",
        email: fields.email,
        summary: [fields.service, fields.timeline, fields.budget && shortBudget(fields.budget)].filter(Boolean),
        who: fields.company || fields.name,
        confirmation: b?.confirmation === true,
        ref: typeof b?.ref === "string" ? b.ref : "",
      });
      setState("sent");
      // Not reset: "Wrong address?" brings the filled form back to correct.
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error && err.message ? err.message : "That did not send. Please email create@gravino.in directly.",
      );
    }
  }

  const done = state === "sent" && sent !== null;

  /* In the modal, the form's own header ("Tell us what you are working
     on...") must not sit above the thank-you, and the dialog takes its name
     from the thank-you instead. */
  useEffect(() => {
    if (!compact) return;
    const intro = document.getElementById("intakeModalIntro");
    const dialog = document.querySelector('#intakeModal [role="dialog"]');
    if (intro) intro.hidden = done;
    dialog?.setAttribute("aria-labelledby", done ? "intakeSuccessTitle" : "intakeModalTitle");
    if (done) document.getElementById("intakeModal")?.scrollTo({ top: 0 });
  }, [compact, done]);

  const editDetails = () => {
    setState("idle");
    window.setTimeout(() => {
      const email = document.querySelector<HTMLInputElement>(`form[data-intake="${prefix}"] input[name="email"]`);
      email?.focus();
      email?.select();
    }, 50);
  };

  /* Clear a field's error as soon as the visitor changes it. */
  const onChange = (e: React.FormEvent<HTMLFormElement>) => {
    const name = (e.target as HTMLInputElement).name;
    if (name && errors[name]) setErrors(({ [name]: _gone, ...rest }) => rest);
  };

  return (
    <IdPrefix.Provider value={prefix}>
    {done ? <Success sent={sent} onEdit={editDetails} /> : null}
    {/* Kept mounted (hidden) behind the thank-you, so "Wrong address?" can
        bring it back filled in. Cleared when the modal closes (round). */}
    <form key={round} data-intake={prefix} hidden={done} onSubmit={onSubmit} onChange={onChange} noValidate className="space-y-6">
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

/* After sending: SECOND VERSION (the client, 2026-10-08, on the first one:
   "I can see a lot of problems here"). The first stacked the form's own header
   above it, repeated "within a working day" three times, echoed the choices
   as pills that looked selectable, ran three numbered steps, offered three
   actions with the loudest one leading away, and relied on a mailto: link,
   which does nothing for anyone using webmail without a mail app set up.

   Now: one heading, one sentence saying who replies to which address (with a
   way back if the address is wrong), the choices as a plain line, and two
   actions: a link to a deck or brief (it reaches us as a follow-up to the
   same enquiry) beside "See our work", the two at equal weight. The modal's
   own header is hidden while this shows (see IntakeForm). */
/** The two success actions share one style, so neither outranks the other. */
const ACTION =
  "inline-flex min-h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-white/15 bg-white/[0.06] px-5 " +
  "text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/[0.1] sm:w-auto";

function Success({ sent, onEdit }: { sent: Sent; onEdit: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const [link, setLink] = useState("");
  const [added, setAdded] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const [open, setOpen] = useState(false);
  const inputId = useId();
  const panelId = `${inputId}-panel`;

  // Land focus on the confirmation, so a screen reader announces it and a
  // keyboard user is not left on a button that no longer exists.
  useEffect(() => {
    heading.current?.focus();
  }, []);

  async function addLink(e: React.FormEvent) {
    e.preventDefault();
    const value = link.trim();
    if (!/^https?:\/\/\S+\.\S+/i.test(value)) {
      setProblem("Paste the full link, starting with https://");
      return;
    }
    setBusy(true);
    setProblem("");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ followup: "1", ref: sent.ref, link: value, website: "" }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !isSuccess(body)) throw new Error(errorFrom(body) || "That did not reach us.");
      setAdded((a) => [...a, value]);
      setLink("");
    } catch (err) {
      setProblem(err instanceof Error && err.message ? err.message : "That did not reach us.");
    } finally {
      setBusy(false);
    }
  }

  const host = (u: string) => {
    try {
      return new URL(u).hostname.replace(/^www\./, "");
    } catch {
      return u;
    }
  };

  return (
    <div role="status" aria-live="polite" className="pt-1">
      <div className="grid h-9 w-9 place-items-center rounded-full border border-[#20c4f4]/60 bg-[#20c4f4]/10 text-[#20c4f4]">
        <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3
        id="intakeSuccessTitle"
        ref={heading}
        tabIndex={-1}
        className="mt-4 text-2xl font-light tracking-tight text-white outline-none"
      >
        {sent.first ? `Thanks, ${sent.first}. We have it.` : "Thanks. We have it."}
      </h3>
      {/* text-wrap: wrap, not the site's "pretty", which pulled four words
          down to avoid a short last line and left a ragged block in a 436px
          paragraph (measured). Inline, because the global `p` rule is
          unlayered and beats a utility class. */}
      <p className="mt-2 text-[15px] leading-relaxed text-slate-300" style={{ textWrap: "wrap" } as React.CSSProperties}>
        A senior member of our team will reply to <span className="font-medium text-white">{sent.email}</span> within a
        working day.{" "}
        <button type="button" onClick={onEdit} className="text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-white hover:decoration-slate-400">
          Wrong address?
        </button>
      </p>
      {sent.summary.length ? (
        <p className="mt-3 flex flex-wrap gap-x-2 text-[13px] text-slate-400">
          {sent.summary.map((t, k) => (
            <span key={t} className="whitespace-nowrap">
              {k ? <span aria-hidden className="mr-2 text-slate-600">&middot;</span> : null}
              {t}
            </span>
          ))}
        </p>
      ) : null}

      {/* Two actions of EQUAL weight, side by side (the client, 2026-10-08:
          the link box had outranked "See our work", which is the visitor's
          natural next step). The link field opens in place, on demand. */}
      {/* Stacked full-width on phones: side by side, the longer label
          wrapped to two lines and the pair no longer read as equal. */}
      <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:gap-3">
        <a href="/portfolio/" className={ACTION}>
          See our work <span aria-hidden>&rarr;</span>
        </a>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setOpen((o) => !o);
            window.setTimeout(() => document.getElementById(inputId)?.focus(), 30);
          }}
          className={`${ACTION} ${open ? "border-[#a78bfa]/50 bg-white/[0.09]" : ""}`}
        >
          Add a deck or brief <span aria-hidden>{open ? "\u2193" : "\u2192"}</span>
        </button>
      </div>

      {open ? (
        <div id={panelId} className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          {sent.ref ? (
            <form onSubmit={addLink} noValidate>
              <label htmlFor={inputId} className="block text-[13px] leading-relaxed text-slate-300">
                Paste a link (Google Drive, Dropbox, OneDrive, WeTransfer) and it joins this enquiry, so our first reply
                can already speak to it.
              </label>
              <div className="mt-3 flex gap-2">
                <input
                  id={inputId}
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  placeholder="Paste a link"
                  value={link}
                  onChange={(e) => {
                    setLink(e.target.value);
                    if (problem) setProblem("");
                  }}
                  aria-invalid={problem ? true : undefined}
                  aria-describedby={problem ? `${inputId}-problem` : undefined}
                  className={`${FIELD_CLASS} min-w-0 flex-1`}
                />
                <button
                  type="submit"
                  disabled={busy || !link.trim()}
                  className="shrink-0 rounded-lg bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] px-4 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
                >
                  {busy ? "Adding" : "Add"}
                </button>
              </div>
              {problem ? (
                <p id={`${inputId}-problem`} role="alert" className="mt-2 text-[12.5px] text-red-300">
                  {problem}
                </p>
              ) : null}
              {added.length ? (
                <ul className="mt-3 space-y-1.5" aria-label="Links added">
                  {added.map((u) => (
                    <li key={u} className="flex items-center gap-2 text-[13px] text-slate-300">
                      <svg className="h-3.5 w-3.5 shrink-0 text-[#20c4f4]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 16 16" aria-hidden>
                        <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className="truncate">Added: {host(u)}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </form>
          ) : (
            // No reference (the server could not store one): the address instead.
            <p className="text-[13px] leading-relaxed text-slate-300">
              Send a link to{" "}
              <a href="mailto:create@gravino.in" className="text-white underline underline-offset-4">
                create@gravino.in
              </a>{" "}
              and mention {sent.who}.
            </p>
          )}
          {sent.confirmation ? (
            <p className="mt-3 text-[12.5px] text-slate-500">Or reply to the confirmation we just emailed you, with files attached.</p>
          ) : null}
        </div>
      ) : null}
    </div>
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

        <div id="intakeModalIntro">
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
        </div>

        <IntakeForm compact />
      </div>
    </div>
  );
}
