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
- **Storybook treatment:** framed photo "plates" with italic captions,
  botanical sprig + gnome/toadstool ornament dividers, an ambient
  firefly/sparkle field, paper-grain background, gentle radii, two warm-brown
  shadows. Tokens live as CSS variables in `src/index.css`; the storybook
  layer (`.plate`, `.story-eyebrow`, `.numeral`, `.whimsy-*`, `.book`) is there
  too. Whimsy components are in `src/components/site/Whimsy.tsx`.

## Commands

- `pnpm dev` — dev server
- `pnpm build` — `tsc -b && vite build` (this is what Vercel runs; keep it green)
- `pnpm lint` — eslint (note: a few pre-existing errors live in
  `Reserve.tsx` / `admin/Dashboard.tsx`; lint is not part of the build)
