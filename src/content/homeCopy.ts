// Pork-share sizing, pricing, and cut copy now lives in `sharesCopy.ts`,
// which backs the dedicated /shares page. This file holds the Home page's
// farm-story content only.

export const WORK_STEPS = [
  ['1', 'Reserve your share', 'Place a deposit to hold your quarter, half, or whole share.'],
  ['2', 'We raise and process', 'We raise our pigs with care and deliver them to our USDA-certified processor.'],
  ['3', 'We confirm your price', 'Once processing weights are known, we will contact you with your final share price.'],
  ['4', 'Pick up your pork', 'Pick up your share and fill your freezer.'],
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
    'What is a pork share?',
    'A pork share is a portion of one of our pasture-raised pigs — a quarter, half, or whole — that comes to you as a curated assortment of cuts. You reserve it with a deposit and pick it up once your pig is processed.',
  ],
  [
    'Can I choose my cuts?',
    'We curate a balanced, versatile assortment for every share, so you do not have to pick individual cuts. The cuts we list are what we expect to include, but because these are real animals, the exact cuts and quantities can vary slightly from share to share.',
  ],
  [
    'How is my final price set?',
    'Each share is a flat price. We list an estimated range up front, then confirm your final price once your pig is processed — based on the actual weight of the meat and the cuts included. The deposit is credited toward it; the balance is due at pickup.',
  ],
  [
    'How much freezer space will I need?',
    'A rough guide: a quarter fits in a freezer drawer or small chest, a half fills an upright freezer, and a whole share fills a chest freezer. We are happy to help you plan before you reserve.',
  ],
  [
    'When will my pork be ready?',
    'Our pigs are raised for more than a year, so shares are seasonal. Once your pig is processed, we confirm the pickup date and place and reach out to arrange it with you directly.',
  ],
] as const
