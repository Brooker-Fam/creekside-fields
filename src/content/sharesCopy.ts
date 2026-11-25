import type { ShareKind } from '../lib/types'
import type { OrderCounts, OrderFormCopy, OrderGroup, OrderItem } from './orders'

/** The three pork-share sizes offered on the Pork page. */
export type PorkShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter'>

export interface ShareTier {
  kind: PorkShareKind
  title: string
  /** e.g. "41–47 lb" */
  takeHome: string
  price: string
  low: number
  high: number
  /** Short freezer-space guide. */
  freezer: string
}

// Keeps a range like "$410–$470" from breaking across lines.
const NB = '⁠'

/** Weights come from a real sample quarter (44 lb); shares are $10/lb of take-home pork. */
export const SHARE_TIERS: ShareTier[] = [
  { kind: 'quarter', title: 'Quarter share', takeHome: '41–47 lb', price: '$410–$470', low: 410, high: 470, freezer: 'Fits in most fridge freezers' },
  { kind: 'half', title: 'Half share', takeHome: '83–93 lb', price: '$830–$930', low: 830, high: 930, freezer: 'Fits in a small chest freezer' },
  { kind: 'whole', title: 'Whole share', takeHome: '166–187 lb', price: '$1,660–$1,870', low: 1660, high: 1870, freezer: 'Needs a chest or upright freezer' },
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
  detail: `About ${t.takeHome.replace('–', `–${NB}`)} · ${t.price.replace('–', `${NB}–${NB}`)}`,
  note: t.freezer,
  estimate: [t.low, t.high],
}))

/**
 * The cuts we have, sold individually on the Pork page. Pack sizes and the
 * per-pack estimates come from a sample quarter share's packages; prices come
 * from Nov 2026 research on pasture-raised pork prices (upstate NY farmers
 * markets, Northeast farms, USDA). Mark a cut `soldOut: true` to take it off
 * the order form until it's back.
 */
export const PORK_CUTS: OrderItem[] = [
  { id: 'chops', title: 'Boneless pork chops', pricePerLb: 15, detail: 'About 1–2½ lb packs', estimate: [26, 26] },
  { id: 'ribs', title: 'Ribs', pricePerLb: 10, detail: 'About 3½ lb racks', estimate: [37, 37], soldOut: true },
  { id: 'boston-butt', title: 'Boston butt', pricePerLb: 11, detail: 'About 5 lb roasts', estimate: [57, 57] },
  { id: 'bacon', title: 'Bacon', pricePerLb: 15, detail: 'About 1 lb packs', estimate: [16, 16] },
  { id: 'ham-steak', title: 'Smoked ham steak', pricePerLb: 11, detail: 'About 2 lb packs', estimate: [23, 23] },
  { id: 'sliced-ham', title: 'Smoked sliced ham', pricePerLb: 12, detail: 'About 1 lb packs', estimate: [13, 13] },
  { id: 'breakfast-sausage', title: 'Breakfast sausage', pricePerLb: 11, detail: 'Ground, about 1 lb packs', estimate: [11, 11] },
  { id: 'sweet-italian', title: 'Sweet Italian sausage', pricePerLb: 11, detail: 'Ground, about 1 lb packs', estimate: [11, 11] },
  { id: 'bratwurst', title: 'Bratwurst links', pricePerLb: 12, detail: 'About 1–1½ lb packs', estimate: [14, 14] },
  { id: 'ground-pork', title: 'Ground pork', pricePerLb: 10, detail: 'About 1 lb packs', estimate: [10, 10] },
  { id: 'ham-hocks', title: 'Ham hocks', pricePerLb: 5, detail: 'Fresh, not smoked' },
  { id: 'soup-bones', title: 'Soup bones', pricePerLb: 4, detail: 'For broth and stock' },
  { id: 'lard-fat', title: 'Pork fat for lard', pricePerLb: 4, detail: 'For rendering your own lard' },
]

/** One form for all the pork: shares on top, cuts below. */
export const PORK_GROUPS: OrderGroup[] = [
  {
    id: 'share-options',
    title: 'Pig shares',
    note: '$10 a pound of take-home pork. A recent quarter share came with 6 packs of bacon, 5 of chops, 5 of brats, 5 of ground pork, 3 of breakfast sausage, 2 of sweet Italian, 2 of sliced ham, a ham steak and a Boston butt.',
    items: SHARE_ITEMS,
  },
  {
    id: 'cuts',
    title: 'Individual cuts',
    note: 'Priced by the pound. Pack weights are approximate.',
    items: PORK_CUTS,
  },
]

const SHARE_KINDS = new Set(SHARE_TIERS.map((t) => t.kind as string))

/** "1 quarter share and 3 packs", "2 packs", … */
function describePork(counts: OrderCounts): string {
  const shares = SHARE_TIERS.filter((t) => (counts[t.kind] ?? 0) > 0).map(
    (t) => `${counts[t.kind]} ${t.kind} ${counts[t.kind] === 1 ? 'share' : 'shares'}`,
  )
  const packs = Object.entries(counts)
    .filter(([id]) => !SHARE_KINDS.has(id))
    .reduce((sum, [, n]) => sum + n, 0)
  const parts = [...shares, ...(packs ? [`${packs} ${packs === 1 ? 'pack' : 'packs'}`] : [])]
  return parts.length > 1 ? `${parts.slice(0, -1).join(', ')} and ${parts[parts.length - 1]}` : (parts[0] ?? '')
}

export const PORK_ORDER: OrderFormCopy = {
  kind: 'pork',
  emptyError: 'Pick a share or a few cuts first.',
  idleHint: 'Use the + buttons to add a share or a few packs.',
  describe: describePork,
  mailSubject: 'Pork order',
}
