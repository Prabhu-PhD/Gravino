const SCHEMA = [
  { key:"intro", intro:true },
  { key:"p1", eyebrow:"Part 1 of 6", title:"Your companies", qs:[
    { id:"q1", t:"Is LIMRA Health Services Inc registered in the Philippines?", type:"single",
      o:["Registered and active","Registration in progress","Planned, not started yet"] },
    { id:"q2", t:"If registered, which year?", type:"text", p:"e.g. 2026" },
    { id:"q3", t:"May we mention the registration on your profile?", type:"single", o:["Yes","No","Not yet"] },
    { id:"q4", t:"Which direction does the business run?", type:"single",
      o:["Indian hospitals expanding into the Philippines","Philippine institutions looking for Indian partners","Both equally"] },
    { id:"q5", t:"Which side do you expect to pay you first?", type:"single",
      o:["Indian hospitals","Philippine institutions","Not sure yet"] },
    { id:"q6", t:"LIMRA Overseas Education", type:"group",
      f:[{k:"founded",l:"Year founded"},{k:"title",l:"Your title"},{k:"active",l:"Still active today?"}] },
    { id:"q7", t:"Students placed", type:"group",
      f:[{k:"total",l:"Total placed"},{k:"period",l:"Over what period"},{k:"docs",l:"How many are now practising doctors"}] },
    { id:"q8", t:"May we publish these figures on your profile?", type:"single",
      o:["Yes, student numbers and FMGE pass rate","Student numbers only","FMGE pass rate only","Neither"] },
    { id:"q9", t:"The 92% FMGE pass rate", type:"group",
      f:[{k:"batch",l:"Which year or batch"},{k:"n",l:"How many students it covers"}] }
  ]},
  { key:"p2", eyebrow:"Part 2 of 6", title:"The Philippines", qs:[
    { id:"q10", t:"First year you worked with a Philippine institution", type:"text", p:"e.g. 2011" },
    { id:"q11", t:"Which Philippine institutions have you worked with?", h:"Add as many as you like.", type:"repeat",
      f:[{k:"name",l:"Institution"},{k:"city",l:"City"},{k:"since",l:"Since"},{k:"active",l:"Still active?"}] },
    { id:"q12", t:"Do any of them have a teaching hospital attached?", type:"single",
      o:["Yes, several","Yes, one or two","No","Not sure"] },
    { id:"q13", t:"How many times have you visited the Philippines since 2011?", type:"single",
      o:["1 to 5","6 to 15","16 to 30","More than 30"] },
    { id:"q14", t:"Which cities do you know well?", type:"text", p:"e.g. Manila, Cebu" },
    { id:"q15", t:"Have you signed any agreement or MoU with a Philippine institution?", type:"single",
      o:["Yes, signed","In discussion","Not yet"] },
    { id:"q16", t:"If signed, with whom?", type:"group",
      f:[{k:"who",l:"Institution"},{k:"name",l:"May we name them?"}] },
    { id:"q17", t:"Have you taken part in Philippine conferences or events?", h:"Tick all that apply.", type:"multi",
      o:["Spoken at one","Attended","Exhibited","Not yet"] },
    { id:"q18", t:"Senior people in the Philippines you could telephone this week", h:"Stays private. This will not appear on your profile.", priv:true, type:"repeat",
      f:[{k:"name",l:"Name"},{k:"role",l:"Role"},{k:"inst",l:"Institution"},{k:"since",l:"Known since"}] }
  ]},
  { key:"p3", eyebrow:"Part 3 of 6", title:"LIMRA Health so far", qs:[
    { id:"q19", t:"Since April 2026", h:"Rough numbers are fine.", type:"group",
      f:[{k:"res",l:"Hospitals or institutions researched"},{k:"mtg",l:"Meetings held, in person or online"},
         {k:"prop",l:"Proposals or concept notes sent"},{k:"cities",l:"Cities covered"},
         {k:"active",l:"Institutions in active discussion"}] },
    { id:"q20", t:"Are any Indian hospital groups in conversation with you?", h:"Stays private. Names are not needed.", priv:true, type:"single",
      o:["Yes, several","Yes, one or two","Not yet"] },
    { id:"q21", t:"Anything signed or close to signing?", type:"single", o:["Signed","Close","Not yet"] },
    { id:"q22", t:"Is the Manila hub still on track for early 2027?", type:"single",
      o:["On track","Likely a little later","Date not fixed yet"] },
    { id:"q23", t:"What will the Manila presence be?", h:"Tick all that apply.", type:"multi",
      o:["Registered address","Rented office","A person on the ground","Office and staff"] },
    { id:"q24", t:"May the profile describe LIMRA Health as newly launched?", type:"single",
      o:["Yes","Prefer not","Let us discuss"] }
  ]},
  { key:"p4", eyebrow:"Part 4 of 6", title:"About you", qs:[
    { id:"q25", t:"Education", type:"repeat", f:[{k:"q",l:"Qualification"},{k:"inst",l:"Institution"},{k:"yr",l:"Year"}] },
    { id:"q26", t:"Memberships, associations and chambers", type:"repeat", f:[{k:"body",l:"Body"},{k:"role",l:"Your role"}] },
    { id:"q27", t:"Awards, recognitions, board positions", type:"repeat", f:[{k:"a",l:"Award or position"},{k:"yr",l:"Year"}] },
    { id:"q28", t:"Press, interviews, articles or talks", type:"repeat", f:[{k:"where",l:"Where"},{k:"when",l:"When"}] },
    { id:"q29", t:"Languages", type:"repeat", f:[{k:"lang",l:"Language"},{k:"lvl",l:"Native, professional or conversational"}] },
    { id:"q30", t:"Tick the five you most want to be known for", type:"multi",
      o:["Hospital partnerships","International business development","Market entry strategy","Medical education",
         "Cross-border collaboration","Joint ventures","Institutional relations","Healthcare management",
         "Stakeholder engagement","Negotiation","Overseas education consulting","Strategic partnerships"] }
  ]},
  { key:"p5", eyebrow:"Part 5 of 6", title:"How you want to sound", qs:[
    { id:"q31", t:"What do you most want from LinkedIn in the next six months?", h:"Pick one.", type:"single",
      o:["Meetings with Indian hospital promoters","Introductions to Philippine hospital directors",
         "Support for conversations already underway","General visibility and recognition"] },
    { id:"q32", t:"Which style do you prefer?", type:"single",
      o:["Formal and institutional","Direct and conversational","A mix of both"] },
    { id:"q33", t:"Should the profile include LIMRA Overseas Education?", type:"single",
      o:["Yes, prominently","Yes, briefly","No"] },
    { id:"q34", t:"If a hospital chairman remembered one sentence about you, what should it be?", h:"Your own words.", type:"textarea" },
    { id:"q35", t:"Anything you do not want on the profile?", type:"textarea" }
  ]},
  { key:"p6", eyebrow:"Part 6 of 6", title:"Practical", qs:[
    { id:"q36", t:"Which email should the profile show?", type:"text", p:"name@limrahealth.com" },
    { id:"q37", t:"Can you send a new photograph?", h:"Collared shirt, a window in front of you, plain wall behind, framed from mid-chest up, looking at the camera. A phone is fine.", type:"single",
      o:["Yes","Please use the existing one"] },
    { id:"q38", t:"Can you send the LIMRA Health logo file?", type:"single", o:["Yes","Not to hand"] },
    { id:"q39", t:"Anyone else at LIMRA who should be on LinkedIn?", type:"repeat", f:[{k:"name",l:"Name"},{k:"role",l:"Role"}] },
    { id:"q40", t:"Anything else you would like us to know?", type:"textarea" }
  ]},
  { key:"done", review:true }
];

const KEY = "limra-intake-v1";
const STEP_KEY = KEY + "-step";
let data = {}, step = 0, resumed = false;
try { const r = localStorage.getItem(KEY); if (r) data = JSON.parse(r) || {}; } catch (e) {}
try {
  const n = parseInt(localStorage.getItem(STEP_KEY), 10);
  if (n > 0 && n < SCHEMA.length) { step = n; resumed = true; }
} catch (e) {}
// Answers saved before step-tracking existed: resume at the last part that has one.
if (!resumed) {
  for (let i = SCHEMA.length - 1; i > 0; i--) {
    const qs = SCHEMA[i].qs;
    if (qs && qs.some(q => asText(q))) { step = i; resumed = true; break; }
  }
}

const $ = id => document.getElementById(id);
const main = $("main");
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

let hintTimer = null;
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); localStorage.setItem(STEP_KEY, String(step)); } catch (e) { return; }
  $("hint").textContent = "Saved";
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => { $("hint").textContent = ""; }, 2000);
}
function toast(msg) {
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 2600);
}

function render() {
  const s = SCHEMA[step];
  $("count").textContent = (step + 1) + " / " + SCHEMA.length;
  $("rail").style.width = (step / (SCHEMA.length - 1) * 100) + "%";
  $("back").hidden = step === 0;
  $("next").textContent = s.review ? "Send on WhatsApp" : (step === 0 ? "Begin" : "Continue");
  main.innerHTML = "";
  if (s.intro) renderIntro();
  else if (s.review) renderReview();
  else renderPart(s);
  window.scrollTo(0, 0);
}

function renderIntro() {
  const d = document.createElement("div");
  d.innerHTML =
    '<p class="eyebrow">LinkedIn profile</p>' +
    "<h1>A few questions before we rewrite your profile</h1>" +
    '<p class="lede">About ten minutes, and most of it is tapping.</p>' +
    '<ul class="start-list">' +
    "<li><b>01</b><span>Your answers save as you go, so you can stop and come back.</span></li>" +
    "<li><b>02</b><span>Skip anything you would rather not answer.</span></li>" +
    "<li><b>03</b><span>Questions marked private will not appear on your profile.</span></li>" +
    "<li><b>04</b><span>At the end, one tap sends it all to us on WhatsApp.</span></li>" +
    "</ul>";
  main.appendChild(d);
}

function renderPart(s) {
  const head = document.createElement("div");
  head.innerHTML = '<p class="eyebrow">' + esc(s.eyebrow) + "</p><h1>" + esc(s.title) + "</h1>";
  main.appendChild(head);
  const box = document.createElement("div");
  box.className = "qs";
  s.qs.forEach(q => box.appendChild(renderQ(q)));
  main.appendChild(box);

  // Let him send a part-finished form without walking to the end.
  const bail = document.createElement("button");
  bail.type = "button";
  bail.className = "bail";
  bail.textContent = "Send what I have so far";
  bail.addEventListener("click", () => { step = SCHEMA.length - 1; persist(); render(); });
  main.appendChild(bail);
}

function renderQ(q) {
  const w = document.createElement("div");
  w.className = "q";
  let h = '<span class="q-t">' + esc(q.t) + "</span>";
  if (q.h) h += '<p class="q-h' + (q.priv ? " private" : "") + '">' + esc(q.h) + "</p>";
  w.innerHTML = h;
  const body = document.createElement("div");
  body.className = "q-body";
  w.appendChild(body);

  if (q.type === "single" || q.type === "multi") {
    const box = document.createElement("div");
    box.className = "opts";
    const cur = data[q.id];
    q.o.forEach((opt, i) => {
      const on = q.type === "single" ? cur === opt : Array.isArray(cur) && cur.includes(opt);
      const lab = document.createElement("label");
      lab.className = "opt" + (on ? " on" : "");
      lab.dataset.k = q.type;
      lab.innerHTML = '<input type="' + (q.type === "single" ? "radio" : "checkbox") + '" name="' + q.id +
        '" id="' + q.id + "_" + i + '"' + (on ? " checked" : "") + '><span class="tick"></span><span>' + esc(opt) + "</span>";
      lab.querySelector("input").addEventListener("change", ev => {
        if (q.type === "single") {
          data[q.id] = opt;
          box.querySelectorAll(".opt").forEach(e => e.classList.remove("on"));
          lab.classList.add("on");
        } else {
          const set = new Set(Array.isArray(data[q.id]) ? data[q.id] : []);
          ev.target.checked ? set.add(opt) : set.delete(opt);
          data[q.id] = [...set];
          lab.classList.toggle("on", ev.target.checked);
        }
        persist();
      });
      box.appendChild(lab);
    });
    body.appendChild(box);
  }

  if (q.type === "text" || q.type === "textarea") {
    const el = document.createElement(q.type === "text" ? "input" : "textarea");
    if (q.type === "text") el.type = "text";
    if (q.p) el.placeholder = q.p;
    el.id = q.id;
    el.value = data[q.id] || "";
    el.addEventListener("input", () => { data[q.id] = el.value; persist(); });
    body.appendChild(el);
  }

  if (q.type === "group") {
    const box = document.createElement("div");
    box.className = "fields";
    if (!data[q.id] || typeof data[q.id] !== "object") data[q.id] = {};
    q.f.forEach(f => {
      const row = document.createElement("div");
      row.innerHTML = '<label class="f-lab" for="' + q.id + "_" + f.k + '">' + esc(f.l) + "</label>";
      const inp = document.createElement("input");
      inp.type = "text"; inp.id = q.id + "_" + f.k;
      inp.value = data[q.id][f.k] || "";
      inp.addEventListener("input", () => { data[q.id][f.k] = inp.value; persist(); });
      row.appendChild(inp);
      box.appendChild(row);
    });
    body.appendChild(box);
  }

  if (q.type === "repeat") {
    if (!Array.isArray(data[q.id]) || !data[q.id].length) data[q.id] = [{}];
    const host = document.createElement("div");
    const draw = () => {
      host.innerHTML = "";
      data[q.id].forEach((row, idx) => {
        const b = document.createElement("div");
        b.className = "rep";
        const hd = document.createElement("div");
        hd.className = "rep-n";
        hd.innerHTML = "<span>" + (idx + 1) + "</span>";
        if (data[q.id].length > 1) {
          const x = document.createElement("button");
          x.type = "button"; x.className = "rep-x"; x.textContent = "Remove";
          x.addEventListener("click", () => { data[q.id].splice(idx, 1); if (!data[q.id].length) data[q.id] = [{}]; persist(); draw(); });
          hd.appendChild(x);
        }
        b.appendChild(hd);
        const fs = document.createElement("div");
        fs.className = "fields";
        q.f.forEach(f => {
          const r = document.createElement("div");
          r.innerHTML = '<label class="f-lab" for="' + q.id + "_" + idx + "_" + f.k + '">' + esc(f.l) + "</label>";
          const inp = document.createElement("input");
          inp.type = "text"; inp.id = q.id + "_" + idx + "_" + f.k;
          inp.value = row[f.k] || "";
          inp.addEventListener("input", () => { row[f.k] = inp.value; persist(); });
          r.appendChild(inp);
          fs.appendChild(r);
        });
        b.appendChild(fs);
        host.appendChild(b);
      });
      const add = document.createElement("button");
      add.type = "button"; add.className = "add"; add.textContent = "+ Add another";
      add.addEventListener("click", () => { data[q.id].push({}); persist(); draw(); });
      host.appendChild(add);
    };
    draw();
    body.appendChild(host);
  }
  return w;
}

function answered(q) {
  const v = data[q.id];
  if (v == null) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (Array.isArray(v)) return v.some(x => typeof x === "string" ? x.trim() : Object.values(x || {}).some(y => (y || "").trim()));
  if (typeof v === "object") return Object.values(v).some(y => (y || "").trim());
  return false;
}

function asText(q) {
  const v = data[q.id];
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) {
    if (!v.length) return "";
    if (typeof v[0] === "string") return v.join(", ");
    return v.map(r => q.f.map(f => (r[f.k] || "").trim()).filter(Boolean).join(" — ")).filter(Boolean).join("\n");
  }
  if (v && typeof v === "object") return q.f.map(f => (v[f.k] || "").trim() ? f.l + ": " + v[f.k].trim() : "").filter(Boolean).join("\n");
  return "";
}

function renderReview() {
  const parts = SCHEMA.filter(s => s.qs);
  const total = parts.reduce((a, s) => a + s.qs.length, 0);
  const done = parts.reduce((a, s) => a + s.qs.filter(answered).length, 0);
  const head = document.createElement("div");
  head.innerHTML = '<p class="eyebrow">Review</p><h1>' + done + " of " + total + " answered</h1>" +
    '<p class="lede">Have a look through, then copy everything and send it across. Blanks are perfectly fine.</p>';
  main.appendChild(head);
  parts.forEach(s => {
    const d = document.createElement("div");
    d.className = "sum";
    let html = "<h3>" + esc(s.title) + "</h3><dl>";
    s.qs.forEach(q => {
      const t = asText(q);
      html += "<dt>" + esc(q.t) + "</dt>" + (t ? "<dd>" + esc(t) + "</dd>" : '<dd class="none">Not answered</dd>');
    });
    d.innerHTML = html + "</dl>";
    main.appendChild(d);
  });
  const note = document.createElement("p");
  note.className = "note";
  note.textContent = "Send on WhatsApp opens your WhatsApp with all of this already typed out. Choose who to send it to and press send.";
  main.appendChild(note);

  const acts = document.createElement("div");
  acts.className = "acts";
  const mail = document.createElement("button");
  mail.type = "button"; mail.className = "act"; mail.textContent = "Send by email instead";
  mail.addEventListener("click", () => {
    window.location.href = "mailto:?subject=" + encodeURIComponent("LinkedIn questionnaire — Mohammed Ghani") +
      "&body=" + encodeURIComponent(plain());
  });
  const cp = document.createElement("button");
  cp.type = "button"; cp.className = "act"; cp.textContent = "Copy to clipboard";
  cp.addEventListener("click", () => copyOut());
  acts.appendChild(mail); acts.appendChild(cp);
  main.appendChild(acts);
}

async function copyOut() {
  const txt = plain();
  try { await navigator.clipboard.writeText(txt); toast("Copied. Paste it wherever you like."); return; }
  catch (e) {}
  if (!document.getElementById("fb")) {
    const ta = document.createElement("textarea");
    ta.id = "fb"; ta.className = "fallback"; ta.value = txt; ta.readOnly = true;
    main.appendChild(ta); ta.focus(); ta.select();
    ta.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  toast("Select the text below and copy it");
}

function plain() {
  const lines = ["LIMRA Health — LinkedIn profile questionnaire", "Mohammed Ghani", ""];
  SCHEMA.filter(s => s.qs).forEach(s => {
    lines.push("== " + s.title.toUpperCase() + " ==", "");
    s.qs.forEach(q => { const t = asText(q); lines.push(q.t, t ? t : "(not answered)", ""); });
  });
  return lines.join("\n");
}

$("back").addEventListener("click", () => { if (step > 0) { step--; persist(); render(); } });
$("next").addEventListener("click", () => {
  if (!SCHEMA[step].review) { step++; persist(); render(); return; }
  const enc = encodeURIComponent(plain());
  if (enc.length > 6000) { toast("Too long for WhatsApp — copying instead"); copyOut(); return; }
  window.open("https://wa.me/?text=" + enc, "_blank", "noopener");
});

render();
if (resumed) toast("Picking up where you left off");
