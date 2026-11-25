import type { ShareKind } from '../lib/types'
import type { OrderFormCopy, OrderItem } from './orders'

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
    title: 'Quarter pig share',
    takeHome: '41–47 pounds',
    price: '$410–$470',
    freezer:
      'About 1 cubic foot of freezer space. This will fit in the freezer compartment of most refrigerators — about the space of 1–2 grocery bags.',
    cta: 'Reserve a quarter pig share',
  },
  {
    kind: 'half',
    title: 'Half pig share',
    takeHome: '83–93 pounds',
    price: '$830–$930',
    freezer:
      'About 2–3 cubic feet of freezer space. A small chest freezer, or part of an upright freezer, is plenty — about the space of 3 grocery bags.',
    cta: 'Reserve a half pig share',
  },
  {
    kind: 'whole',
    title: 'Whole pig share',
    takeHome: '166–187 pounds',
    price: '$1,660–$1,870',
    freezer:
      'About 4–5 cubic feet of freezer space. A small chest freezer or a dedicated upright freezer works well — about the space of 5–7 grocery bags.',
    cta: 'Reserve a whole pig share',
    featured: true,
  },
]

/**
 * Estimated price range by share kind — the single source of truth shown
 * across the site (shares page, reserve flow, confirmation, emails). Final
 * price is a flat amount set per reservation once the pig is processed.
 */
export const SHARE_PRICE_RANGE: Record<string, string> = Object.fromEntries(
  SHARE_TIERS.map((t) => [t.kind, t.price]),
)

/**
 * The cuts we have, sold individually on the Pork page and listed as what a
 * share may include. Pack sizes come from a sample quarter share's packages.
 * Mark a cut `soldOut: true` to take it off the order form until it's back.
 */
export const PORK_CUTS: OrderItem[] = [
  { id: 'chops', title: 'Boneless pork chops', detail: 'About 1–2½ lb packs' },
  { id: 'ribs', title: 'Ribs', detail: 'About 3½ lb racks', soldOut: true },
  { id: 'boston-butt', title: 'Boston butt', detail: 'About 5 lb roasts' },
  { id: 'bacon', title: 'Bacon', detail: 'About 1 lb packs' },
  { id: 'ham-steak', title: 'Smoked ham steak', detail: 'About 2 lb packs' },
  { id: 'sliced-ham', title: 'Smoked sliced ham', detail: 'About 1 lb packs' },
  { id: 'breakfast-sausage', title: 'Ground breakfast sausage', detail: 'About 1 lb packs' },
  { id: 'sweet-italian', title: 'Ground sweet Italian sausage', detail: 'About 1 lb packs' },
  { id: 'bratwurst', title: 'Bratwurst links', detail: 'About 1–1½ lb packs' },
  { id: 'ground-pork', title: 'Ground pork', detail: 'About 1 lb packs' },
  { id: 'ham-hocks', title: 'Ham hocks', detail: 'Fresh, not smoked — for soups and stock' },
  { id: 'soup-bones', title: 'Soup bones', detail: 'For broth and stock' },
  { id: 'lard-fat', title: 'Pork fat for lard', detail: 'For rendering your own lard' },
]

/** A representative — not guaranteed — list of cuts a share may include. */
export const POSSIBLE_CUTS = PORK_CUTS.map((c) => c.title)

export const PORK_ORDER: OrderFormCopy = {
  kind: 'pork',
  legend: 'Your cuts',
  emptyError: 'Choose at least one cut.',
  idleHint: 'Priced by weight — we’ll weigh your order at pickup.',
  describe: (counts) => {
    const n = Object.values(counts).reduce((sum, c) => sum + c, 0)
    return `${n} ${n === 1 ? 'pack' : 'packs'}`
  },
  selectedHint: 'we’ll weigh your order and give you the total at pickup.',
  pickup: 'Orders are picked up from our farm in Greenwich, NY — we’ll reach out to arrange a time.',
  submit: 'Send my order',
  finePrint: 'We’ll email your confirmation right away, then follow up to arrange pickup.',
  thanksTail: 'we’ll be in touch to arrange pickup. We’ll weigh your order and give you the total then.',
  mailSubject: 'Pork order',
}

export const SHARE_STEPS: ReadonlyArray<readonly [string, string, string]> = [
  [
    '1',
    'Choose your share size',
    'Pick the quarter, half, or whole pig share that best fits your household and your freezer.',
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
    'Pick up your pig share',
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
      items: SHARE_TIERS.map((t) => ({ label: t.title, body: t.freezer })),
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
