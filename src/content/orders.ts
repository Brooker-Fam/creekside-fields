// Shared shape for the site's order forms: pig shares, individual pork cuts,
// and geese & ducks. Orders (and contact-form messages) are emailed through
// api/send-order.ts — the farm gets its own copy to reply to, and the customer
// gets a confirmation. Nothing is stored in the database.
//
// The kinds and MAX_PER_ITEM are mirrored in api/send-order.ts, which is
// bundled separately and can't import from src — change both together.

/** Which order form an order came from; picks the wording of the emails. */
export type OrderKind = 'shares' | 'pork' | 'birds'

export interface OrderItem {
  id: string
  /** Shown in the picker and the order email, e.g. "Whole goose", "Bacon". */
  title: string
  /** Price per pound, in whole dollars. */
  pricePerLb?: number
  /** Extra detail after the price, e.g. "About 1 lb packs". */
  detail: string
  /** Out of stock: left off the order form and listed as "sold out for now". */
  soldOut?: boolean
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
  /** Heading above the item picker, e.g. "Your birds". */
  legend: string
  /** Shown at the picker when someone submits without choosing anything. */
  emptyError: string
  /** Hint under the picker before anything is chosen. */
  idleHint: string
  /** Short summary of what's chosen, e.g. "2 geese and 1 duck" or "6 packs". */
  describe: (counts: OrderCounts) => string
  /** Subject of the pre-filled fallback email if sending fails. */
  mailSubject: string
}

/** Wording every order form shares. */
export const ORDER_WORDING = {
  /** Follows the summary under the picker, after a dash. */
  selectedHint: 'priced by weight, so we’ll weigh your order and give you the exact total.',
  pickup: 'Pickup is at our farm in Greenwich, NY. Nothing to pay online — we’ll reach out to set a time.',
  submit: 'Send my order',
  finePrint: 'We’ll email you a copy right away, then get in touch to confirm your order and set a pickup time.',
  /** Ends the thank-you note. */
  thanksTail: 'we’ll be in touch soon to confirm your order and set a pickup time at the farm.',
} as const
