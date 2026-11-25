// Shared shape for the site's order forms: geese & ducks, and individual pork
// cuts. Orders are emailed through api/send-order.ts (customer confirmation,
// farm CC'd) — nothing is stored in InsForge.
//
// OrderKind and MAX_PER_ITEM are mirrored in api/send-order.ts, which is
// bundled separately and can't import from src — change both together.

/** Which form an order came from; picks the wording of the order email. */
export type OrderKind = 'birds' | 'pork'

export interface OrderItem {
  id: string
  /** Shown in the picker and the order email, e.g. "Whole goose", "Bacon". */
  title: string
  /** Second line, e.g. "$16 per pound" or "About 1 lb packs". */
  detail: string
  /** Out of stock: left off the order form (cuts still show as possible share cuts). */
  soldOut?: boolean
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
  /** Follows the summary under the picker, after a dash. */
  selectedHint: string
  /** Pickup line above the submit button. */
  pickup: string
  submit: string
  finePrint: string
  /** Ends the thank-you note: "We've emailed a confirmation to …, and <thanksTail>" */
  thanksTail: string
  /** Subject of the pre-filled fallback email if sending fails. */
  mailSubject: string
}
