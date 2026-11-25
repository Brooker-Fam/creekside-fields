import type { ShareKind } from '../lib/types'
import type { OrderCounts, OrderFormCopy, OrderItem } from './orders'

/** The three pork-share sizes offered on the Pork page. */
export type PorkShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter'>

export interface ShareTier {
  kind: PorkShareKind
  title: string
  takeHome: string
  price: string
  /** Short freezer-space guide. */
  freezer: string
}

/** Weights come from a real sample quarter (44 lb); shares are $10/lb of take-home pork. */
export const SHARE_TIERS: ShareTier[] = [
  {
    kind: 'quarter',
    title: 'Quarter pig share',
    takeHome: '41–47 pounds',
    price: '$410–$470',
    freezer: 'Fits in most refrigerator freezers — about 1 cubic foot.',
  },
  {
    kind: 'half',
    title: 'Half pig share',
    takeHome: '83–93 pounds',
    price: '$830–$930',
    freezer: 'Fits a small chest freezer — about 2–3 cubic feet.',
  },
  {
    kind: 'whole',
    title: 'Whole pig share',
    takeHome: '166–187 pounds',
    price: '$1,660–$1,870',
    freezer: 'Fits a chest or upright freezer — about 4–5 cubic feet.',
  },
]

/**
 * Estimated price range by share kind (also used by the admin dashboard and
 * its emails). The final price is the share's actual weight × $10.
 */
export const SHARE_PRICE_RANGE: Record<string, string> = Object.fromEntries(
  SHARE_TIERS.map((t) => [t.kind, t.price]),
)

/** The share sizes as order-form lines. */
export const SHARE_ITEMS: OrderItem[] = SHARE_TIERS.map((t) => ({
  id: t.kind,
  title: t.title,
  detail: `About ${t.takeHome.replace(' pounds', ' lb')} · ${t.price}`,
}))

/** "1 quarter share", "1 whole share and 2 half shares", … */
function describeShares(counts: OrderCounts): string {
  return SHARE_TIERS.filter((t) => (counts[t.kind] ?? 0) > 0)
    .map((t) => `${counts[t.kind]} ${t.kind} ${counts[t.kind] === 1 ? 'share' : 'shares'}`)
    .join(' and ')
}

export const SHARE_ORDER: OrderFormCopy = {
  kind: 'shares',
  legend: 'Your share',
  emptyError: 'Choose a share size.',
  idleHint: '$10 per pound of take-home pork.',
  describe: describeShares,
  mailSubject: 'Pig share order',
}

/**
 * The cuts we have, sold individually on the Pork page and listed as what a
 * share may include. Pack sizes come from a sample quarter share's packages;
 * prices come from Nov 2026 research on pasture-raised pork prices (upstate NY
 * farmers markets, Northeast farms, USDA). Mark a cut `soldOut: true` to take
 * it off the order form until it's back.
 */
export const PORK_CUTS: OrderItem[] = [
  { id: 'chops', title: 'Boneless pork chops', pricePerLb: 15, detail: 'About 1–2½ lb packs' },
  { id: 'ribs', title: 'Ribs', pricePerLb: 10, detail: 'About 3½ lb racks', soldOut: true },
  { id: 'boston-butt', title: 'Boston butt', pricePerLb: 11, detail: 'About 5 lb roasts' },
  { id: 'bacon', title: 'Bacon', pricePerLb: 15, detail: 'About 1 lb packs' },
  { id: 'ham-steak', title: 'Smoked ham steak', pricePerLb: 11, detail: 'About 2 lb packs' },
  { id: 'sliced-ham', title: 'Smoked sliced ham', pricePerLb: 12, detail: 'About 1 lb packs' },
  { id: 'breakfast-sausage', title: 'Breakfast sausage', pricePerLb: 11, detail: 'Ground, about 1 lb packs' },
  { id: 'sweet-italian', title: 'Sweet Italian sausage', pricePerLb: 11, detail: 'Ground, about 1 lb packs' },
  { id: 'bratwurst', title: 'Bratwurst links', pricePerLb: 12, detail: 'About 1–1½ lb packs' },
  { id: 'ground-pork', title: 'Ground pork', pricePerLb: 10, detail: 'About 1 lb packs' },
  { id: 'ham-hocks', title: 'Ham hocks', pricePerLb: 5, detail: 'Fresh, not smoked' },
  { id: 'soup-bones', title: 'Soup bones', pricePerLb: 4, detail: 'For broth and stock' },
  { id: 'lard-fat', title: 'Pork fat for lard', pricePerLb: 4, detail: 'For rendering your own lard' },
]

export const PORK_ORDER: OrderFormCopy = {
  kind: 'pork',
  legend: 'Your cuts',
  emptyError: 'Choose at least one cut.',
  idleHint: 'Priced by the pound — we’ll weigh your order and give you the exact total.',
  describe: (counts) => {
    const n = Object.values(counts).reduce((sum, c) => sum + c, 0)
    return `${n} ${n === 1 ? 'pack' : 'packs'}`
  },
  mailSubject: 'Pork order',
}
