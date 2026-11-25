// Geese and ducks — sold as whole birds, priced by the pound. Backs the
// /geese-and-ducks page, its order form, and the home page teaser.

import type { OrderCounts, OrderFormCopy, OrderItem } from './orders'

export type BirdKind = 'goose' | 'duck'

export interface Bird {
  kind: BirdKind
  /** Card heading, e.g. "Geese". */
  title: string
  singular: string
  plural: string
  /** Price per pound, in whole dollars. */
  pricePerLb: number
  blurb: string
}

export const BIRDS: Bird[] = [
  {
    kind: 'goose',
    title: 'Geese',
    singular: 'goose',
    plural: 'geese',
    pricePerLb: 16,
    blurb: 'Rich, deeply flavored meat — the classic roast for a holiday table.',
  },
  {
    kind: 'duck',
    title: 'Ducks',
    singular: 'duck',
    plural: 'ducks',
    pricePerLb: 14,
    blurb: 'Tender, flavorful meat under skin that roasts up golden and crisp.',
  },
]

export const BIRD_PHOTO = {
  src: '/farm-media/geese-and-ducks.jpg',
  /** 600 px wide copy for phones. */
  small: '/farm-media/geese-and-ducks-600.jpg',
  alt: 'A flock of geese and ducks walking across a green pasture in front of two old wooden barns under a blue sky',
  caption: 'Our geese and ducks out on pasture by the barns',
} as const

/** "1 goose", "2 geese and 3 ducks", … */
export function describeBirds(counts: OrderCounts): string {
  return BIRDS.filter((b) => (counts[b.kind] ?? 0) > 0)
    .map((b) => `${counts[b.kind]} ${counts[b.kind] === 1 ? b.singular : b.plural}`)
    .join(' and ')
}

/** The birds as order-form lines. */
export const BIRD_ITEMS: OrderItem[] = BIRDS.map((b) => ({
  id: b.kind,
  title: `Whole ${b.singular}`,
  pricePerLb: b.pricePerLb,
  detail: '',
}))

export const BIRD_ORDER: OrderFormCopy = {
  kind: 'birds',
  legend: 'Your birds',
  emptyError: 'Choose at least one goose or duck.',
  idleHint: 'Whole birds, priced by weight.',
  describe: describeBirds,
  mailSubject: 'Goose & duck order',
}
