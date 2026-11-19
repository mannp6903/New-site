# MOTION: "MANN / IN MOTION"

How everything on mannpatel.me moves, why, and what happens when it shouldn't. Tokens live in
`src/styles/tokens.css`; the design system is [`DESIGN.md`](DESIGN.md). The values below are the implemented ones
(19 Nov 2026). They started from the brief's proposed ranges and were tuned on the rendered pages.

## Principles

1. **One subject.** What moves is the service result: a page getting better, a search reaching a listing, an enquiry
   getting answered. The lime line carries every sequence. No decorative float, tilt, scramble or bounce.
2. **Contrast in pacing.** One immersive moment per scene, then stillness. Demos play **once** (under 4 s for stage
   scenes, ≤ 15 s for a full playground demo) and hold. Nothing loops forever; nothing starts by itself for longer
   than 5 s without a pause control.
3. **Never block.** Every control works mid-animation. A second click restarts cleanly. Content and actions are in the
   DOM from the first frame; animations only move them into place (no content starts at opacity 0 in the first screen).
4. **Transform and opacity** (plus SVG `stroke-dashoffset` for the line). Layout is never animated, except the
   before/after split (`clip-path`, driven by the visitor) and the search typing (`clip-path`, once).
5. **Reduced motion is a designed state,** not a broken one: same content, same actions, final positions, still images.

## The preference

| Source | Effect |
|---|---|
| OS `prefers-reduced-motion: reduce` | Default when the visitor hasn't chosen on this site. |
| Site **Motion** switch (menu and footer, `aria-pressed`) | Saved in `localStorage["mp-motion"]` ("on"/"off"); wins over the OS from then on. |
| `<head>` inline script | Sets `html[data-motion="on"|"off"]` before the first paint, so there is no flash. |
| No JavaScript | No attribute: nothing hidden, nothing moves (every motion rule is scoped to `:root[data-motion='on']`). |

`src/scripts/prefs.ts` wires the switches and emits `motionchange`; scripts (`stage.ts`, `playground.ts`, the reel, the
dock) read `motionOn()` before animating. With Motion off, every `--dur-*` token is `0ms` and a global rule zeroes any
remaining animation or transition. View transitions are disabled too.

## Tokens

| Token | Value | Used for |
|---|---|---|
| `--dur-1` | 140 ms | press feedback, colour changes |
| `--dur-2` | 200 ms | small UI, chips, Back to top appearing, menu closing |
| `--dur-3` | 280 ms | menu opening, button arrow travel, project preview, label roll |
| `--dur-4` | 420 ms | stage scene elements, reveals, journey slide |
| `--dur-5` | 640 ms | headline line reveals, reel details |
| `--dur-6` | 960 ms | hero entrance, the line drawing, page line |
| `--stagger` | 28 ms | lines and lists (multiplied per step) |
| `--dur-loop` | 3600 ms | one demo cycle reference (films use 1.6×) |
| `--dur-page-out` / `--dur-page-in` | 220 / 340 ms | page transitions |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | entrances, the line |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | state changes, journey slide |
| `--ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` | exits |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | magnetic return |

Gates: `tests/unit/design-tokens.test.ts` (M1: no literal durations in CSS or script animations; M4: page transitions
≤ 450 ms and token-only).

## Element specification

| Element | Trigger | Properties | Duration / easing | Interruption | Touch / phones | Reduced motion / Motion off |
|---|---|---|---|---|---|---|
| **Hero entrance** (`Stage.astro`) | page load (CSS, no script wait) | H1 lines `translateY` out of a mask; kicker, service line, CTA, prices `translateY` 14 px; stage `translateY` + `scale` 0.98 | lines `--dur-5` with 3×stagger; stage `--dur-6`; all `--ease-out`; total ≈ 1 s | content is visible and clickable from frame one | same | final composition, no movement |
| **Connector** (full stop → stage, ≥ 1024 px) | load, each need change | SVG `stroke-dashoffset` 1 → 0 | `--dur-6` `--ease-out` | restarts on each change | not drawn (no room beside the copy) | drawn, static |
| **Need selector** | click / tap / ←→ Home End | selected state: background + colour | **same frame** (no transition on the state); hover `--dur-1` | instant; rapid clicks just switch | 44 px+ targets in a 3-column grid | identical |
| **Stage scene** | need change, Replay, load | scene parts `translateY` 14 px + opacity, staggered 6×stagger each; the line `stroke-dashoffset`; price-box select `scale` 1.12 → 1; cursor travel; search typing `clip-path` steps(22) | parts `--dur-4`; line `--dur-6` after 10×stagger; typing 1.2×`--dur-6`; whole scene < 2 s | `data-play` removed and re-added (reflow), so any click restarts from the start | same scene, no connector entry | final scene, line drawn, Replay hidden |
| **Stage depth** | pointer move (fine pointers only) | portrait and scene `translate` ±8 / ±4 px | `--dur-4` `--ease-out`, rAF-throttled | resets on pointer leave | none | none |
| **Work film** (`WorkReel.astro`) | surface ≥ 35 % in view (once), or project chosen | browser `translateY`+`scale`+opacity; capture `scale` 1.08 → 1; details and phone `translateY` 40 px + opacity; frame `stroke-dashoffset` | browser `--dur-6`; push 1.6×`--dur-loop`; details `--dur-5` at 14/24/36×stagger; frame `--dur-6` at 44×stagger ≈ 2.2 s | choosing another project restarts its film | each card plays its own film when it comes into view | final frame, all visible |
| **Before/after** | range input, buttons, drag | `--pos` → `clip-path` + handle `left` | immediate (follows input) | n/a | drag with `touch-action: pan-y` (vertical scroll still works) | identical (visitor-driven) |
| **Journey** | step buttons, Next, Play | track `translateX` | `--dur-4` `--ease-in-out`; Play advances every 2.6 s, stops at step 4 | Pause, any step button, leaving the screen, or hiding the tab stops autoplay | 2×2 step grid | instant step changes; Play still steps (visitor-started, pausable) |
| **Enquiry flow** | "Send a sample enquiry" | each step: dot fill, connector `scaleY`, row `translateX` 8 px | 700 ms apart, connector `--dur-4`, row `--dur-3` | a second click clears timers and restarts | same | all five steps complete at once; live region announces them |
| **Headings & media reveals** | scroll (CSS scroll timeline, `@supports`) | line `translateY` 108 % → 0; media `translate` 20 px + opacity | linear on `entry 5%–55%` | scroll-driven, reversible | same | visible, static |
| **The line on scroll** (process, footer, portrait frame) | scroll (CSS scroll timeline) | `stroke-dashoffset` 1 → 0 | `entry 10% – cover 45%` | reversible | process line runs down the left edge on phones | drawn, static |
| **Portrait crop drift** | scroll | image `scale` 1.16 → 1.04, `translateY` 3 % → −2 % | across the whole view | reversible | same | still crop |
| **Page line** (every page title) | load | line `scaleX` 0 → 1, dot `scale` 0 → 1 | `--dur-6` then `--dur-3` | n/a | same | drawn |
| **Page transition** | same-origin navigation (cross-document View Transitions where supported) | old page opacity + `translateY` −10 px; new page opacity + `translateY` 18 px; header line `scaleX` redraw (shared `site-line`); header holds still | 220 ms `--ease-in` / 340 ms `--ease-out` | normal navigation; history, focus and scroll restoration are the browser's | same | none (instant) |
| **Buttons** | hover / focus / press | press `translateY(1px) scale(0.985)`; arrow out, copy in (`transform`); ghost fill `scaleX` | press `--dur-1`; arrow `--dur-3` | n/a | press feedback only (no hover) | colour change only |
| **Magnetic pull** (hero CTA, footer CTA) | fine pointer near | `translate` ≤ 6 px | `--dur-4` `--ease-spring` back | n/a | none | none |
| **Menu** | Menu button | panel opacity + `translateY` −12 px; links rise staggered | open `--dur-3`, close `--dur-2` `--ease-in` | Escape, backdrop, link or close all work mid-animation | it is the phone navigation | instant |
| **Back to top** | > 1.5 screens scrolled | opacity + `translateY` 12 px; ring `stroke-dashoffset` follows scroll | `--dur-2` | n/a | inside the safe area | instant jump, no smooth scroll |
| **Header** | scroll | background opacity; reading line `scaleX(--p)` | `--dur-3` | rAF-throttled | same | same (it's position, not motion) |

## Lifecycle and cleanup

- Scripts run once per page load and attach to their own root (`[data-hero]`, `[data-reel]`, `[data-playground]`).
- Scroll handlers are passive and rAF-throttled. Geometry for the line is read with `offsetLeft/Top` (transform-free),
  recomputed on `ResizeObserver`, `document.fonts.ready` and breakpoint changes; the observer disconnects on a real
  `pagehide` (kept for back/forward cache).
- Journey autoplay stops on `visibilitychange` (tab hidden) and when the demo leaves the viewport (IntersectionObserver).
- The flow demo clears its timers on every restart; films observe each surface once (`WeakSet`) and stop observing.
- No canvas, WebGL or video is used, so there is no rendering context to lose and nothing renders off-screen.

## Testing

`tests/e2e/redesign.spec.ts` covers: the stage tabs by keyboard and pointer, the line being drawn, the playground demos,
reduced motion and the Motion switch persisting across reloads, the Back to top control, the menu dialog, and that no
first-screen content waits for a script.
