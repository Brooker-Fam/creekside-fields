# Infrastructure

Everything outside the codebase that has to be right for the site to work.
Read this before touching DNS, switching providers, or wondering why a
secret is where it is.

## Accounts in play

| Service | Account | Purpose |
|---|---|---|
| **GitHub** | `Brooker-Fam/creekside-fields` | Source of truth. Push to `main` = deploy. |
| **Vercel** | `guava-tri` team, project `creekside-fields` (`prj_KRVj99R3UJFsMHVnhq8ynQfMXWJf`) | Frontend hosting + edge function + DNS. |
| **InsForge** | Project `umvug9f9` (Creekside Fields), org `Personal Org`, plan `NANO` (free) | Postgres, auth, storage (signatures bucket). |
| **Resend** | Account email `creeksidefields@gmail.com`, plan free | Outbound transactional email (signed bill of sale). |
| **Squarespace** | Registrant `creeksidefields@gmail.com` (Brittany Woolley), `brookerhousehold@gmail.com` is the operations email | Domain registrar only. DNS lives at Vercel. |

`brookerhousehold@gmail.com` is the farm's customer-facing email + the
admin login for the site. `creeksidefields@gmail.com` is the domain
registrant + the Resend account.

## Domain + DNS

- Domain: `creeksidefields.com` (auto-renew on, $20/yr at Squarespace, expires 2027-01-25).
- Nameservers: **`ns1.vercel-dns.com` / `ns2.vercel-dns.com`**. We switched
  from Squarespace/Google nameservers on 2026-05-21 because Squarespace's
  per-record-edit MFA was repeatedly rejecting valid codes.
- All DNS lives in Vercel from here on. Manage via `npx vercel@latest dns ls creeksidefields.com` and `… dns add` / `dns rm`.
- DNS records currently:
  - **A `@` → 76.76.21.21** (Vercel auto-creates this from the Vercel project; serves the site)
  - **A `www` → 76.76.21.21** (same)
  - **TXT `resend._domainkey` → `p=MIGfMA...wIDAQAB`** (Resend DKIM)
  - **MX `send` 10 → `feedback-smtp.us-east-1.amazonses.com`** (Resend bounce handling)
  - **TXT `send` → `v=spf1 include:amazonses.com ~all`** (Resend SPF)
  - **TXT `_dmarc` → `v=DMARC1; p=none;`** (DMARC, monitoring only)
  - **CAA / ALIAS records** auto-managed by Vercel for SSL + the apex.
- SSL: auto-provisioned by Vercel.

If you ever need to point `creeksidefields.com` somewhere other than the
Vercel deployment, change the records in Vercel, not Squarespace.

## Frontend hosting (Vercel)

- Repo connected: `Brooker-Fam/creekside-fields`. Every push to `main`
  triggers a production deploy.
- Build: Vite. Output: `dist/`. Vercel detects this automatically.
- SPA routing: `vercel.json` rewrites everything to `/index.html`.
- Env vars on Vercel (production):
  - `VITE_INSFORGE_URL` — the InsForge API base URL (`https://umvug9f9.us-east.insforge.app`). Not secret.
  - `VITE_INSFORGE_ANON_KEY` — the InsForge anon JWT (designed for client use, not secret in the same way an admin key would be).
  - `RESEND_API_KEY` — **encrypted/sensitive**, server-only. Scoped to "Sending access" + `creeksidefields.com` only. Used by `api/send-bill-of-sale.ts`. **Never expose to the client.**

## Backend (InsForge)

- Region: `us-east`, base URL `https://umvug9f9.us-east.insforge.app`.
- Auth: email/password + Google OAuth + GitHub OAuth (provider list in InsForge dashboard). Email verification on.
- Admin bootstrap: a row in `admin_users` table linked to `auth.users.id`. To grant admin:
  ```bash
  npx @insforge/cli db query "INSERT INTO admin_users (user_id) SELECT id FROM auth.users WHERE email='someone@example.com'"
  ```
- Storage buckets:
  - `signatures` (public read, anon insert) — holds the canvas-drawn buyer signature PNGs. Files at `reservations/<reservation_id>/<ts>.png`.
- RLS model:
  - `animals`, `processors`, `share_options`: public SELECT, admin write.
  - `reservations`: anon INSERT, admin SELECT/UPDATE/DELETE. Anon also writes signature fields via the `sign_reservation()` `SECURITY DEFINER` RPC (not direct UPDATE).
  - `admin_users`: self-SELECT + admin manage.
  - `storage.objects`: signatures bucket gets public read + anon insert; everything else is locked down to admins.
- Migrations live in `/migrations/` and are applied via:
  ```bash
  npx @insforge/cli db migrations up --all
  ```

### Plan limits we hit

- **`insforge.emails.send()` is paid-plan only.** On NANO (free) it returns `Custom email service is not available for free plan`. We solved this by sending through Resend via the Vercel function instead. If you ever upgrade InsForge, you could swap back.
- **InsForge edge functions deploy fails on every import.** Their security scanner rejects `import { createClient } from 'npm:@insforge/sdk'` (the exact canonical example from their own docs). Tracked but unresolved upstream. Not a blocker — we don't use InsForge functions for anything.

## Email (Resend)

- Sender: `Creekside Fields <hello@creeksidefields.com>`.
- API key stored on Vercel as `RESEND_API_KEY`, restricted to **Sending access** on **creeksidefields.com** only. Rotate by creating a new key in Resend → `vercel env rm RESEND_API_KEY production` → `vercel env add RESEND_API_KEY production`.
- The send code lives in `api/send-bill-of-sale.ts`. Called from `src/pages/ReserveConfirm.tsx` after a successful signature save.
- Domain verification: passes DKIM + SPF + DMARC. Don't remove any of the DNS records listed above.
- Free tier: 3,000 emails/month, 100/day. Plenty for the volume we're operating at.

## Common ops

```bash
# Trigger a deploy
git push   # auto-deploys via Vercel-GitHub link

# Manual deploy if push isn't an option
npx vercel@latest deploy --prod

# Tail Vercel function logs
npx vercel@latest logs https://creeksidefields.com/api/send-bill-of-sale

# Run a new migration
npx @insforge/cli db migrations new <name>
# edit migrations/<timestamp>_<name>.sql
npx @insforge/cli db migrations up --all

# Add or remove a DNS record
npx vercel@latest dns add creeksidefields.com <name> <type> <value>
npx vercel@latest dns ls creeksidefields.com
npx vercel@latest dns rm <record-id>

# View / set Vercel env vars
npx vercel@latest env ls
npx vercel@latest env add <NAME> production
```

## Things to know if you're picking this up cold

1. **Source of truth for DNS is Vercel, not Squarespace.** Don't bother logging into Squarespace except to renew the domain.
2. **Two Gmail accounts in play.** `creeksidefields@gmail.com` for domain registrar + Resend; `brookerhousehold@gmail.com` for the farm operations + admin login. Don't conflate them.
3. **Bill of sale email is the only outbound email** right now. Deposit instructions and final invoices are sent manually via the admin dashboard's "Email …" buttons (which open the farm's mail client with a prefilled draft).
4. **The signing flow stores PNGs in InsForge storage, not on Vercel.** The image URL is what's embedded in the email. Resend rebroadcasts the InsForge URL — no attachments.
5. **Pricing.** Per-pound rate is on `animals.rate_per_lb_hw_cents`, currently $7.50/lb HW. Update in the admin UI (`Animals → Edit → Rate`). The share_options dollar ranges (`est_total_low_cents` / `est_total_high_cents`) are estimates derived from `rate × est. hanging weight × share %` and need to be updated by hand if you change either input.
6. **Two gilts, but customer never picks one.** The customer-facing flow only thinks in `kind` (whole / half / quarter); the system auto-assigns a specific `share_option` at reserve time. The legally-required pig identity ends up on the bill of sale anyway.
