# Creekside Fields

The customer-facing site + admin tooling for selling pasture-raised
Gloucestershire Old Spots pork shares from our farm in Greenwich, NY.

Live at **https://creeksidefields.com**.

## What it does

Customers reserve a whole / half / quarter share of one of our gilts, sign
a bill of sale on-screen, get the signed copy by email, and pick up the
meat from the processor (or the farm) once it's ready. The site sells
under the federal **custom-exempt** model (9 CFR 303.1(a)(2)(i)) plus NY
Ag &amp; Markets Law Article 5-A §96-d — the customer buys the live animal
share before slaughter, every package gets a "Not For Sale" stamp, and
the farm handles processing scheduling on the buyer's behalf with one
bundled invoice at the end.

See **`docs/INFRA.md`** for accounts, env vars, DNS, and everything that
isn't in the code.
See **`docs/MODEL.md`** for the legal/business model summary.

## Stack

- **Frontend**: React + Vite + TypeScript + Tailwind v3.4, deployed on
  Vercel (`guava-tri/creekside-fields`).
- **Backend**: InsForge (Postgres + auth + storage). Project `umvug9f9` at
  `https://umvug9f9.us-east.insforge.app`.
- **Email**: Resend, sending from `hello@creeksidefields.com`. Called from
  a Vercel edge function at `api/send-bill-of-sale.ts`.
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
```

`RESEND_API_KEY` is only needed server-side; pull it from Vercel with
`vercel env pull .env.local` if you want to run the function locally
with `vercel dev`.

## Project layout

```
src/
  pages/         Home, Animal, Reserve, ReserveConfirm, About, admin/{Login,Dashboard}
  components/    Layout, BillOfSale, Invoice, SignaturePad, Spots
  lib/           insforge client, types, emailTemplates
api/
  send-bill-of-sale.ts   Vercel edge function — emails the signed BoS via Resend
migrations/      SQL migrations applied via `npx @insforge/cli db migrations up`
scripts/         seed.sql for the initial pigs + processors
public/farm-media/   Hero photos of the gilts
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
