# Asset manifest: "MANN / IN MOTION"

Every media file the redesign shows, where it came from, its licence, sizes and how it loads. Prepared 19 Nov 2026.
Nothing here is stock, generated imagery of a person, or another studio's work.

## Media created for the redesign

| File | Purpose | Source / owner | Licence | Dimensions · duration | Format · weight | Loading | Alt / text alternative | Fallback | Editable source |
|---|---|---|---|---|---|---|---|---|---|
| `public/media/studio-reel.mp4` | Studio reel on `/work/` | Screen recording of this site (built locally, Playwright, 19 Nov 2026) | Mann's own work | 1280 × 800 · 19.8 s · silent · 30 fps | H.264 High, CRF 27, faststart · 1.66 MB | `preload="none"`; downloads only on play | Description under the player (`#rp-desc`); no speech, so no captions needed | WebM below; poster if video is blocked | Re-record: `scripts/redesign/record-reel.cjs` (see below) |
| `public/media/studio-reel.webm` | Same reel, alternate source | same | same | same | VP9 CRF 38 · 2.01 MB | listed second (MP4 is smaller) | same | poster | same |
| `public/media/studio-reel-poster.jpg` | Reel poster (the stage's website scene) | Frame of the recording | Mann's own work | 1280 × 800 | JPEG q78 progressive · 102 KB | with the player | decorative (the video carries the description) | — | frame at 2.6 s of the raw recording |
| `public/media/studio-reel-poster-640.jpg` | Small poster for previews | same | same | 640 × 400 | JPEG · 34 KB | not referenced by pages (for sharing) | — | — | same |
| `public/fonts/mann-display-wght.woff2` | Display face | Mona Sans (GitHub) via Fontsource 5.3 | SIL OFL 1.1, Reserved Font Name "Mona" → renamed **Mann Display** (Modified Version) | wdth 125 fixed, wght 500–800 variable, Latin basic + site punctuation | woff2 · 22.5 KB | `preload` in `<head>`, `font-display: swap`, metric fallback | — | `Display Fallback` (Arial Black, size-adjusted) | `scripts/redesign/make-display-font.py` |
| SVG/CSS demos and the line | Stage scenes, playground, page line, 404 line, process line | Drawn in code (this repository) | Mann's own work | vector | inline SVG/CSS, no files | inline | Scenes are `aria-hidden` illustrations described by their captions; each says "Illustration" or "Demo: nothing is sent" | Static final frame with Motion off or without JavaScript | the components themselves |
| `public/og/default.png`, `public/og/work-*.png`, `/og/p/*` (built) | Sharing images | Generated from the site's fonts, colours and real captures (`npm run images`, `scripts/og-images.mjs`) | Mann's own work | 1200 × 630 | PNG · 18–225 KB | link previews only | `og:image:alt` per page | — | the scripts |

## Real assets reused (extracted from the live site's repository)

| File | Purpose in the redesign | Source / owner | Licence | Dimensions | Delivered as | Loading | Alt text |
|---|---|---|---|---|---|---|---|
| `src/assets/mann-patel-cutout.png` | Mann standing on the hero stage; the lime contact-sheet frame | Mann's own photo, background removed (earlier round) | Mann's own | 914 × 964 RGBA · 709 KB source | WebP 240–640 w (≈ 10–40 KB each) | eager, `fetchpriority="high"` on the stage | "Mann Patel, smiling, in a dark green sweatshirt" |
| `src/assets/mann-patel-portrait.jpg` | Portrait scene (tall crop that drifts), About | Mann's own photo | Mann's own | 1060 × 1060 | AVIF + WebP 420–1060 w | lazy | `profile.portrait.alt` ("Mann Patel smiling, in a dark green sweatshirt, on a tree-lined street at dusk.") |
| `src/assets/mann-patel-hero.jpg` | Contact-sheet close-up; About photo | Mann's own photo (close crop, 14 Nov 2026) | Mann's own | 1254 × 1254 | AVIF + WebP | lazy / priority on About | as above |
| `src/assets/work/nest-and-rest/live-2026-11-08-desktop.png` | Stage website scene; work film; "after" in before/after | Capture of nestnrestcleaning.com (Mann's own business), 8 Nov 2026 | Mann's own | 1440 × 900 | AVIF + WebP / WebP 480–1440 w | eager in the stage (decorative there), lazy elsewhere | `captures.ts` alt; "After, 8 November 2026 …" |
| `src/assets/work/nest-and-rest/live-2026-10-31-desktop.png` | "Before" in before/after | Capture, 31 Oct 2026 | Mann's own | 1440 × 900 | AVIF + WebP | lazy | "Before, 31 October 2026 …" |
| `src/assets/work/nest-and-rest/live-2026-11-08-mobile.png` | Phone view in the work film | Capture, 8 Nov 2026 | Mann's own | 720 × 1600 | AVIF + WebP 180/360 w | lazy | decorative in the film (desktop alt is read) |
| `src/assets/work/nest-and-rest/detail-*.png` | "Price first", "Honest about timing" film details | Crops of the live site | Mann's own | 920–1218 w | AVIF + WebP 240/480 w | lazy | decorative in the film; full alt on the case study |
| `src/assets/work/samp-hair-spa/*.png` | Samp film, case study | Captures of the Lovable preview of the client site (in progress, 31 Oct 2026); its photography is stock and labelled so on that site | Client work shown with its status; not presented as launched | 1440 × 836, 360 × 758, crops | AVIF + WebP | lazy | `captures.ts` alt |
| `public/brand/*` (wordmark, monogram, logo) | Header, footer, favicons | MΛNN PΛTEL wordmark outlined from Geist | SIL OFL 1.1 (Geist) | vector | inline SVG | inline | "Mann Patel" (`role="img"`) |
| `public/fonts/geist-*.woff2` | Text and labels | Vercel Geist | SIL OFL 1.1 | subsets | woff2 15–24 KB | preload (sans) | — |

## Regenerating

- **Reel:** build and serve the site (`npm run build && npm run preview`), then
  `node scripts/redesign/record-reel.cjs <out-dir>` and encode with the two `ffmpeg` commands in
  `scripts/redesign/README.md`.
- **Display font:** `pip install fonttools brotli`, then `python3 scripts/redesign/make-display-font.py`.
- **Sharing images:** `npm run images` (default and project cards); per-page cards are drawn at build time.

## Not used, on purpose

- No stock footage or stock people: the only people shown are Mann (real photos) and, on the Samp preview capture, the
  salon site's own labelled stock photography as it appears on that client site.
- No AI-generated imagery: the motif is better as exact vector, and generated lettering is unreliable.
- No audio: nothing on the site makes sound, so there is no sound toggle.
