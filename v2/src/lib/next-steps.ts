/* What happens after someone sends the intake form. One source for the
   /contact page, the form's success screen, and (copied by hand, because it
   is PHP) the confirmation email in public/send.php: change one, change all
   three, so a visitor reads the same promise in every place. */
export const NEXT_STEPS: readonly (readonly [title: string, body: string])[] = [
  ["We read it ourselves", "Not a form queue. One of the four reads every project that comes in."],
  ["A short conversation", "Within a working day we come back with questions and a time to talk it through."],
  ["Then, a clear quote", "Scope, approach and price, fixed before any work begins."],
];
