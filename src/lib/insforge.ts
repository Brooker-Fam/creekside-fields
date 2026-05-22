import { createClient } from '@insforge/sdk'

export const insforge = createClient({
  baseUrl: import.meta.env.VITE_INSFORGE_URL,
  anonKey: import.meta.env.VITE_INSFORGE_ANON_KEY,
})


export const formatCents = (cents: number | null | undefined) =>
  cents == null ? '—' : `$${(cents / 100).toFixed(0)}`

export const priceRange = (low?: number | null, high?: number | null) => {
  if (!low && !high) return 'Ask for price'
  if (low && high && low !== high) return `${formatCents(low)}–${formatCents(high)}`
  return formatCents(low ?? high)
}

// Per-pound rate for a share. Prefer the share-level rate (per-kind tier);
// fall back to the animal's rate for any share that pre-dates the per-kind
// pricing migration (20260522140000_per-kind-share-rates).
export const getShareRateCents = (
  share?: { rate_per_lb_hw_cents?: number | null } | null,
  animal?: { rate_per_lb_hw_cents?: number | null } | null,
): number | null => share?.rate_per_lb_hw_cents ?? animal?.rate_per_lb_hw_cents ?? null
