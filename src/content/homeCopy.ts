import type { ShareKind } from '../lib/types'

export type PigShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter' | 'eighth'>

export const SHARE_COPY: Record<PigShareKind, { title: string; freezer: string; meat: string; note: string }> = {
  whole: {
    title: 'Whole share',
    freezer: 'Chest freezer recommended',
    meat: '~195 lb cut and wrapped',
    note: 'Best value per pound and the most flexibility on your cut sheet.',
  },
  half: {
    title: 'Half share',
    freezer: 'Upright freezer',
    meat: '~95–100 lb cut and wrapped',
    note: 'A generous family share — chops, roasts, bacon, sausage, and ground pork.',
  },
  quarter: {
    title: 'Quarter share',
    freezer: 'Freezer drawer or small chest',
    meat: '~45–50 lb cut and wrapped',
    note: 'A wonderful place to start if this is your first hog share.',
  },
  eighth: {
    title: 'Eighth share',
    freezer: 'Freezer shelf',
    meat: '~18–20 lb cut and wrapped',
    note: 'A small sampler when available.',
  },
}

export const WORK_STEPS = [
  ['01', 'Reserve your share', 'Choose whole, half, or quarter and place a deposit to hold your spot.'],
  ['02', 'Choose your cuts', 'Tell us how you like your pork — chops, roasts, bacon, sausage, and more.'],
  ['03', 'We raise them on pasture', 'Heritage Old Spots on grass, woods, and daily care — slow-grown, with room to root and roam.'],
  ['04', 'Processing', 'Eagle Bridge Custom Meat & Smokehouse handles slaughter, cut, wrap, and smoking.'],
  ['05', 'Pickup', 'Collect from the processor or the farm when your share is ready.'],
] as const

export const VALUES = [
  ['Pasture raised', 'Our pigs live outdoors with access to grass, woods, shade, and clean water — not concrete and confinement.'],
  ['Raised with love', 'Small batches, daily attention, and a slower heritage breed life. We know each animal by name.'],
  ['Regenerative care', 'Movement, rest, and rooting that feeds the soil — farming as relationship, not extraction.'],
  ['Family farm', 'Kids, dogs, creek water, muddy boots. Real people you can text with questions.'],
] as const

export const FAQS = [
  ['How much freezer space do I need?', 'Plan on a chest freezer for a whole share, an upright freezer for a half, and a roomy drawer or small chest freezer for a quarter.'],
  ['What cuts are included?', 'A mix of chops, roasts, bacon or belly, hams, sausage or ground pork, ribs, bones, lard, and optional offal — depending on your cut sheet.'],
  ['How much meat will I get?', 'Roughly 195 lb (whole), 95–100 lb (half), or 45–50 lb (quarter) cut and wrapped at our current planning weight.'],
  ['Do I pay the processor separately?', 'Base processing is included in our share pricing. Specialty smoking, curing, links, or sausage may add pass-through costs.'],
  ['Is the pork USDA processed?', 'We will confirm processing details before pickup and explain everything clearly before final payment.'],
  ['Can I split a share with a friend?', 'Yes — a half or whole share splits well. One person reserves and pays; you divide the boxes together.'],
  ['When will it be ready?', 'We are planning for summer pickup and will text reservation holders as soon as the processing date is set.'],
] as const

export const FARM_PIGS = [
  {
    name: 'Sushi',
    note: 'Gloucestershire Old Spot gilt · born February 2025',
  },
  {
    name: 'Nori',
    note: 'Gloucestershire Old Spot gilt · born February 2025',
  },
  {
    name: 'Carrot',
    note: 'Gloucestershire Old Spot gilt · born February 2025',
  },
] as const

export const PRICING_PLACEHOLDERS = [
  ['Price', 'Whole $7.75/lb HW · half $8.50/lb · quarter $9.25/lb hanging weight.'],
  ['Deposit', 'Holds your share. Final total based on actual hanging weight.'],
  ['Processing', 'Base processing included. Specialty items may add pass-through costs.'],
  ['Pickup', 'Summer pickup from Eagle Bridge Custom Meat & Smokehouse or the farm.'],
] as const
