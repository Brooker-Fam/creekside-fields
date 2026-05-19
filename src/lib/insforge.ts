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
