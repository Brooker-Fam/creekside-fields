// Geese and ducks — sold as whole birds, priced by the pound. Backs the
// /geese-and-ducks page, its order form, and the home page teaser.
//
// Prices are mirrored in api/send-bird-order.ts (the order email), which is
// bundled separately and can't import from src — change both together.

export type BirdKind = 'goose' | 'duck'

export interface Bird {
  kind: BirdKind
  /** Card / form heading, e.g. "Geese". */
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

/** Most of one kind a single online order can request. */
export const MAX_BIRDS_PER_KIND = 10

export const BIRD_PHOTO = {
  src: '/farm-media/geese-and-ducks.jpg',
  alt: 'A flock of geese and ducks walking across a green pasture in front of two old wooden barns under a blue sky',
  caption: 'Our geese and ducks out on pasture by the barns',
} as const

/** "1 goose", "2 geese and 3 ducks", … */
export function describeBirds(counts: Record<BirdKind, number>): string {
  return BIRDS.filter((b) => counts[b.kind] > 0)
    .map((b) => `${counts[b.kind]} ${counts[b.kind] === 1 ? b.singular : b.plural}`)
    .join(' and ')
}
