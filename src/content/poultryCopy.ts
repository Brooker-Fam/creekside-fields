// Geese and ducks — sold as whole birds, priced by the pound. Backs the
// /geese-and-ducks page and its order form, and the home page price list.

import type { OrderCounts, OrderFormCopy, OrderGroup } from './orders'

export type BirdKind = 'goose' | 'duck'

export interface Bird {
  kind: BirdKind
  /** Price-list heading, e.g. "Geese". */
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
    blurb: 'A big, rich bird and the classic holiday roast.',
  },
  {
    kind: 'duck',
    title: 'Ducks',
    singular: 'duck',
    plural: 'ducks',
    pricePerLb: 14,
    blurb: 'Smaller than a goose, with skin that roasts up golden and crisp.',
  },
]

export const BIRD_PHOTO = {
  src: '/farm-media/geese-and-ducks.jpg',
  /** 600 px wide copy for phones. */
  small: '/farm-media/geese-and-ducks-600.jpg',
  alt: 'A flock of geese and ducks walking across a green pasture in front of two old wooden barns under a blue sky',
  caption: 'The flock, heading somewhere important',
} as const

/** "1 goose", "2 geese and 3 ducks", … */
export function describeBirds(counts: OrderCounts): string {
  return BIRDS.filter((b) => (counts[b.kind] ?? 0) > 0)
    .map((b) => `${counts[b.kind]} ${counts[b.kind] === 1 ? b.singular : b.plural}`)
    .join(' and ')
}

/** The birds as one order-form group. */
export const BIRD_GROUPS: OrderGroup[] = [
  {
    id: 'birds',
    items: BIRDS.map((b) => ({
      id: b.kind,
      title: `Whole ${b.singular}`,
      pricePerLb: b.pricePerLb,
      detail: 'Priced by weight',
    })),
  },
]

export const BIRD_ORDER: OrderFormCopy = {
  kind: 'birds',
  emptyError: 'Pick at least one goose or duck first.',
  idleHint: 'Use the + buttons to add birds.',
  describe: describeBirds,
  mailSubject: 'Goose & duck order',
}
