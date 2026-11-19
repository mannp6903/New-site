# Research: references for the "MANN / IN MOTION" redesign

Prepared 19 Nov 2026 for mannpatel.me. The research ran for the immersive redesign described in
[`DESIGN.md`](DESIGN.md) and [`MOTION.md`](MOTION.md).

## How the evidence was gathered (and its limits)

- **Network:** this build environment blocks direct browsing of the reference sites (each host returned no
  connection when fetched straight). Evidence came through Firecrawl's rendered fetch, which returns page
  text plus one 1920 × 1080 screenshot after a wait (4–8 s), and one emulated phone capture.
- **What a screenshot proves:** layout and typography at one moment. It cannot prove animation timing,
  scroll behaviour or transitions. A text scrape proves content and link structure, not layout.
- **What could not render:** Bruno Simon (WebGL/WebGPU world, black in a GPU-less capture) and Active Theory
  (served an "unsupported browser" page to the capture agent). For both, first-party text and a creator
  interview are used instead. Igloo Inc is treated as a historical reference (Awwwards record, July 2024).
- **Mobbin** (mobile pattern library) needed a paid plan, and Exa search was out of credits, so they were not used.
- **mannpatel.me itself** was inspected from its source repository and a local production build
  (`npm run build`, Node adapter), captured at 1440 and 390 px. That build is the baseline.

Legend: **O** = observed in the capture or text on the date given · **I** = inference (not proven).

## Reference matrix

| # | Reference (date, evidence) | Entry experience | Typography | Motion | Navigation | Mobile | Conversion path | Transferable principle | Inappropriate for Mann's audience |
|---|---|---|---|---|---|---|---|---|---|
| 1 | [Lusion](https://lusion.co/) · 19 Nov 2026 · text + desktop screenshot (cache 17 Nov) | O: framed 3D render fills a rounded panel inside a light page; headline sits above, mid-reveal in the capture. | O: neutral grotesk; headline words spaced as separate tokens (word-by-word reveal markup). | I: word reveals, play-reel cursor, letter-by-letter "PlayReel" (duplicated letters in markup = roll effect). | O: Home / About / Projects plus a persistent "Let's talk". | not captured | O: "Let's talk" in header, two emails in footer. | **One coherent visual idea in a contained frame**, not effects scattered across the page. | A 3D render with no service meaning; a reel as the main proof. Mann sells outcomes to local owners, not spectacle. |
| 2 | [Bruno Simon](https://bruno-simon.com/) · 19 Nov 2026 · text only (WebGL did not render) | O (text): "Please drive around to learn more"; options for audio, quality, renderer, respawn. | O: Amatic SC + Nunito (stated on the site). | I: real-time physics world. | O: map, home, settings and a controls sheet per input (mouse/keyboard, touch, gamepad). | O: separate touch controls documented ("One finger moves the car"). | O: Discord links; no form. | **Every input method gets explicit controls, and settings (audio off, quality) are visible.** | A game as the gate to information. Owners must reach services and contact in one tap. Do not copy the driving concept. |
| 3 | [Dennis Snellenberg](https://dennissnellenberg.com/) · 19 Nov 2026 · text + desktop + phone screenshots | O: full-bleed portrait on flat grey; oversized surname runs off both edges behind/through him; role "Freelance Designer & Developer" at right. | O: one neo-grotesk at two extremes: huge (name) and small (role, nav). | I: name marquee; magnetic buttons (common on his site; not proven here). | O: Work / About / Contact + "Menu"; on phone just "© Code by Dennis" + Menu. | O: phone keeps the portrait and the running name, role at the bottom; no clutter. | O: "Let's work together", email and phone in the footer; local time shown. | **The person is the brand: real face + huge name + plain role, and a direct hire path.** | An endless name marquee as the only headline (no service words for search). |
| 4 | [basement.studio](https://basement.studio/) · 19 Nov 2026 · text + desktop screenshot | O: a lit 3D room (their studio) behind the H1; "Human / Machine" toggle at the bottom. | O: compact grotesk UI, all-caps micro labels, counters in nav ("Showcase (26)"). | I: 3D camera moves; marquee of client logos. | O: Services, Showcase, People, Blog, Lab; "Online", "Press [/] to chat", Contact Us. | not captured | O: Contact Us in nav, capability blocks each link to filtered showcase. | **Personality carried by a consistent voice and micro-UI (counters, status), while capabilities link to proof.** | Profanity-led tone and a 40-logo wall; Mann has two projects and no client logos, so a logo wall would be fake. |
| 5 | [Obys](https://obys.agency/) · 19 Nov 2026 · text + desktop screenshot | O: the capture shows a loader (black screen, "50" counter) after 4 s. | O (text): serif/sans editorial, numbered projects (01…19). | I: long loader then list animations. | O: Work, About, Contact, local time; project view switch **Vertical, Horizontal, Grid**. | not captured | O: one email. | **Let visitors choose how to browse visual work** (view modes). | A loading counter that blocks entry, and view modes for 2 projects. Mann's work grid gets one strong preview mode instead. |
| 6 | [Aristide Benoist](https://aristidebenoist.com/) · 19 Nov 2026 · text + desktop screenshot | O: a horizontal **filmstrip of narrow vertical project slices** centred on a dark page; minimal corners (name, About, availability). | O: condensed caps display for the name; tiny mono-like caps for metadata ("COMPLETED / TYPE / ROLE / CLIENT", lettered A–D). | I: slices expand into a project; letter-by-letter titles (markup splits every letter). | O: Projects, About, Close; "Independent developer · available Dec. 2026" as the hire link. | not captured (site claims 22 Awwwards Mobile Excellence) | O: availability line is a mailto. | **Structured project metadata (role, type, date) presented as part of the art**, and availability stated plainly. | Letter-split headings with no readable text fallback (the scrape shows one letter per line). |
| 7 | [Active Theory](https://activetheory.net/) · interview [Communication Arts, Feb 2024](https://www.commarts.com/webpicks/active-theory-2) · live site not renderable | (from interview) WebGL scene with coloured tubes that spawn from pointer/touch, shared live between visitors. | not observed | O (interview): pill navigation "that reacts with scroll velocity". | O (interview): "something simple — a link to our work and how to contact us." | not observed | O (interview): AI chat suggests projects ("Show me a fun project"). | **Keep essential navigation to two obvious destinations even when the page is experimental.** | An AI chatbot without a scoped backend or truthful knowledge source; networked visitor cursors. |
| 8 | [Igloo Inc](https://www.igloo.inc/) · historical: [Awwwards SOTD 23 Jul 2024](https://www.awwwards.com/sites/igloo-inc) (credits abeto, Bureaux) | O (record): 3D, animation, transitions, infinite scroll; two-colour palette #b6bac5 / #383e4e. | not observed | O (record): Dev Award animations 9.6/10 but accessibility 6.6 and semantics 6.6. | not observed | not observed | not observed | **One visual world gives continuity between sections.** The scores also show the cost: spectacular motion, weak semantics/accessibility. | Infinite scroll and a crypto 3D world; the low accessibility score is exactly what Mann's site must not trade away. |
| 9 | [Locomotive](https://locomotive.ca/en) (Montréal) · 19 Nov 2026 · text + desktop screenshot | O: capture caught a text-scramble loader ("I optlzs"); text shows emoji-studded H1. | O: large grotesk, playful emoji punctuation. | I: smooth scroll (they make Locomotive Scroll); text scramble. | O: Work, Agency, Careers, Store + **"Let's talk" always visible**; FR/EN switch. | I: known for mobile craft; not captured. | O: "Let's talk" + phone + email + street address in footer; cookie consent before tracking. | **A Canadian service business that keeps "Let's talk", phone and email on every screen.** | Scroll-jacking smooth scroll; text scramble on every entry. |
| 10 | mannpatel.me (baseline) · source + local build, 19 Nov 2026 | O: dark page, "Websites and local SEO for Toronto small businesses." H1, agent-graph portrait right, free-check CTA, prices line. | O: Geist + Geist Mono; lime accent #d4f84a; two-tone headings. | O: graph pulses (3 loops then rest), label roll, magnetic buttons, view transitions. | O: Work, Services, Pricing, Guides, About + ⌘K quick menu + Contact. | O: phone hero stacks headline, CTA, prices, then graph. | O: free check, 3-step brief, phone/WhatsApp/text, email. | Strong honesty rules, real prices, real proof labels, working form. Keep all of it. | The graph reads as a generic "AI agency" diagram; one dark tone throughout; little visible craft in the work itself. |

## Mobile and conversion examples (the brief asked for at least two)

- **Dennis Snellenberg (phone capture, O):** the phone version is designed, not shrunk: the portrait stays, the
  name keeps running, nav collapses to a single "Menu", and the role sits at the bottom where the thumb is.
- **Locomotive (O):** a Canadian service business whose header keeps "Let's talk" and whose footer carries phone,
  email and address. The direct-contact pattern Mann's audience expects.
- **Mann's current site (O):** already strong on conversion (free check, short brief, call/WhatsApp/text). The redesign
  keeps that pipeline untouched and gives it a better stage.

## Synthesis: principles → concrete decisions

| Principle (source) | Decision on mannpatel.me |
|---|---|
| One coherent visual idea in a frame (Lusion, Igloo) | One motif everywhere: **the lime line**. It starts as the full stop of the headline, frames the active demo on the stage, connects process steps and ends at the footer CTA. No unrelated effects. |
| The person is the brand (Snellenberg) | Mann's real cut-out portrait stands **inside** the hero stage, beside his work, with name and role in plain text. The About scene gives the portrait an editorial, slowly shifting crop. |
| Explicit controls for every input (Bruno Simon) | The need selector is a real tablist (click, tap, arrow keys). Motion has a visible On/Off switch that persists, starting from the OS setting. Every demo has Replay and a static text explanation. |
| Visitor chooses how to browse (Obys) | Visitors choose a **need** (website / get found / automate), and the stage, the playground and the brief all follow that choice. One preview mode for work, since there are two projects. |
| Metadata as art (Aristide Benoist) | Project rows show role, relationship (own business / client), status and date in mono labels, lettered like a spec sheet. These are the same honest labels the case studies already use. |
| Filmstrip into a case study (Aristide Benoist) | The work scene is a large preview surface: selecting a project plays a short authored film made from its **real dated captures** (pan, crop into the real details), then links to the case study. |
| Two obvious destinations (Active Theory, Locomotive) | Header keeps Work, Services, Pricing, Guides, About and one CTA. "Free check" and email are reachable from every page (header CTA, footer, menu). |
| Personality through micro-UI (basement) | Mono micro-labels with live state ("Taking new projects", Toronto time, scene counters "01/03"), used sparingly. |
| Spectacle has a cost (Igloo's 6.6 accessibility) | DOM/SVG/CSS only, no WebGL. All content stays in the DOM. Reduced-motion and no-JS versions are designed, not degraded. |

## What we are explicitly not doing

- No loaders or intro films before content (Obys, Locomotive).
- No game, 3D world or networked cursors (Bruno Simon, Active Theory).
- No AI chatbot: there is no scoped backend or truthful knowledge source to justify one.
- No logo wall, testimonials or numbers that don't exist (basement).
- No claim that these visual techniques increase leads. That stays a hypothesis until measured on real traffic.
