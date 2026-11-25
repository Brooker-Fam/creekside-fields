# Creekside Fields

Marketing + reservation site for Creekside Fields, a regenerative family farm
in Greenwich, NY selling pasture-raised heritage Gloucestershire Old Spot pork
shares. React + Vite + TypeScript + Tailwind v3.4, InsForge backend, Resend
email, deployed on Vercel. Live at https://creeksidefields.com.

## Working agreements

- **Always commit and push to `main` when you finish a change.** Don't ask for
  confirmation — commit and `git push origin main` as part of completing the
  task. Vercel auto-deploys `main`.

## Design system

The brand/design system lives in the "Creekside Fields Design System" skill
(reverse-engineered from this repo). Match it:

- **Type:** Marcellus (headings), Marcellus SC (small-caps eyebrows/labels),
  Spectral (body, UI, italic accents). Sentence case everywhere; no emoji.
- **Color:** linen creams (surfaces), forest greens (headings/primary), warm
  browns (body), a single copper accent, sage tints. No pure black.
- **Storybook treatment:** real farm photos in matted "plates" (square
  corners, thin inner rule, some tilted a degree or two) with italic captions;
  one sprig + leaf/acorn divider per page (above the footer); fireflies only at
  night (dark theme) and in the dusk-green footer; paper grain; warm paper
  surfaces, never pure white; a seed-catalog price list with dotted leaders;
  italic roman numerals for steps. No four-point "sparkle" icons — they read as
  AI. Tokens live as CSS variables in `src/index.css`; the storybook layer
  (`.plate`, `.story-eyebrow`, `.numeral`, `.catalog-*`, `.whimsy-*`, `.book`)
  is there too. Whimsy components are in `src/components/site/Whimsy.tsx`.
- **Layout:** at most three small-caps labels per page; headings without
  trailing periods; one "get in touch" prompt per page.

## Voice

Write like the family talking at pickup: "we," contractions, short sentences.
Use a true, specific detail instead of an adjective (cat carriers, the Subaru,
Bristol and Blanca, cafeteria leftovers). Say each thing once per page. Prefer
periods to dashes, and skip rhythm-only lists of three. Never use: curated,
thoughtfully, exceptional, succulent, elevate, "reach out", "we'd love to hear
from you". Headlines should sound like something you'd say out loud.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build` (this is what Vercel runs; keep it green)
- `pnpm lint` — eslint (note: a few pre-existing errors live in
  `Reserve.tsx` / `admin/Dashboard.tsx`; lint is not part of the build)
