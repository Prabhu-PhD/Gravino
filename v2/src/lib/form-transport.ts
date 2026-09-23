/* ===========================================================================
 * Where the teardown form posts.
 * ---------------------------------------------------------------------------
 * Two transports, chosen by one environment variable, because which one is
 * right depends on a fact about the hosting that is not settled yet.
 *
 *   NEXT_PUBLIC_WEB3FORMS_KEY set    -> Web3Forms
 *   not set (default)                -> /send.php on our own server
 *
 * THE DECIDING QUESTION IS NOW ANSWERED, AND IT GOES AGAINST mail().
 *
 * create@gravino.in is a GoDaddy mailbox on Titan, so the domain's MX
 * records point at Titan and NOT at the Broodle cPanel account. That means
 * PHP mail() is no longer local delivery. It would have to relay from a
 * shared-hosting IP, out to Titan, with no SPF alignment for that IP, which
 * is the exact arrangement that lands form mail in spam or gets it rejected
 * outright. send.php is kept as a fallback but it is now the WEAKEST of the
 * three options, not the strongest.
 *
 * Two better ones:
 *
 *   A. WEB3FORMS. Set NEXT_PUBLIC_WEB3FORMS_KEY and the form posts to them
 *      and they deliver. No credentials sit on the web server. Costs are
 *      listed below and one of them is not negotiable: the privacy policy
 *      has to be rewritten.
 *
 *   B. AUTHENTICATED SMTP TO TITAN, from send.php, using the mailbox's own
 *      credentials (smtp.titan.email, port 465, SSL). This is the most
 *      correct of the three: Titan is the authorised sender for the domain,
 *      so SPF and DKIM align and deliverability is as good as normal mail
 *      from that account. Nothing passes through a third party. The cost is
 *      that the mailbox password has to live on shared hosting, which is a
 *      real risk on a box we do not control, and it needs an SMTP client
 *      rather than mail().
 *
 * WHAT WEB3FORMS COSTS, stated plainly so it is a decision and not a default:
 *   - every submission passes through a third party, including any deck link
 *     or brief a prospect sends. The privacy policy currently states that
 *     nothing is shared outside Gravino. Switching makes that sentence FALSE
 *     and it has to be rewritten at the same time.
 *   - the free tier caps at 250 submissions a month.
 *   - the access key ships in client JavaScript. That is by design and it is
 *     not a secret, but it does mean the endpoint can be targeted directly,
 *     so their spam protection should be turned on.
 *
 * NOT TESTED: the Web3Forms path has never been exercised, because there is
 * no account or key yet. The shape below follows their documented API.
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
