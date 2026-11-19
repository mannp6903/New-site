# Maintaining the redesign

Plain instructions for changing things without breaking the system. Everything is in this repository; there is no CMS.

## Copy

| What | Where |
|---|---|
| Home hero (kicker, H1, service line, buttons) | `src/components/home/Stage.astro` (top of the markup) |
| The three needs: tab labels, scene captions, links, the note on the screen | `needs` array at the top of `src/components/home/Stage.astro`; the screen notes also in `notes` in `src/scripts/stage.ts` |
| Playground copy and steps | `src/components/home/Playground.astro` (flow steps), `src/components/demos/Journey.astro` (journey steps) |
| Person scene facts | `src/components/home/Person.astro` |
| Process steps | `steps` at the top of `src/components/home/ProcessBrief.astro` |
| Prices | `src/data/packages.ts` (every price on the site reads from here, including the home rail and the structured data) |
| Services, FAQs, areas, service pages | `src/data/*.ts` as before (`docs/OWNER-INPUTS.md`) |
| Footer closing line | `src/components/Footer.astro` |

Keep the honesty rules: label illustrations as illustrations, never invent results, prices or reviews.

## Projects

1. Add `src/content/work/<slug>.md` (the schema in `src/content.config.ts` lists every field; `relationship`, `status`
   and `checked` are required and show on every card).
2. Add its captures to `src/assets/work/<slug>/` and a capture set in `src/data/captures.ts` (desktop, mobile, at least
   two details with alt text). Add the key to the `scene` enum in `src/content.config.ts`.
3. The home work reel, the work index and the case-study page pick it up automatically (ordered by `order`). The film
   uses the desktop capture, the phone capture and the first two details.

## Images and video

- Put source images in `src/assets/…` and render them with `<Picture>` (AVIF + WebP) or `<Image>`; give `widths` up to 2×
  the shown size and real `alt` text. Mann's likeness: real photos only.
- **Hero portrait:** replace `src/assets/mann-patel-cutout.png` with a new transparent PNG of the same framing (head and
  shoulders, about 1:1). The stage positions it by width, so no other change is needed.
- **Studio reel:** re-record and re-encode with `scripts/redesign/record-reel.cjs` and the commands in
  `scripts/redesign/README.md`; keep the file names in `public/media/` or update `src/components/ReelPlayer.astro`.
  Keep it silent, or add captions (a `<track>`) if it ever has speech.

## Motion

- Every duration is a token in `src/styles/tokens.css` (`--dur-1` … `--dur-6`, `--stagger`). Change motion there; the
  unit gate (`tests/unit/design-tokens.test.ts`) refuses literal durations in components.
- New animations must be scoped to `:root[data-motion='on']` so the Motion switch, reduced motion and no-JS all work.
- The Motion preference is stored in `localStorage["mp-motion"]`. To reset it in a browser: remove that key.
- Demos must stay finite (play once, Replay/Pause), local (no network calls) and labelled.

## Colours and type

- Tokens only (`src/styles/tokens.css`); no hex values in components (unit gate C2). DESIGN.md's colour table must list
  every colour token with its value (gate C6): regenerate it if you add one.
- Ivory sections: add `.paper` (or use `.section--alt`); lime automatically becomes ink there.

## Checks before a deploy

```bash
npm run check          # Astro + TypeScript
npm test               # unit tests, including the design gates
npm run build && npm run test:e2e   # browser tests (site, redesign, design gates)
npm run build:cloudflare            # production build + pre-launch check
```

## Rollback

- The redesign is three commits on branch `ccr-50f74c22-883lji` of `mannp6903/New-site`, on top of an untouched
  import of the live site (commit `bb8dc78`, from Mann-Patel-Personal-Profile-Website @ `9c7c1f4`).
- The live repository (Mann-Patel-Personal-Profile-Website) was not changed. Production keeps serving the previous site
  until a deploy is made from this branch. To roll back after a deploy, redeploy `9c7c1f4` of the live repository
  (Cloudflare: Deployments → the previous deployment → Rollback, or `npx wrangler rollback`).
- To bring back only part of the old site, check out files from commit `bb8dc78`.
