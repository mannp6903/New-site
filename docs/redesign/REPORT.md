# Redesign report: "MANN / IN MOTION"

Prepared 19 Nov 2026. The redesign of mannpatel.me as specified in the master prompt: research, three directions,
implementation of every public route, media, and QA. Not deployed: production is unchanged until Mann says to deploy.

| Document | What it holds |
|---|---|
| [`RESEARCH.md`](../../RESEARCH.md) | Reference matrix (9 references + the baseline), evidence limits, synthesis into decisions |
| [`DESIGN.md`](../../DESIGN.md) | Three directions and the choice, tokens, type, layout, components, homepage storyboard, inner pages |
| [`MOTION.md`](../../MOTION.md) | Preference model, tokens, per-element motion spec, lifecycle, testing |
| [`ASSETS.md`](ASSETS.md) | Asset manifest: source, licence, sizes, formats, loading, alt text, regeneration |
| [`MAINTENANCE.md`](MAINTENANCE.md) | Changing copy, projects, images, video and motion; checks; rollback |
| [`previews/`](previews/) | Desktop and phone captures of the finished pages |

## Where it lives, and how to open it

- **Repository:** `mannp6903/New-site`, branch `ccr-50f74c22-883lji`. Commit `bb8dc78` is an untouched import of the live
  site (Mann-Patel-Personal-Profile-Website @ `9c7c1f4`); everything after it is the redesign.
- **Local preview:**

  ```bash
  npm ci && cp .env.example .env
  npm run build && npm run preview      # http://localhost:4321 (the form saves enquiries to .data/enquiries.jsonl)
  ```

- **Hosted preview (private to Mann):** https://claude.ai/artifact/VeeFLYy2eggXCLLHQyps1R — every page, the demos and
  the motion. Built with `node scripts/export-static-preview.mjs preview-artifact --artifact`; the enquiry form shows its
  "not connected" notice there, because a static preview has no server.
- **The live repository was not changed** and nothing was deployed.

## What was built (the strongest decisions)

1. **One motif, the lime line.** It starts as the full stop of "Make your next move.", crosses into the stage at the
   same height (measured from the real elements), routes through the chosen demo, frames the first real detail of each
   project film, draws under every page title, fills as reading progress and redraws in the header on every page change,
   and ends in the footer. On ivory it turns ink. No unrelated effects.
2. **A studio the visitor operates.** Three needs ("Upgrade my website / Help me get found / Automate my admin") are a
   real tablist; each plays a short demo on the stage, with Mann's real cut-out portrait standing in front of his work.
   The choice follows the visitor down the page (the playground marks it, the short brief pre-ticks it).
3. **Evidence that moves, and stays honest.** Project films are built only from dated captures; the before/after is
   Mann's own site one week apart; the search journey and the enquiry flow say "Illustration" and "Demo: nothing is sent".
4. **Rhythm.** Dark immersive scenes alternate with ivory editorial bands on every route; reading bodies (case studies,
   guides, legal, contact form) are ivory.
5. **Nothing lost.** Every route, URL, form path, endpoint, structured data block, price, honesty label and test
   discipline from the live site is kept. The enquiry pipeline is unchanged; the home brief hands off to it.
6. **Motion you control.** A Motion switch (menu, footer) persists and starts from the OS setting; reduced motion and
   no-JavaScript are designed states.

## Route completion

All 39 public outputs build and were rendered at 320, 360, 390, 768, 1440 and 1920 px (228 page-views): no sideways
scrolling, no console errors, exactly one H1 on each page.

| Route | Type | Opening / treatment | Functional checks |
|---|---|---|---|
| `/` | Home | Stage (3 needs), work reel, playground, person, process + prices + brief, footer | Tabs (pointer, keys), line geometry, demos, brief hand-off |
| `/work/` | Work index | Page line; studio reel player; ivory project list | Reel loads only on play |
| `/work/nest-and-rest-cleaning/`, `/work/samp-hair-spa/` | Case studies | Status + kind, page line, capture hero, ivory body | Dated evidence, folding, links |
| `/services/` | Services index | Page line; three paths; ivory prices band; free-check band; FAQ | Finder, anchors, FAQ data |
| `/services/web-design/`, `/services/website-redesign/` | Service detail | Compact title + page line; **before/after demo** | Demo keyboard/drag |
| `/services/local-visibility/`, `/services/ai-search-optimization/` | Service detail | **Search journey demo** | Steps, Play/Pause |
| `/services/enquiry-follow-up/` | Service detail | Existing sample workflow demo, missed-call calculator | As before |
| `/services/website-care/` | Service detail | Page line, ivory process band | As before |
| `/pricing/` | Pricing | Page line, packages, ivory example band | Prices agree everywhere |
| `/about/` | About | Editorial deck title, portrait, page line, ivory principles | Portrait order on phones |
| `/contact/` | Contact | Page line; form on calm ivory | Every form path incl. no-JS, errors, de-duplication, email fallback |
| `/contact/received/` | Success | Page line; shown only after the server accepts | — |
| `/free-check/` | Campaign landing (noindex) | Page line | Form, noindex, unlinked |
| `/guides/` + 9 guides | Resources | Ivory index and reading bodies | BlogPosting data |
| `/web-design-*` (6) | Area pages | Compact title + page line; ivory neighbourhood band | Drafts marked in previews only |
| `/websites-for-cleaning-companies/`, `/websites-for-salons-and-spas/` | Industry | Compact title + page line | Case study first |
| `/vision/` | Vision | Page line; ivory bands | — |
| `/privacy/`, `/terms/` | Legal | Ivory reading body | Linked from footer, menu, form |
| any unknown URL | 404 | "Nothing to connect to here." line wanders off; five real destinations | Real 404 status |
| `/api/enquiry` | Endpoint | unchanged | Honeypot, time token, delivery modes |

## Analytics event plan

Analytics stay off until `PUBLIC_GA4_ID` is set and the visitor allows counting (unchanged). Events carry ids and
choices only, never form text, emails or URLs a visitor typed (tested).

| Brief's name | Event sent | When | Notes |
|---|---|---|---|
| `service_demo_start` | `service_demo_start` | A need chosen on the stage; the first use of each playground demo (once per demo per page) | `demo`, `location` (hero, hero_replay, playground) |
| `project_open` | `project_open` | "Read the case study" in the home work reel | `project`, `location`; other project links keep the existing `select_content` |
| `brief_start` | `brief_start` | The home short brief is sent on to /contact/, or a playground "Start a … brief" link | `need` (the chosen areas only) |
| `lead_submit_success` | `generate_lead` (kept) | Once, only after the server accepts a brief or free check (de-duplicated per lead id) | GA4's recommended name, kept so existing reports continue |
| `booking_handoff` | `booking_click` (kept) | A "Book a free 15-minute call" link | Appears once a booking link is set in `src/data/site.ts` |
| (new) | `reel_play` | The studio reel starts | `location` |

## QA results

Measured 19 Nov 2026 on the final build (commit after `a8dae70`), Chromium 1243 via Playwright 1.63 (headless), local
Node preview server. Lab numbers, not field data.

### Tests

| Check | Result |
|---|---|
| Types (`astro check`) | 0 errors, 0 warnings |
| Unit tests (Vitest, including the design-token gates) | **177 / 177 passed** |
| Browser tests (Playwright: `site`, `redesign`, `design-gates`) | **260 / 260 passed** (13.0 min) |
| Accessibility (axe-core, every built page, Motion on and off, in the browser suite) | 0 violations |
| Visual matrix (39 routes × 320, 360, 390, 768, 1440, 1920 px) | no sideways scrolling, no console errors, one H1 per page |
| Forced colours, 200% text, keyboard-only, no JavaScript, reduced motion | covered by the design gates; all pass |
| Gate M7 (4× CPU slowdown: no frame with the site's scripts over 50 ms from first paint to 3 s) | passes (3 / 3 repeats, then in the full run) |

### Lighthouse 12.8 (mobile, simulated throttling)

| Page | Performance | Accessibility | Best practices | LCP | CLS | TBT | Old site (performance / LCP) |
|---|---|---|---|---|---|---|---|
| `/` | 94 | 100 | 100 | 2.7 s | 0 | 0 ms | 94 / 2.7 s |
| `/work/` | 94 | 100 | 100 | 2.9 s | 0 | 30 ms | 98 / 2.1 s |
| `/services/web-design/` | 96 | 100 | 100 | 2.6 s | 0 | 0 ms | 96 / 2.2 s |
| `/contact/` | 96 | 100 | 100 | 2.4 s | 0 | 20 ms | 96 / 2.3 s |

SEO reads 63–66 on both the old and the new site in this run: preview builds carry `noindex, nofollow` on purpose
(so previews never reach Google), which fails the "is crawlable" audit. The production build (`npm run build:cloudflare`)
removes it.

### Page weight, DOM and loading (first view, no interaction)

Transfer from the local server, which does not compress (Cloudflare serves HTML with Brotli, so production is lighter).

| Page | Phone KB (old → new) | Desktop KB (old → new) | DOM elements (old → new) | Local LCP | CLS |
|---|---|---|---|---|---|
| `/` | 299 → 360 | 340 → 398 | 922 → 1,019 | 140 ms (the line under the H1 on phones, the portrait on desktop) | 0 |
| `/work/` | 195 → 320 | 219 → 345 | 426 → 435 | 116 ms | 0 |
| `/services/` | 200 → 221 | 200 → 221 | 612 → 599 | 68 ms | 0 |
| `/services/web-design/` | 233 → 295 | 233 → 333 | 1,005 → 1,023 | 80 ms | 0 |
| `/about/` | 196 → 217 | 199 → 220 | 632 → 619 | 104 ms | 0 |
| `/contact/` | 235 → 255 | 235 → 255 | 713 → 699 | 68 ms | 0 |
| `/work/nest-and-rest-cleaning/` | 231 → 252 | 257 → 278 | 618 → 605 | 96 ms | 0 |

Where the extra weight comes from: the display face (22 KB, on every page), the before/after demo images on service
pages, the work films' captures and the studio reel poster on `/work/` (the reel itself, 1.7 MB, loads only on Play).
JavaScript stays at 19–49 KB per page, as before.

### Home length

14.0 phone screens at 390 × 844 (old site: 10.9). See decision 1 below.

### Fixes made during QA (this round)

- Load performance: start-up scripts no longer read layout or restyle the page (the stage line is drawn after layout,
  the work reel and Back to top are in their final state from the first paint), the hidden stage scenes no longer
  animate, line drawings repaint in their own layer, and the playground starts when it comes near. MOTION.md →
  Performance.
- Forced colours: every button keeps a visible edge; the menu icon lines stay visible.
- Layout: the person scene's portrait and copy are balanced on wide screens; heading-to-intro spacing matches every other
  section; real work starts right after the first screen at 1440 × 900.

## Decisions for Mann

1. **Home length on phones.** 14.0 phone screens (390 × 844), against the 11 you chose on 17 Nov (D9). The brief's
   playground and work films are the difference. To bring it back towards 11 without losing the idea: show only the
   demo matching the chosen need on phones (about −2 screens), or drop the person scene from Home (it is on About; −1.3).
2. **Your photo now appears twice on Home:** the cut-out on the stage and the portrait scene (Scene D of the brief). On
   14 Nov you chose "photo and intro once, in the hero"; this redesign follows the newer brief. Removing `<Person />`
   from `src/pages/index.astro` restores the old rule (one line).
3. **The free check keeps one name** from hero to form: "Get a free website and Google check" (the brief's "&" was
   replaced with "and" to match the form, as your earlier tests require).
4. **Deploying.** This branch lives in `New-site`. To go live, either merge it into the live repository (the Cloudflare
   project builds from there) or point the Cloudflare project at `New-site`. Run `npm run build:cloudflare` (pre-launch
   check) first. Nothing has been deployed.
5. **Optional media you could supply:** a short recorded introduction (would be captioned) and a real client review once
   you have one; the reel can be re-recorded after any content change (`scripts/redesign/`).

## Limitations (honest list)

- **Browsers:** tested in Chromium only (Playwright 1.63, headless). Firefox and WebKit/Safari engines are not installed
  in this environment and were not tested; cross-document view transitions degrade to normal navigation where
  unsupported. No physical devices were used: phone results are emulation.
- **Reference research** used rendered fetches (direct browsing was blocked); motion on reference sites was inferred,
  not observed (RESEARCH.md says which).
- **Performance** numbers are lab measurements on a local server, not field Core Web Vitals.
- **Mobbin and Exa** were unavailable (paid plan / credits); image generation was deliberately not used (exact vector
  is better for the motif, and the brief forbids generated likenesses).
