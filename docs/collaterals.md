# Gravino collaterals catalogue

Machine-readable list of every business collateral Gravino creates. Generated from the same source as `Gravino_Collaterals.docx`, so the two always agree.

## Rules for anyone (human or AI) using this file

1. **Only items with `status: offered` may be presented as something Gravino makes.** Items with `status: confirm` are plausible but appear in no Gravino document yet. Do not publish them until the client confirms.
2. **`name` is the client-facing label.** Use it verbatim in site copy and navigation.
3. **`also_called` is for matching, not for display.** Use it to map a client's words ("one-pager", "BRSR", "pitch deck") to the right item.
4. **Groups are ordered by the client's moment of need**, not by Gravino's internal disciplines. Keep that order when rendering a list for clients.
5. **`disciplines`** refers to the ten brochure disciplines below; use it to link an item to its service on the What We Cover page.
6. Site copy rule: no em dashes or en dashes in anything published.

Totals: 52 collaterals, 9 groups, 49 offered, 3 to confirm (investor-update, onboarding-deck, town-hall).

## Disciplines

| code | discipline |
|---|---|
| 01 | High-stakes corporate communications |
| 02 | Strategic brand architecture |
| 03 | Information design & data visualisation |
| 04 | ESG & impact reporting |
| 05 | Enterprise presentation infrastructure |
| 06 | Public awareness & social impact campaigns |
| 07 | Integrated digital marketing & lead generation |
| 08 | Editorial design & thought leadership |
| 09 | Motion design & corporate video |
| 10 | Spatial, event & experiential design |

## Groups

### 01. Raising money and running the board

- group_id: `capital`
- when_needed: When you are raising capital, reporting to investors or taking a decision to the board.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `investor-pitch-deck` | Investor pitch deck | The main deck you take to investors: the story, the market, the model, the numbers and the ask. | fundraising deck; pitch deck | 01 | offered | brochure |
| `investor-teaser` | Investor teaser | A 5 to 10 slide version sent ahead of a meeting, built to earn the meeting. | teaser deck; short deck | 01 | offered | brochure |
| `board-presentation` | Board presentation | Board meeting decks and papers that get the board to a decision quickly. | board deck; board papers | 01 | offered | brochure |
| `ipo-roadshow-deck` | IPO roadshow deck | The investor presentation for a public listing, built to hold up under scrutiny. | listing presentation | 01 | offered | brochure |
| `investor-update` | Investor update | Regular updates to existing investors: progress, numbers and what comes next. | quarterly investor report; shareholder update | 01, 04 | confirm | new |
| `keynote-presentation` | Keynote and conference presentation | Presentations for stages, conferences and leadership talks. | event presentation; speaker deck | 01 | offered | brochure |

### 02. Winning business

- group_id: `sales`
- when_needed: When you are selling: to prospects, in tenders, or anywhere a buyer is comparing you.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `sales-deck` | Sales deck | The deck your sales team walks prospects through. | sales presentation | 01, 07 | offered | brief |
| `company-profile` | Company profile | Who you are, what you have done and why a client should choose you. | credentials deck; capability deck; corporate profile | 01 | offered | brochure |
| `proposal-tender` | Proposal and tender document | Custom proposals and formal responses to tenders and RFPs. | RFP response; bid document | 08 | offered | brief |
| `case-study` | Case study | A client story: the problem, what was done and what changed. | client story; success story | 08 | offered | brochure |
| `product-brochure` | Product or service brochure | A multi-page brochure that explains a product, a service or the company. | corporate brochure; multi-page brochure | 07, 10 | offered | brief |
| `sell-sheet` | One-page sell sheet | Everything a buyer needs about one product or service, on a single page. | one-pager; product sheet; leave-behind | 07 | offered | brochure (sales collateral) |
| `service-menu` | Service menu or rate card | Your services and prices, laid out so a buyer can choose. | price list; services catalogue | 07 | offered | brochure |

### 03. Reporting

- group_id: `reporting`
- when_needed: When you owe a formal account to shareholders, regulators or stakeholders.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `annual-report` | Annual report | The year in review: results, milestones and governance, made readable. | yearly report | 04 | offered | brochure |
| `esg-report` | ESG or sustainability report | Environmental, social and governance disclosure, turned into a credibility asset. | sustainability report; BRSR; CSR report | 04 | offered | brochure |
| `governance-summary` | Governance summary | A clear summary of how the company is run and overseen. | governance report | 04 | offered | brochure |
| `impact-report` | Stakeholder or impact report | What the organisation achieved for the people and communities it serves. | impact report; stakeholder report | 04 | offered | brochure |

### 04. Thought leadership

- group_id: `thought-leadership`
- when_needed: When you want to be known for what you know.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `whitepaper` | Whitepaper | An in-depth paper that packages your expertise for senior readers. | position paper | 08 | offered | brochure |
| `research-report` | Research report | Research and analysis turned into findings a reader can act on. | industry report; insight report | 03 | offered | brochure |
| `newsletter` | Newsletter | A regular publication for clients, partners or the market. | client newsletter; bulletin | 08 | offered | brochure |
| `executive-brief` | Executive brief | A short, sharp paper an executive can read in one sitting. | briefing note; point of view | 08 | offered | brochure |
| `infographic` | Infographics and data visualisation | Numbers and research turned into visuals a decision-maker grasps in seconds. | charts; data story; infographic | 03 | offered | brochure |

### 05. Brand

- group_id: `brand`
- when_needed: When you are building a brand, changing one, or keeping everyone consistent with it.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `logo-identity` | Logo and visual identity | The logo, colours, typography and visual language that make you recognisable. | branding; brand identity | 02 | offered | brochure |
| `brand-guidelines` | Brand guidelines | The rules for using the brand, so anyone can apply it correctly. | brand book; style guide | 02 | offered | brochure (identity systems) |
| `rebrand` | Rebrand | A new or refreshed identity for a company that has outgrown its old one. | brand refresh | 02 | offered | brochure |
| `presentation-template` | Presentation template | A branded master deck your whole team builds from, so every deck stays on brand. | PowerPoint template; Keynote template; Google Slides template; master deck | 05 | offered | brochure |
| `document-templates` | Document and report templates | Branded templates for reports, proposals and everyday documents. | Word templates; letterhead template | 05 | offered | brochure |
| `stationery` | Business cards and stationery | Business cards, letterheads and the rest of the printed office kit. | letterhead; visiting cards; envelopes | 02, 10 | offered | brief |
| `asset-library` | Brand asset library | An organised library of logos, icons, images and graphics your team can use. | asset kit; icon and image library | 05 | offered | brochure |

### 06. Launch and marketing

- group_id: `marketing`
- when_needed: When you are launching something or taking the story to market.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `launch-film` | Launch film | A short film that introduces a company, product or campaign. | brand film; launch video | 09 | offered | brochure |
| `explainer-video` | Explainer video | A short animated video that makes a complex idea simple. | animated explainer; product video | 09 | offered | brochure |
| `animated-pitch` | Animated pitch sequence | A pitch told in motion, for screens, events and sharing. | motion deck; video pitch | 09 | offered | brochure |
| `social-media` | Social media posts and campaigns | Posts, carousels and campaign sets for your social channels. | social creatives; LinkedIn posts; Instagram posts | 07 | offered | brief |
| `digital-ads` | Digital ad creatives | Ads for search, social and display, designed to convert. | ads; paid social creatives; display ads | 07 | offered | brochure |
| `web-banners` | Web banners | Banners for websites, portals and ad networks. | display banners; website banners | 07 | offered | brief |
| `email-campaigns` | Email campaigns | Designed emails for campaigns, announcements and newsletters. | email newsletter; mailers; EDM | 07 | offered | brief |
| `website-design` | Website and landing page design | The design of websites and campaign landing pages. | UI/UX design; landing page; web design | 07 | offered | brief |
| `gtm-kit` | Go-to-market kit | Everything a launch needs, on one coherent identity. | launch kit; GTM collateral | 07 | offered | brochure |

### 07. Events and print

- group_id: `events-print`
- when_needed: When the brand has to show up in a room, on a stand or in someone's hands.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `exhibition-booth` | Exhibition booth | The design of your stand at exhibitions and trade shows. | trade show stall; expo stand | 10 | offered | brochure |
| `event-branding` | Event branding | Backdrops, standees, stage graphics and everything that brands an event. | backdrops; standees; stage design; event collateral | 10 | offered | brief |
| `brochure-flyer` | Brochures and flyers | Printed brochures, flyers and leaflets. | leaflets; pamphlets | 10 | offered | brief |
| `packaging` | Packaging | Boxes, labels and packaging that carry the brand. | product packaging; labels | 10 | offered | brochure |
| `signage` | Signage and office branding | Signs and branded graphics for offices and physical spaces. | environmental branding; office graphics; wayfinding | 10 | offered | brochure (environmental branding) |

### 08. Inside the company

- group_id: `internal`
- when_needed: When the audience is your own people.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `internal-playbook` | Internal playbook | How your company does things, written down and designed to be used. | sales playbook; process playbook | 08 | offered | brochure |
| `training-manual` | Training manual | Manuals and guides that teach people how to do something. | user manual; handbook | 08 | offered | brief |
| `technical-documentation` | Technical documentation | Long, technical documents kept clear and consistent to the last page. | technical manual; product documentation | 08 | offered | earlier site (team bios) |
| `onboarding-deck` | Employee onboarding deck | What a new joiner needs to know about the company, in one designed pack. | induction deck; new joiner handbook | 01 | confirm | new |
| `town-hall` | Town hall presentation | Leadership presentations to the whole company. | all-hands deck; leadership update | 01 | confirm | new |

### 09. Public campaigns

- group_id: `public`
- when_needed: When an institution or public initiative needs to reach and move a large audience.

| id | name | what_it_is | also_called | disciplines | status | source |
|---|---|---|---|---|---|---|
| `awareness-campaign` | Awareness campaign | A campaign that informs a large audience and changes what they do. | public campaign; social impact campaign | 06 | offered | brochure |
| `psa` | Public service announcement | Messages for the public good, in print, video or social. | PSA | 06 | offered | brochure |
| `outreach-material` | Community outreach material | Material for teams working directly with communities. | outreach kit | 06 | offered | brochure |
| `campaign-playbook` | Campaign playbook | The guide that lets partners run a campaign consistently. | campaign toolkit | 06 | offered | brochure |
