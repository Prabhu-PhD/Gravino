/* ===========================================================================
 * Where the teardown form posts.
 * ---------------------------------------------------------------------------
 *   NEXT_PUBLIC_WEB3FORMS_KEY set    -> Web3Forms, straight from the browser
 *   not set (default)                -> /send.php on our own server
 *
 * THE DEFAULT IS THE RIGHT ONE. send.php now calls Resend's HTTPS API. The
 * API key stays on the server, the visitor's browser only ever talks to
 * gravino.in, and the privacy policy stays accurate about who sees what.
 *
 * HOW WE GOT HERE, because the history explains the shape:
 *
 *   mail()  was wrong. create@gravino.in is a Titan mailbox at GoDaddy, so
 *           the MX points away from this host and mail() would relay from a
 *           shared IP that SPF does not authorise (-all, DMARC quarantine).
 *
 *   SMTP    was right and is impossible here. Outbound SMTP is transparently
 *           intercepted: a TLS handshake completes against 192.0.2.1, an
 *           address with nothing behind it, presenting the host's own
 *           certificate, on 25, 465 and 587 alike. Proven by the host, not
 *           assumed. verify_peer=true was correctly refusing to continue.
 *
 *   HTTPS   works. Port 443 is clean on this host, so mail leaves over an
 *           API call instead of a mail protocol.
 *
 * WEB3FORMS REMAINS WIRED UP as a fallback, but taking it means the
 * visitor's browser posts directly to a third party, including any deck link
 * they send, and the privacy policy would have to be rewritten. It is the
 * option of last resort now, not the plan.
 * ======================================================================== */

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";

export const usingWeb3Forms = WEB3FORMS_KEY.length > 0;

export const FORM_ENDPOINT = usingWeb3Forms
  ? "https://api.web3forms.com/submit"
  : "/send.php";

/** Web3Forms wants its own envelope fields alongside the data. Our own
 *  endpoint takes the fields as they are. */
export function buildPayload(fields: Record<string, FormDataEntryValue>) {
  if (!usingWeb3Forms) return fields;

  const company = String(fields.company || "").trim();
  const name = String(fields.name || "").trim();

  return {
    ...fields,
    access_key: WEB3FORMS_KEY,
    subject: `Teardown request: ${company || name}`,
    from_name: "Gravino Website",
    // Their honeypot field name, so their filtering sees ours too.
    botcheck: fields.website ?? "",
  };
}

/** Both return JSON; they disagree about the success flag. */
export function isSuccess(body: unknown): boolean {
  if (typeof body !== "object" || body === null) return false;
  const b = body as Record<string, unknown>;
  return b.ok === true || b.success === true;
}

export function errorFrom(body: unknown): string {
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    const m = b.error ?? b.message;
    if (typeof m === "string" && m.trim()) return m;
  }
  return "";
}
