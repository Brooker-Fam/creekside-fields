import type { ShareKind } from '../lib/types'

/** The three pork-share sizes offered on the dedicated shares page. */
export type PorkShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter'>

export interface ShareTier {
  kind: PorkShareKind
  title: string
  takeHome: string
  price: string
  freezer: string
  cta: string
  featured?: boolean
}

export const SHARE_TIERS: ShareTier[] = [
  {
    kind: 'quarter',
    title: 'Quarter pork share',
    takeHome: '45–60 pounds',
    price: '$650–$775',
    freezer: 'Fits a freezer drawer or a small chest freezer.',
    cta: 'Reserve a quarter share',
  },
  {
    kind: 'half',
    title: 'Half pork share',
    takeHome: '90–120 pounds',
    price: '$1,300–$1,550',
    freezer: 'Fills a standard upright freezer.',
    cta: 'Reserve a half share',
  },
  {
    kind: 'whole',
    title: 'Whole pork share',
    takeHome: '180–240 pounds',
    price: '$2,600–$3,100',
    freezer: 'Fills a chest freezer.',
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
  'Ground breakfast sausage',
  'Ground sweet Italian sausage',
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

export interface FaqGroupAnswer {
  intro?: string
  items: { label: string; body: string }[]
}

/** A FAQ answer is either a paragraph or an intro + a labelled list. */
export type FaqAnswer = string | FaqGroupAnswer

export const SHARE_FAQS: ReadonlyArray<readonly [string, FaqAnswer]> = [
  [
    'Why are prices listed as a range?',
    'Our pigs are still growing, so we cannot know each animal’s exact finished weight until it is processed. The ranges give you a realistic window to plan around. Once processing weights are confirmed, we will share your final price before pickup — no surprises.',
  ],
  [
    'How much freezer space will I need?',
    {
      intro: 'As a general rule:',
      items: [
        {
          label: 'Quarter share',
          body: 'Approximately 1–2 cubic feet of freezer space. This will fit in the freezer compartment of many refrigerators — about the space of 2–3 grocery bags.',
        },
        {
          label: 'Half share',
          body: 'Approximately 3–4 cubic feet of freezer space. A small chest freezer, or a portion of a larger upright freezer, is usually enough — about the space of 4–6 grocery bags.',
        },
        {
          label: 'Whole share',
          body: 'Approximately 6–8 cubic feet of freezer space. Most customers store a whole share in a chest freezer or a dedicated upright freezer — about the space of 8–12 grocery bags.',
        },
      ],
    },
  ],
  [
    'Can I choose my cuts?',
    'We take care of all the processing decisions for you. Each share is a thoughtfully curated assortment chosen to give you a balanced, versatile variety. If you have a serious allergy or dietary need, just let us know and we will do our best to accommodate it.',
  ],
  [
    'Are all products nitrate-free?',
    'Yes. Every cured and smoked product in our shares — including our bacon and ham — is prepared with no added nitrates. We believe great pork does not need unnecessary additives.',
  ],
  [
    'When will pork be ready for pickup?',
    'Our pigs are raised for more than a year before harvest, so shares become available seasonally. Once your pig has been processed, we confirm the exact pickup date and place and reach out to you directly to arrange it.',
  ],
]
