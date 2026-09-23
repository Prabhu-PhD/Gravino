"use client";

import { useState } from "react";

/* ===========================================================================
 * The teardown form. ONE implementation, rendered in two places: inside the
 * modal the home page opens, and inline on /contact.
 * ---------------------------------------------------------------------------
 * WHAT CHANGED AND WHY. It used to compose a mailto: and hand off to the
 * visitor's mail client. That was wrong: it asks the person to send their own
 * enquiry, it does nothing at all on a device with no mail client set up, and
 * we had no record that anyone tried. It now posts to /send.php, which mails
 * create@gravino.in from the server.
 *
 * SHORTER. It asked for name, email, company, asset type and a link, all
 * required except the link. Three are required now: name, email, phone.
 * Everything else is optional and says so. A teardown request is the top of
 * the funnel, not an application form; the rest of it is a conversation.
 *
 * The modal shell keeps Arun's ids and classes, because ui.js opens it by id
 * and binds the triggers by class.
 * ======================================================================== */

const ASSETS = [
  "Investor pitch deck",
  "Annual or ESG report",
  "Brand identity",
  "Launch film or video",
  "Something else",
];

type State = "idle" | "sending" | "sent" | "error";

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-mono uppercase tracking-[0.14em] text-slate-400">
        {label}
        {required ? null : <span className="ml-2 normal-case tracking-normal text-slate-500">optional</span>}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-white/15 bg-[#09090f] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#7b3fe4] focus:outline-none"
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
    const payload = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    setError("");
    try {
      const res = await fetch("/send.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({ ok: false, error: "" }));
      /* The fallback carries the address. An earlier version threw a bare
         "That did not send." here, which then became err.message and hid the
         helpful default below, so a failed send told the visitor nothing
         they could act on. */
      if (!res.ok || !body.ok) {
        throw new Error(
          body.error ||
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
      <div className="py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#20c4f4] bg-[#20c4f4]/15 text-[#20c4f4]">
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl font-light text-white">That reached us</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-slate-300">
          We read every one ourselves. Expect a reply within one working day,
          with the teardown following inside 24 hours of that.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-4" : "space-y-5"} noValidate={false}>
      {/* Honeypot: hidden from people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <Field label="Your name" name="name" required placeholder="Jane Doe" autoComplete="name" />
        <Field label="Work email" name="email" type="email" required placeholder="jane@company.com" autoComplete="email" />
        <Field label="Phone" name="phone" type="tel" required placeholder="+91 98765 43210" autoComplete="tel" />
        <Field label="Company" name="company" placeholder="Acme Technologies" autoComplete="organization" />
      </div>

      <label className="block">
        <span className="mb-1.5 block text-xs font-mono uppercase tracking-[0.14em] text-slate-400">
          What should we look at?
        </span>
        <select
          name="asset"
          defaultValue={ASSETS[0]}
          className="w-full rounded-xl border border-white/15 bg-[#09090f] px-4 py-3 text-sm text-white focus:border-[#7b3fe4] focus:outline-none"
        >
          {ASSETS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-xs font-mono uppercase tracking-[0.14em] text-slate-400">
          Link or a line of context
          <span className="ml-2 normal-case tracking-normal text-slate-500">optional</span>
        </span>
        <textarea
          name="notes"
          rows={compact ? 2 : 3}
          placeholder="A link to the deck, or a sentence on what is bothering you about it."
          className="w-full resize-y rounded-xl border border-white/15 bg-[#09090f] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-[#7b3fe4] focus:outline-none"
        />
      </label>

      {state === "error" ? (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full rounded-full bg-gradient-to-r from-[#3867d6] to-[#7b3fe4] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        {state === "sending" ? "Sending..." : "Send it over"}
      </button>

      <p className="text-center text-[11px] text-slate-500">
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
      className="modal-overlay fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6"
    >
      <div className="modal-content relative w-full max-w-xl rounded-3xl border border-[#a7b6f2]/25 bg-[#111129] p-6 shadow-2xl sm:p-9">
        <button
          id="closeTeardownBtn"
          className="absolute top-5 right-5 rounded-full p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#20c4f4]">
          Start with a look, not a commitment
        </p>
        <h3 className="mt-2 text-2xl font-light text-white">Get your one-page teardown</h3>
        <p className="mt-2 mb-6 text-sm text-slate-300">
          Send us a deck, a report or a brand piece. We send back what is
          working, what it is costing you, and what we would change.
        </p>

        <TeardownForm compact />
      </div>
    </div>
  );
}
