/* ===========================================================================
 * Make the teardown form actually send something.
 * ---------------------------------------------------------------------------
 * OURS, not Arun's. His ui.js binds a submit handler that calls
 * preventDefault() and swaps in the success panel - nothing is transmitted
 * anywhere, so the form told visitors their request had been received when it
 * had not. There is no backend on this site to post to.
 *
 * This file is loaded AFTER ui.js, so both submit listeners run: his reveals
 * the success panel, this one opens the visitor's mail client with the
 * request composed. The success copy in the markup was rewritten to describe
 * what actually happens, and carries a plain address as a fallback for
 * anyone with no mail client registered.
 *
 * His file is left byte-identical. Replacing this with a real endpoint later
 * means changing only submitTeardown() below.
 * ======================================================================== */

(function () {
  var TO = "create@gravino.in";

  var LABELS = {
    deck: "Investor Pitch Deck",
    report: "Annual / ESG Impact Report",
    brand: "Brand Identity & Positioning",
    motion: "Product Launch Film / Video Narrative",
    other: "Full Surface Communications",
  };

  function submitTeardown(form) {
    var get = function (n) {
      var el = form.querySelector('[name="' + n + '"]');
      return el ? String(el.value || "").trim() : "";
    };

    var asset = get("asset");
    var body = [
      "Name: " + get("name"),
      "Email: " + get("email"),
      "Company / Project: " + get("company"),
      "Asset for review: " + (LABELS[asset] || asset),
      "Link / context: " + (get("link") || "(none given)"),
      "",
      "Sent from the teardown form on gravino.in",
    ].join("\n");

    window.location.href =
      "mailto:" + TO +
      "?subject=" + encodeURIComponent("Teardown request — " + (get("company") || get("name"))) +
      "&body=" + encodeURIComponent(body);
  }

  function bind() {
    var form = document.getElementById("teardownForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      // ui.js already called preventDefault; calling it again is harmless and
      // keeps this correct if that file is ever swapped out.
      e.preventDefault();
      // Deferred a tick so his handler finishes revealing the success panel
      // before the browser hands off to the mail client. Handing off first
      // can leave the modal showing the form on return.
      setTimeout(function () {
        submitTeardown(form);
      }, 0);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind);
  } else {
    bind();
  }
})();
