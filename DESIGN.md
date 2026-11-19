# DESIGN: "MANN / IN MOTION"

The design system for mannpatel.me since 19 November 2026. Motion is specified in [`MOTION.md`](MOTION.md), the reference
research in [`RESEARCH.md`](RESEARCH.md). The previous system ("Signal", rounds 5–11) is archived in
[`docs/archive/signal/`](docs/archive/signal/).

> **Extracted vs proposed.** Values marked **(extracted)** were already part of the live site and are kept: the
> MΛNN PΛTEL wordmark, Mann's real portraits, the real project captures, Geist/Geist Mono, the copy rules, prices and
> every honesty label. Everything else is **(proposed, implemented)**: new in this redesign, built and tested here.
> Nothing in this file is a measurement of the live site.

## 1. Three directions, and the choice

| | A · MANN / IN MOTION (chosen) | B · Field Notes | C · Night Map |
|---|---|---|---|
| **Idea in one sentence** | A creative studio the visitor can operate: one lime line connects Mann, his work and the visitor's need. | The site as Mann's annotated working notebook: redlines and measurements over real client screens. | Toronto at night as a stage: lime routes connect neighbourhoods to businesses. |
| **Hero storyboard** | "Make your next move." The full stop extends into a line, crosses into a stage where Mann stands in front of his real work; three need buttons re-route the line through a short demo. | A real capture with handwritten-style vector redlines drawing on, "what I changed and why", toggled by the visitor. | A dark map of the GTA; routes light up to a pin; the headline sits over the map. |
| **Page rhythm** | Dark immersive scenes alternating with quiet ivory editorial bands. | Mostly ivory; dark only for footer. | Dark throughout. |
| **Palette** | Ink #10110F, ivory #F3F1E8, acid lime #C9F64A. | Ivory, graphite, one red-pen accent. | Navy-black, lime routes, grey streets. |
| **Typography** | Expanded grotesk display (Mann Display) + Geist + Geist Mono labels. | Geist + Geist Mono, annotation in mono. | Geist only. |
| **Media direction** | Real captures as moving evidence, the real cut-out portrait on the stage, SVG/CSS demos. | Real captures with vector annotation layers. | Map tiles or a drawn map, small capture cards. |
| **Signature interaction** | The need selector re-routes the line and plays a demo on the stage. | "Show the redlines": annotations draw over the capture. | "Pick your area": routes light to it. |
| Originality | High: the line is a grammar, not an effect | Medium (redline aesthetic is known) | Low–medium |
| Service clarity | High: three needs = three services, each with a demo | Medium: favours web design over Google/automation | Low: implies area ranking, risks fake pins |
| Personal identity | High: Mann stands on the stage beside his work | Medium | Low |
| Mobile feasibility | High: stage stacks, tabs stay thumb-sized | Medium: annotations crowd small screens | Low: maps on phones are fiddly |
| Performance | High: DOM/SVG/CSS, ~20 KB of new JS | High | Low–medium: map data |
| Maintenance | High: demos read data files; captures swap in | Low: every new project needs hand-drawn annotations | Medium |

**Choice: A.** It is the only direction where the animation's subject is the service result (a better page, a found
listing, an answered enquiry), and where Mann himself is part of the composition. B's best idea, dated evidence on real
captures, is kept inside A's work reel and case studies.

## 2. The idea

**MANN / IN MOTION: a creative studio the visitor can operate.** (A concept name, not a rename: the brand stays MANN
PATEL.) One repeated visual idea carries the site: **the lime line.**

- It starts as the **full stop** of the home headline "Make your next move."
- It crosses the gap into the **stage**, and routes through whatever the visitor chose: it selects the price box on a real
  page, runs from a search to a listing to a page, or carries an enquiry to a reply, a list and a reminder.
- It frames the first real detail in each project film, outlines the portrait, joins the process steps, draws under every
  page title (`ui/PageLine.astro`), fills as reading progress in the header, redraws on every page change, and ends at
  the footer's "Tell me what isn't working."
- On ivory it becomes **ink**: lime never sits on ivory as text or hairline (1.1:1).

No other decoration. No gradient orbs, icon grids, AI-brain art, logo walls or floating badges.

## Colour

**(proposed, implemented)** Two surfaces and one accent. Token names are kept from "Signal" (`--bg`, `--text`, `--signal`…)
so every page adopts the new values; the raw dark values (`--ink-*`) and `--lime` are never remapped.

**Ivory remap.** `.paper` and every `.section--alt` band turn ivory by redefining the role tokens locally
(`src/styles/global.css` → "Ivory editorial surfaces"). There, `--signal` becomes ink and `--on-signal` ivory, so lime marks,
the line, selected states and the primary button all turn ink automatically. `.ink` sets a dark stage back inside an ivory
section (the work reel's film surface). A lime fill that must stay lime on ivory uses `--lime` (the portrait contact sheet).

Contrast checks (WCAG 2.2, computed): ivory on ink 16.7:1 · `--text-2` on ink 9.8:1 · `--text-3` on ink 6.1:1, on
surface-2 4.8:1 · ink on lime 15.1:1 · `--paper-text-3` on ivory 5.9:1 · `--accent-on-light` on ivory 6.0:1 · control
borders ≥ 3:1 on their surfaces · lime on ivory 1.1:1 (never used).

| Token | Value | Role and contrast |
| --- | --- | --- |
| `--ink` | `#10110f` | the stage and ink text on ivory |
| `--ink-2` | `#171815` | a quieter dark band |
| `--ink-surface` | `#1d1e1a` | panels on the stage |
| `--ink-surface-2` | `#262722` | raised controls, chips |
| `--ink-line` | `#30322b` | hairlines on dark |
| `--ink-control` | `#7a7c71` | control borders on dark: 4.46:1 on ink, 3.95:1 on surface |
| `--ink-text` | `#f3f1e8` | ivory text: 16.7:1 on ink |
| `--ink-text-2` | `#bdbbb0` | secondary text: 9.8:1 |
| `--ink-text-3` | `#94928a` | metadata: 6.1:1 on ink, 4.8:1 on surface-2 |
| `--bg` | `var(--ink)` |  |
| `--bg-2` | `var(--ink-2)` |  |
| `--surface` | `var(--ink-surface)` |  |
| `--surface-2` | `var(--ink-surface-2)` |  |
| `--line` | `var(--ink-line)` |  |
| `--control` | `var(--ink-control)` |  |
| `--text` | `var(--ink-text)` |  |
| `--text-2` | `var(--ink-text-2)` |  |
| `--text-3` | `var(--ink-text-3)` |  |
| `--lime` | `#c9f64a` | the raw acid lime, never remapped (for a lime fill that must stay lime on ivory) |
| `--signal` | `var(--lime)` | the line, the selected state, the primary action. 15.1:1 with ink. Ink on ivory (.paper). |
| `--lime-strong` | `#daff6e` | lime hover |
| `--signal-strong` | `var(--lime-strong)` |  |
| `--on-signal` | `var(--ink)` |  |
| `--signal-wash` | `rgb(201 246 74 / 0.12)` |  |
| `--error` | `#ff6b57` | 6.8:1 on ink |
| `--error-wash` | `rgb(255 107 87 / 0.1)` |  |
| `--warn` | `#f5c451` |  |
| `--warn-wash` | `rgb(245 196 81 / 0.1)` |  |
| `--focus` | `var(--signal)` |  |
| `--paper` | `#f3f1e8` | warm ivory |
| `--paper-section` | `var(--paper)` |  |
| `--paper-2` | `#e8e5d8` | a card or band on ivory |
| `--paper-text` | `var(--ink)` | 16.7:1 |
| `--paper-text-2` | `#45463f` | 8.4:1 |
| `--paper-text-3` | `#5c5d55` | 5.9:1 on ivory, 5.3:1 on paper-2 |
| `--paper-line` | `#d3d0c3` | hairlines on ivory (decorative) |
| `--paper-control` | `#807e74` | control borders on ivory: 3.3:1 |
| `--focus-on-light` | `var(--ink)` |  |
| `--accent-on-light` | `#4e6200` |  |
| `--error-on-light` | `#b42318` | 5.8:1 on ivory |
| `--media-bg-1` | `color-mix(in oklab, var(--paper) 78%, var(--surface))` |  |
| `--media-bg-2` | `color-mix(in oklab, var(--paper) 64%, var(--surface))` |  |
| `--graph-mesh` | `#3a3c33` |  |
| `--graph-spoke` | `#5d6040` |  |
| `--graph-ring` | `#4a4c3c` |  |
| `--graph-node` | `#8f9a52` |  |
| `--graph-pill-line` | `#3e4036` |  |
| `--frame-*` | `screen #ffffff` · `bar #e9e8e2` · `dot #c4c3bb` · `url #5b5b55` · `bezel #1a1b18` | Browser and phone frames around real captures |

## Typography

| Role | Family | Use | Token |
|---|---|---|---|
| Display **(proposed)** | **Mann Display**: Mona Sans (GitHub, SIL OFL 1.1) pinned to its Expanded width (wdth 125), weight 500–800 variable, subset; renamed because "Mona" is a Reserved Font Name. 22.5 KB woff2. | H1, H2, scene words, project names, menu links, step titles | `--font-display`, weight `--w-display` (720) |
| Text **(extracted)** | Geist (subset) | Body, UI, buttons, forms, H3 | `--font-sans`, weights 400 / 500 / 600 |
| Labels **(extracted)** | Geist Mono (subset) | Eyebrows, spec labels (A · Problem …), prices, times, demo notes | `--font-mono`, weight 500 |

Scale (fluid 360 → 1440 px): `--fs-display` 48→152 · `--fs-hero` 44→128 · `--fs-h1` 40→88 · `--fs-h2` 32→68 · `--fs-h3`
22→30 · `--fs-lead` 18→22 · `--fs-base` 17→18 · `--fs-ui` 16 · `--fs-sm` 15 · `--fs-label` 13 (the floor for visible
text). Tracking: display −0.03em (never touching), headings −0.022em, labels +0.08em uppercase. Long, descriptive titles
(a service and a place) use `PageHead compact` (40→80 px, 18ch). The About title is an editorial deck: the name at
`--fs-h1`, the role line a step down.

Rules: headings are part of the artwork; reading text never moves. A heading's only lime mark is its full stop
(`<span class="stop">.</span>`), the origin of the line. Second halves step back to `--text-3` (`.accent`).

## Layout and responsive compositions

- Container 96rem, gutter 16→56 px, sections `--section` 64→176 px, tight `--section-tight` 40→96 px.
- **Home hero, ≥ 1024 px:** two columns (copy | stage), full viewport height minus header; the connector runs from the
  headline's full stop across the gap into the stage at the same height. **< 1024 px:** copy first (kicker, H1, service
  line, CTA, prices), then the need selector and the stage (aspect 5:4 from 640 px, 1:1.08 below); no connector, the line
  lives inside the stage.
- **Work reel, ≥ 1024 px:** a sticky project list beside one large film surface. **Phones/no JS:** each project is a card
  with its own film, spec and links, in reading order.
- **Playground:** copy | demo rows alternating sides on desktop; stacked on phones; the journey's steps become a 2×2 grid.
- Scenes alternate tone: A dark · B ivory · C dark · D ivory · E dark · footer dark.
- Inner pages: a dark opening (eyebrow, display title, the page line, lead, actions), then their sections; `.section--alt`
  bands and reading bodies (case-study text, guides, legal, contact form, work index, guides index) are ivory.
- Phones are designed separately: portrait crops (stage 1:1.08, phone captures in bezels), thumb-height tabs (≥ 44 px),
  a single Menu button, and the one floating control inside the safe area.

## Components

| Component | File | Notes |
|---|---|---|
| Button | `ui/Button.astro` + `.btn` | Instrument block: 4 px radius, label left, an arrow cell right. Primary lime (ink on ivory), ghost (outline that fills from the left), ink, small. Press feedback 140 ms; the arrow travels out and its copy travels in on hover/focus. |
| Need selector | `home/Stage.astro` | A real tablist of three; selected = lime fill + ink text in the same frame. ←/→/Home/End. |
| Stage | `home/Stage.astro`, `scripts/stage.ts` | Screen with a faint grid, the real cut-out portrait in front, one scene per need, one measured SVG path for the line, a caption panel with two links and Replay. |
| Work reel | `home/WorkReel.astro` | Tablist of projects (desktop), film surface made of real captures, spec list A–D, "Read the case study". |
| Demos | `demos/BeforeAfter.astro`, `demos/Journey.astro`, flow in `home/Playground.astro`; `scripts/playground.ts` | Local only, labelled, with Replay/Pause, keyboard and touch. Reused on service pages. |
| Page line | `ui/PageLine.astro` | Under every page title. |
| Header | `Header.astro` | Wordmark, live line (Toronto time, "Taking new projects"), nav with a lime underline on the current page, ⌘K quick menu, one CTA, Menu (phones) → full-screen numbered menu with contact routes and the Motion switch. |
| Control dock | `ControlDock.astro` | The only floating control: Back to top with a reading ring, after 1.5 screens. |
| Motion switch | `.switch` (menu, footer) | `aria-pressed`; persists in localStorage (`mp-motion`); starts from the OS setting. |
| Footer | `Footer.astro` | Final frame: display-size closing line, the line ending in a dot, two CTAs, direct contact, columns, the wordmark full width, Motion switch, legal, Back to top. |
| Short brief | `home/ProcessBrief.astro` | Needs + optional website → `/contact/?services=…&website=…#brief` (a hand-off, not a second form). |
| Kept, restyled by tokens | ContactForm, CheckForm, Faq, Status, MediaFrame, ProjectMedia, QuickMenu, ContactActions, SocialLinks, Legal, PackageCard/Compare, EnquiryDemo, MissedCallCalculator | Behaviour unchanged. |

Focus: 2 px ring, 3 px offset, lime on dark, ink on ivory. Hit areas ≥ 44 px for controls and standalone links.

## Homepage storyboard

About 320 words of main copy (excluding nav, forms, labels and prices).

| Scene | Tone | What happens | Next action |
|---|---|---|---|
| **A · Stage** | dark | "MANN PATEL · TORONTO". H1 "Make your next move." + "Websites, local SEO and AI automation for Toronto businesses." (one H1, so the service and place stay in it). Free-check CTA, "Explore my work", prices. The stage: "What do you need?" → Upgrade my website / Help me get found / Automate my admin. Website scene = the real Nest & Rest page with the price box selected; found = an illustrated search → listing → page; admin = an enquiry → instant reply → list → reminder. | Free check · case study · the matching demo |
| **B · Work reel** | ivory | "Website projects in Scarborough." Two projects, honestly labelled (own business / client in progress), each a short film of its real dated captures, spec A–D. | Read the case study · visit |
| **C · Playground** | dark | "See it working before you ask." Real before/after of Mann's own site (31 Oct → 8 Nov 2026); a search journey (labelled illustration); a sample enquiry flow (runs locally, nothing sent). | Service page · start a brief |
| **D · Person** | ivory | "Hi, I'm Mann." Tall portrait whose crop drifts on scroll, the line framing it, a contact sheet of the same real photos, three facts from About. | More about me |
| **E · Process & brief** | dark | "Four steps, all in writing." Steps joined by the line, published prices, a short brief hand-off, direct contact. | Continue to the brief |
| Footer | dark | "Tell me what isn't working." | Start a project · free check · email/call/WhatsApp/text |

## Inner pages

| Page type | Routes | Opening and treatment |
|---|---|---|
| Work index | `/work/` | Dark opening + page line; ivory project list with real captures and honest labels. |
| Case study | `/work/*/` | Status + kind, display title, page line, real capture hero; ivory reading body; dated test evidence; captures. |
| Services index | `/services/` | Dark opening; three named paths; ivory prices band; free-check band; FAQ. |
| Service detail | `/services/*/` | Compact display title + page line; fit list; **a working demo** (before/after on web design and redesign, search journey on local visibility and AI search, the sample workflow on enquiry follow-up); ivory process band; proof; offer; FAQ. |
| Pricing | `/pricing/` | Packages, comparison, ivory example band. |
| About | `/about/` | Editorial deck title + portrait, ivory principles band, story. |
| Contact | `/contact/`, `/contact/received/` | Dark opening; the form on calm ivory; success page with the page line, shown only after the server accepts. |
| Guides | `/guides/`, `/guides/*/` | Ivory index; ivory reading body with comfortable measure. |
| Areas / industries | `/web-design-*/`, `/websites-for-*/` | Compact title + page line; ivory neighbourhood/package bands. |
| Legal | `/privacy/`, `/terms/` | Ivory reading body, section list on desktop. |
| Vision, free-check landing | `/vision/`, `/free-check/` | Dark openings with the page line; ivory bands. |
| 404 | any unknown path | "Nothing to connect to here." The line wanders off-frame to an empty dot; five real destinations. |

## Imagery and media

- **Real work only.** Project media are the dated captures in `src/data/captures.ts` (asset manifest:
  [`docs/redesign/ASSETS.md`](docs/redesign/ASSETS.md)). Illustrations are drawn in HTML/SVG and say so ("Illustration,
  not a real search result", "Demo: nothing is sent").
- **Mann's likeness:** the real portrait and its cut-out only; never generated, never altered beyond crop.
- No stock footage, no generated people, no generated lettering. Exact text stays in HTML/SVG.
- Images go through `astro:assets` (AVIF + WebP fallback, widths up to 2× display, intrinsic sizes reserved).

## What changed from "Signal"

Removed: the agent-graph hero, the WebGL signal field, text decoding, the signal-portrait canvas, pill buttons, the
one-tone dark page. Added: Mann Display, the ivory editorial surface and remap, the lime line grammar, the operable stage,
the work films, the playground and service-page demos, the page line, the Motion switch, the control dock and the
final-frame footer. Kept: every route, URL, form, endpoint, structured data, copy rule, price, honesty label and test
discipline.
