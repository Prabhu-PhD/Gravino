"use client";

import { useState } from "react";
import {
  FORM_ENDPOINT,
  buildPayload,
  isSuccess,
  errorFrom,
} from "@/lib/form-transport";

/* ===========================================================================
 * The teardown form. ONE implementation, rendered in two places: inside the
 * modal the home page opens, and inline on /contact.
 * ---------------------------------------------------------------------------
 * It posts to whatever form-transport.ts selects, which is authenticated SMTP
 * to Titan. It does not open the visitor's mail client.
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
 *    notes field, where the question is genuinely open-ended.
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
 * ======================================================================== */

const ASSETS = [
  "Investor pitch deck",
  "Annual or ESG report",
  "Brand identity",
  "Launch film or video",
  "Something else",
];

type State = "idle" | "sending" | "sent" | "error";

const FIELD_CLASS =
  "w-full rounded-lg border border-white/15 bg-[#09090f] px-3.5 py-2.5 text-sm text-white " +
  "placeholder:text-slate-600 focus:border-[#7b3fe4] focus:outline-none " +
  "focus:ring-1 focus:ring-[#7b3fe4]/40 transition-colors";

function Label({
  children,
  optional,
}: {
  children: React.ReactNode;
  optional?: boolean;
}) {
  return (
    <span className="mb-1 block text-[11px] font-mono uppercase tracking-[0.14em] text-slate-400">
      {children}
      {optional ? (
        <span className="ml-2 normal-case tracking-normal text-slate-600">
          optional
        </span>
      ) : null}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <Label optional={!required}>{label}</Label>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className={FIELD_CLASS}
      />
    </label>
  );
}

export function TeardownForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildPayload(fields)),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !isSuccess(body)) {
        throw new Error(
          errorFrom(body) ||
            "That did not send. Please email create@gravino.in directly.",
        );
      }
      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(
        err instanceof Error && err.message
          ? err.message
          : "That did not send. Please email create@gravino.in directly.",
      );
    }
  }

  if (state === "sent") {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#20c4f4] bg-[#20c4f4]/15 text-[#20c4f4]">
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-4 text-xl font-light text-white">That reached us</h3>
        <p className="mx-auto mt-2.5 max-w-md text-sm leading-relaxed text-slate-300">
          One of the four will read it and reply within a working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="Your name" name="name" required autoComplete="name" />

      {/* Email and phone share a row at every width: both are short, and
          stacking them was most of the height problem on a phone. */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>

      <div className={compact ? "space-y-3.5" : "grid gap-3 sm:grid-cols-2"}>
        <Field label="Company" name="company" autoComplete="organization" />
        <label className="block">
          <Label>What should we look at</Label>
          <select name="asset" defaultValue={ASSETS[0]} className={FIELD_CLASS}>
            {ASSETS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <Label optional>Anything else</Label>
        <textarea
          name="notes"
          rows={2}
          placeholder="Paste a link, or tell us what is bothering you about it."
          className={`${FIELD_CLASS} resize-y`}
        />
      </label>

      {state === "error" ? (
        <p
          role="alert"
          className="rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-200"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full rounded-lg bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] px-5 py-3 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Send it over"}
      </button>

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        Confidential. No pitch attached. Copyright transfers to you on completion.
      </p>
    </form>
  );
}

/* The modal the home page opens. Arun's ui.js finds it by id and the triggers
   by class, so those two names are fixed; everything inside is ours. */
export function TeardownModal() {
  return (
    <div
      id="teardownModal"
      className="modal-overlay fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
    >
      <div className="modal-content relative my-auto w-full max-w-lg rounded-2xl border border-[#a7b6f2]/25 bg-[#111129] p-5 shadow-2xl sm:p-7">
        <button
          id="closeTeardownBtn"
          className="absolute top-4 right-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#20c4f4]">
          No cost, no pitch
        </p>
        <h3 className="mt-1.5 text-xl font-light text-white">
          Get your one-page teardown
        </h3>
        <p className="mt-1.5 mb-5 text-sm leading-relaxed text-slate-300">
          Send a deck, a report or a brand piece. We send back what is working,
          what it is costing you, and what we would change.
        </p>

        <TeardownForm compact />
      </div>
    </div>
  );
}
