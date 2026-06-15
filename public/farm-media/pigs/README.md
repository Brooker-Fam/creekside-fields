# Our pigs — story photos

Drop the photos for the `/our-pigs` page in this folder, using these exact
filenames. Until a file exists, that plate gracefully hides (or falls back to
an existing photo), so the live page never shows a broken image.

| Filename               | Photo                                                                 |
| ---------------------- | --------------------------------------------------------------------- |
| `01-arrival-barn.jpg`  | The two spotted piglets curled up together in the barn straw (hero).  |
| `02-guardian.jpg`      | The piglets in the barn with the farm dog nearby.                     |
| `03-feeding.jpg`       | Bearded farmer crouching to feed the two piglets by hand.             |
| `04-gentle-hands.jpg`  | Person petting/greeting a single piglet at the pen rail.              |
| `05-pasture.jpg`       | Three pigs at the feeder out on pasture, dog watching in back.        |

Landscape JPGs around 1600×1200 (4:3) look best. After adding them, run
`pnpm build` and push — Vercel redeploys automatically.
