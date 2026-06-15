import type { ShareKind } from '../lib/types'

/** The three pork-share sizes offered on the dedicated shares page. */
export type PorkShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter'>

export interface ShareTier {
  kind: PorkShareKind
  title: string
  hanging: string
  takeHome: string
  price: string
  bestFor: string
  cta: string
  featured?: boolean
}

export const SHARE_TIERS: ShareTier[] = [
  {
    kind: 'quarter',
    title: 'Quarter pork share',
    hanging: '70–80 pounds',
    takeHome: '45–60 pounds',
    price: '$650–$775',
    bestFor:
      'Best for individuals, couples, or families wanting to try locally raised pork without filling an entire freezer.',
    cta: 'Reserve a quarter share',
  },
  {
    kind: 'half',
    title: 'Half pork share',
    hanging: '140–160 pounds',
    takeHome: '90–120 pounds',
    price: '$1,300–$1,550',
    bestFor:
      'A great option for families who cook regularly and want a variety of premium pork cuts throughout the year.',
    cta: 'Reserve a half share',
  },
  {
    kind: 'whole',
    title: 'Whole pork share',
    hanging: '280–320 pounds',
    takeHome: '180–240 pounds',
    price: '$2,600–$3,100',
    bestFor:
      'The best value for families who eat a lot of pork or want to split a share with relatives or friends.',
    cta: 'Reserve a whole share',
    featured: true,
  },
]

/**
 * Estimated price range by share kind — the single source of truth shown
 * across the site (shares page, reserve flow, bill of sale, emails). Final
 * price is a flat amount set per reservation once the pig is processed.
 */
export const SHARE_PRICE_RANGE: Record<string, string> = Object.fromEntries(
  SHARE_TIERS.map((t) => [t.kind, t.price]),
)

/** A representative — not guaranteed — list of cuts a share may include. */
export const POSSIBLE_CUTS = [
  'Bacon',
  'Ham',
  'Pork chops',
  'Tenderloin',
  'Roasts',
  'Ribs',
  'Bratwurst links',
  'Breakfast sausage patties',
  'Ground pork',
] as const

export const SHARE_STEPS: ReadonlyArray<readonly [string, string, string]> = [
  [
    '1',
    'Choose your share size',
    'Pick the quarter, half, or whole share that best fits your household and your freezer.',
  ],
  [
    '2',
    'Reserve your share with a deposit',
    'A small deposit holds your share for the season. We follow up with everything you need to know.',
  ],
  [
    '3',
    'We work with our processor',
    'We work directly with our USDA-certified processor and handle every processing decision for you.',
  ],
  [
    '4',
    'We confirm pricing and pickup',
    'Once processing is complete, we confirm your final pricing and arrange a pickup date and place.',
  ],
  [
    '5',
    'Pick up your pork share',
    'Collect your share and enjoy premium pasture-raised pork raised right here in Washington County.',
  ],
] as const

export const SHARE_FAQS: ReadonlyArray<readonly [string, string]> = [
  [
    'Why are prices listed as a range?',
    'Our pigs are still growing, so we cannot know each animal’s exact finished weight until it is processed. The ranges give you a realistic window to plan around. Once processing weights are confirmed, we will share your final price before pickup — no surprises.',
  ],
  [
    'How much freezer space will I need?',
    'As a rough guide: a quarter share fits in a freezer drawer or a small chest freezer, a half share fills a standard upright freezer, and a whole share fills a chest freezer. We are always happy to help you plan before you reserve.',
  ],
  [
    'Can I choose my cuts?',
    'There is no cut sheet to fill out — we take care of all the processing decisions for you. Each share is a thoughtfully curated assortment chosen to give you a balanced, versatile variety. If you have a serious allergy or dietary need, just let us know and we will do our best to accommodate it.',
  ],
  [
    'Are all products nitrate-free?',
    'Yes. Every cured and smoked product in our shares — including our bacon and ham — is prepared with no added nitrates. We believe great pork does not need unnecessary additives.',
  ],
  [
    'When will pork be ready for pickup?',
    'Our pigs are raised for more than a year before harvest, so shares become available seasonally. Once your pig has been processed, we confirm the exact pickup date and place and reach out to you directly to arrange it.',
  ],
] as const
