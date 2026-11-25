// Shared shape for the site's order forms: pork (shares and cuts together) and
// geese & ducks. Orders and contact-form messages are emailed through
// api/send-order.ts — the farm gets its own copy to reply to, and the customer
// gets a confirmation. Nothing is stored in the database.
//
// The kinds and MAX_PER_ITEM are mirrored in api/send-order.ts, which is
// bundled separately and can't import from src — change both together.

/** Which order form an order came from; picks the wording of the emails. */
export type OrderKind = 'pork' | 'birds'

export interface OrderItem {
  id: string
  /** Shown in the picker and the order email, e.g. "Whole goose", "Bacon". */
  title: string
  /** Price per pound, in whole dollars. */
  pricePerLb?: number
  /** Extra detail after the price, e.g. "About 1 lb packs". */
  detail: string
  /** A small third line, e.g. a freezer-space hint. */
  note?: string
  /** Rough cost of one, in dollars, for the running estimate: [low, high]. */
  estimate?: readonly [number, number]
  /** Out of stock: left off the order form and listed as "sold out for now". */
  soldOut?: boolean
}

/** A titled run of items inside one order form (e.g. "Pig shares", "Individual cuts"). */
export interface OrderGroup {
  /** Anchor id, so links like /shares#cuts land on the group. */
  id: string
  title?: string
  note?: string
  items: OrderItem[]
}

/** The line under an item's name: "$15/lb · About 1 lb packs". */
export function itemDetail(item: OrderItem): string {
  return [item.pricePerLb != null ? `$${item.pricePerLb}/lb` : '', item.detail].filter(Boolean).join(' · ')
}

/** Most of any one item a single online order can request. */
export const MAX_PER_ITEM = 10

/** Quantity chosen per item id; missing means none. */
export type OrderCounts = Record<string, number>

/** The wording that differs between order forms. */
export interface OrderFormCopy {
  kind: OrderKind
  /** Shown at the picker when someone submits without choosing anything. */
  emptyError: string
  /** Hint under the picker before anything is chosen. */
  idleHint: string
  /** Short summary of what's chosen, e.g. "2 geese and 1 duck" or "1 quarter share and 3 packs". */
  describe: (counts: OrderCounts) => string
  /** Subject of the pre-filled fallback email if sending fails. */
  mailSubject: string
}

/** Wording every order form shares. */
export const ORDER_WORDING = {
  /** Follows the summary under the picker. */
  selectedHint: 'We’ll send your exact total once it’s all weighed.',
  pickup: 'Pickup is at our farm, 49 Clarks Mills Rd in Greenwich. You won’t pay anything online.',
  submit: 'Send my order',
  finePrint: 'You’ll get a copy by email right away. Then we’ll write back with your total and a time to come get it.',
  /** Ends the thank-you note. */
  thanksTail: 'we’ll write back soon with your total and a pickup time.',
} as const

/** "about $16" or "about $455–$515". */
export function formatEstimate([low, high]: readonly [number, number]): string {
  const fmt = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`
  return Math.round(low) === Math.round(high) ? `about ${fmt(low)}` : `about ${fmt(low)}–${fmt(high)}`
}
