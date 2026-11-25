# Creekside Fields

The customer-facing site + admin tooling for selling pasture-raised
Gloucestershire Old Spots pork (by the share or by the cut) and whole geese
and ducks from our farm in Greenwich, NY.

Live at **https://creeksidefields.com**.

## What it does

Customers order through simple forms — nothing is paid online:

- **Pig shares** (quarter / half / whole) at $10/lb of take-home pork,
  shown as estimated ranges from a real sample quarter, and **individual
  cuts** priced per pound — both in one order form on `/shares`
  (`#share-options`, `#cuts`), so a share and extra packs go in one order.
- **Whole geese ($16/lb) and ducks ($14/lb)** on `/geese-and-ducks`.
- A **contact form** on `/contact`.

Every form posts to `api/send-order.ts`, which sends two emails: one to the
farm with Reply-To set to the customer (so a plain Reply starts the
conversation), and a confirmation to the customer. The farm's inbox is the
order record — orders aren't stored in the database. The farm follows up to
confirm the total (actual weight × price) and a pickup time at the farm. The
pork was processed at a **USDA-inspected** facility, so it can be sold by the
share or by the cut.

Prices and product lists live in `src/content/`: share sizes and cuts in
`sharesCopy.ts` (mark a cut `soldOut: true` to hide it from the order form),
geese and ducks in `poultryCopy.ts`. The email function mirrors only the order
kinds and the per-item limit from `src/content/orders.ts`.

The admin dashboard (`/admin`) and the InsForge database still hold the
earlier online share reservations; the public site no longer uses them.

See **`docs/INFRA.md`** for accounts, env vars, DNS, and everything that
isn't in the code.
See **`docs/MODEL.md`** for the legal/business model summary.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind v3.4, deployed on
  Vercel (`guava-tri/creekside-fields`).
- **Backend**: InsForge (Postgres + auth + storage). Project `umvug9f9` at
  `https://umvug9f9.us-east.insforge.app`. Only the admin dashboard uses it
  now (loaded on demand, so it isn't in the public bundle).
- **Email**: Resend, sending from `hello@creeksidefields.com`. Called from
  the Vercel edge function `api/send-order.ts` (every form on the site).
- **Domain**: `creeksidefields.com`, registered at Squarespace, DNS
  managed by Vercel (we switched nameservers to `ns1/ns2.vercel-dns.com`).

## Running locally

```bash
pnpm install
cp .env.example .env   # if .env.example exists; otherwise see below
pnpm dev               # http://localhost:5173
```

`.env` needs:

```
VITE_INSFORGE_URL=https://umvug9f9.us-east.insforge.app
VITE_INSFORGE_ANON_KEY=<grab from `npx @insforge/cli secrets get ANON_KEY`>
VITE_POSTHOG_KEY=<PostHog project token>
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

`RESEND_API_KEY` is only needed server-side; pull it from Vercel with
`vercel env pull .env.local` if you want to run the function locally
with `vercel dev`. The Vercel edge function also reads `POSTHOG_KEY` and
`POSTHOG_HOST` (same project token, set in Vercel project env vars) so
it can record confirmation email sends/failures against the same user.

## Project layout

```
src/
  pages/         Home, Shares (the Pork page), GeeseAndDucks, OurPigs, Contact,
                 NotFound, admin/{Login,Dashboard}
  components/    Layout, LegacyRedirect (old URLs), site/{OrderForm, ContactForm,
                 Field, QuestionsLine, Whimsy, ThemeToggle}; OrderSummary +
                 Invoice are admin-only
  content/       Copy, prices, and product lists (orders, sharesCopy,
                 poultryCopy, homeCopy)
  lib/           insforge client + types + emailTemplates (admin), scroll helper
api/
  send-order.ts          Vercel edge function — emails every site form via Resend
                         (farm copy with Reply-To = customer, plus a customer confirmation)
migrations/      SQL migrations applied via `npx @insforge/cli db migrations up`
scripts/         seed.sql for the initial pigs + processors
public/farm-media/   Farm photos, each with a smaller "-600/-750/-800" copy for phones
```

## Common admin tasks

```bash
# DB inspection
npx @insforge/cli db query "SELECT count(*) FROM reservations"

# Apply pending migrations
npx @insforge/cli db migrations up --all

# Deploy (auto from main push, or manual)
npx vercel@latest deploy --prod

# Add yourself as admin (after signing up at /admin/login)
npx @insforge/cli db query "INSERT INTO admin_users (user_id) SELECT id FROM auth.users WHERE email='you@example.com'"
```

## Repos / accounts

- GitHub: https://github.com/Brooker-Fam/creekside-fields
- Vercel: https://vercel.com/guava-tri/creekside-fields
- InsForge: https://insforge.dev/dashboard/project/e8b24022-b154-4add-95e3-055fe892292f
- Resend: https://resend.com (logged in as `creeksidefields@gmail.com`)
- Squarespace (domain only): https://account.squarespace.com/domains
