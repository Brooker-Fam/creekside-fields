import type { ShareKind } from '../lib/types'

export type PigShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter' | 'eighth'>

/** Flat per-pound hanging-weight rate for every share. */
export const RATE = '$7.00 / lb hanging weight'

export const SHARE_COPY: Record<
  PigShareKind,
  { title: string; weight: string; price: string; meat: string; freezer: string; note: string }
> = {
  whole: {
    title: 'Whole hog',
    weight: '280–320 lb',
    price: '$1,960–$2,240',
    meat: '~180–210 lb of cut & wrapped pork',
    freezer: 'Fills a chest freezer',
    note: 'Best value per pound and the fullest say over your cut sheet.',
  },
  half: {
    title: 'Half hog',
    weight: '140–160 lb',
    price: '$980–$1,120',
    meat: '~90–105 lb of cut & wrapped pork',
    freezer: 'Fills an upright freezer',
    note: 'A generous family share — chops, roasts, bacon, sausage, and ground pork.',
  },
  quarter: {
    title: 'Quarter hog',
    weight: '70–80 lb',
    price: '$490–$560',
    meat: '~45–55 lb of cut & wrapped pork',
    freezer: 'Fits a freezer drawer or small chest',
    note: 'A wonderful place to start if this is your first hog share.',
  },
  eighth: {
    title: 'Eighth hog',
    weight: '35–40 lb',
    price: '$245–$280',
    meat: '~22–28 lb of cut & wrapped pork',
    freezer: 'Fits a freezer shelf',
    note: 'A small sampler when available.',
  },
}

export const WORK_STEPS = [
  ['I', 'Reserve your share', 'Place a deposit to hold your quarter, half, or whole hog for the season.'],
  ['II', 'We deliver to the processor', 'When the pigs finish, we bring them to Eagle Bridge Custom Meat, our USDA processor.'],
  ['III', 'Choose your cuts', 'The processor contacts you to talk through cuts, sausage, bacon, ham curing, and smoking.'],
  ['IV', 'Final price by hanging weight', 'Your share price is set by the actual hanging weight of your pig — billed at $7.00 / lb.'],
  ['V', 'Pay the processor & pick up', 'You settle processing directly with the processor and collect your pork when it is ready.'],
] as const

export const VALUES = [
  [
    'Pasture raised',
    'Our pigs spend their days on pasture, where they naturally forage for grasses, roots, insects, acorns, and other seasonal treats they discover while exploring. Their diet is supplemented with locally grown, freshly milled feed and nutritious recovered foods from a nearby school cafeteria that would otherwise go to waste.',
  ],
  [
    'Raised with love',
    'Small batches, daily attention, and a slower heritage breed life. We know each animal by name.',
  ],
  [
    'Regenerative care',
    'Movement, rest, and rooting that feeds the soil — farming as relationship, not extraction.',
  ],
  [
    'A family farm',
    'Kids, dogs, creek water, muddy boots. Real people you can text with questions.',
  ],
] as const

export const SEASONS = [
  [
    'Spring through fall',
    'Our pigs spend their days on pasture, where they naturally forage for grasses, roots, insects, acorns, and other seasonal treats they discover while exploring. Their diet is supplemented with locally grown, freshly milled feed and nutritious recovered foods from a nearby school cafeteria that would otherwise go to waste.',
  ],
  [
    'The winter months',
    'When the ground is frozen and pasture is dormant, our pigs continue to receive locally milled feed and recovered foods from the school cafeteria — keeping their diet varied while reducing food waste within our community.',
  ],
] as const

export const FARM_PIGS = [
  { name: 'Sushi', note: 'Gloucestershire Old Spot gilt · born February 2025' },
  { name: 'Nori', note: 'Gloucestershire Old Spot gilt · born February 2025' },
  { name: 'Carrot', note: 'Gloucestershire Old Spot gilt · born February 2025' },
] as const

export const FAQS = [
  [
    'What is hanging weight?',
    'Hanging weight is what your pig weighs after slaughter, once the head, blood, and organs are removed — before it is cut, trimmed, and packaged. It is the standard, fair way to price a whole-animal share, and it is the number your $7.00 / lb is based on. You take home a bit less than the hanging weight once everything is boned out and trimmed.',
  ],
  [
    'How much freezer space will I need?',
    'A rough guide: a quarter fits in a freezer drawer or small chest, a half fills an upright freezer, and a whole hog fills a chest freezer. We are happy to help you plan before you reserve.',
  ],
  [
    'How much meat will I actually take home?',
    'Plan on roughly 60–70% of the hanging weight as packaged, take-home pork — so about 45–55 lb from a quarter, 90–105 lb from a half, and 180–210 lb from a whole. Choosing more boneless cuts lowers the poundage a little; bone-in cuts raise it.',
  ],
  [
    'Can I choose my cuts?',
    'Yes — that is the best part. The processor walks you through your cut sheet: chop thickness, roasts, ribs, bacon and ham curing, smoking, sausage flavors, and what to grind. Easygoing? We can suggest a balanced standard order.',
  ],
  [
    'Why does processing cost vary?',
    'Each pig finishes at a slightly different weight, and every family chooses different options. Basic cutting and wrapping is modest; curing, smoking, and sausage-making add per-pound costs. You pay the processor directly for exactly the options you pick.',
  ],
] as const
