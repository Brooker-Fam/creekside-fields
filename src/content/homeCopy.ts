import type { ShareKind } from '../lib/types'

export type PigShareKind = Extract<ShareKind, 'whole' | 'half' | 'quarter' | 'eighth'>

export const SHARE_COPY: Record<PigShareKind, { title: string; freezer: string; meat: string; note: string }> = {
  whole: {
    title: 'Whole pig',
    freezer: 'Best for a full chest freezer',
    meat: 'About 195 lb cut and wrapped at our planning weight',
    note: 'Most flexible cut sheet and the best value per pound.',
  },
  half: {
    title: 'Half pig',
    freezer: 'Fits many upright freezers',
    meat: 'About 95–100 lb cut and wrapped',
    note: 'A roomy family share with plenty of chops, roasts, bacon, sausage, and ground pork.',
  },
  quarter: {
    title: 'Quarter pig',
    freezer: 'Fits a freezer drawer or small chest freezer',
    meat: 'About 45–50 lb cut and wrapped',
    note: 'A friendly first share if you are new to buying meat this way.',
  },
  eighth: {
    title: 'Eighth pig',
    freezer: 'Fits a freezer shelf',
    meat: 'About 18–20 lb cut and wrapped',
    note: 'A small sampler share when available.',
  },
}

export const WORK_STEPS = [
  ['1', 'Reserve your share', 'Choose whole, half, or quarter and place a deposit so we can hold your spot.'],
  ['2', 'Choose cut preferences', 'Tell the butcher how you like your pork: chops, roasts, bacon, sausage, bones, lard, and extras.'],
  ['3', 'We raise them on pasture', 'The pigs root, wander, rest in shade, and help us turn care for animals into care for land.'],
  ['4', 'The processor prepares it', 'Eagle Bridge Custom Meat & Smokehouse handles slaughter, cut, wrap, smoking, and sausage options.'],
  ['5', 'Fill your freezer', 'Pick up from the processor or the farm, then come home with pork that has a place and a story.'],
] as const

export const VALUES = [
  ['Rotational grazing', 'Pasture and wooded edges are part of the work: movement, rest, manure, roots, and regrowth.'],
  ['Animal dignity', 'Clean water, shade, room to root, daily attention, and a slower heritage breed life.'],
  ['Soil health', 'Regenerative farming starts underground, where living soil turns care into future abundance.'],
  ['Family scale', 'Small batches, real names, muddy boots, kids underfoot, and no pretending we are a factory.'],
] as const

export const FAQS = [
  ['How much freezer space do I need?', 'Plan on a chest freezer for a whole share, an upright freezer for a half, and a roomy freezer drawer or small chest freezer for a quarter.'],
  ['What cuts are included?', 'Expect a mix of chops, roasts, bacon or belly, hams, sausage or ground pork, ribs, bones, lard, and optional offal depending on your cut sheet.'],
  ['How much meat will I get?', 'A whole pig is roughly 195 lb cut and wrapped at our current planning weight. A half is about 95–100 lb and a quarter about 45–50 lb.'],
  ['Do I pay the processor separately?', 'Our current share pricing is designed to include base processing. Specialty smoking, no-nitrate curing, links, hot dogs, and specialty sausage may add pass-through costs.'],
  ['Is the pork USDA processed?', 'The processor details will be confirmed before pickup. We will clearly explain whether a share is custom processed or USDA processed before final payment.'],
  ['Can I split a share with a friend?', 'Yes. A half or whole share is often lovely to split. Choose one person to reserve and pay, then divide the boxes together.'],
  ['When will it be ready?', 'We are planning for summer pickup. We will text reservation holders as soon as the processing date is locked in.'],
] as const

export const FARM_PIGS = [
  {
    name: 'Sushi',
    trait: 'The philosopher',
    blurb: 'Moves slowly, thinks deeply, and always finds the shadiest oak before anyone else.',
    emoji: '🐷',
  },
  {
    name: 'Nori',
    trait: 'The greeter',
    blurb: 'First to the fence when visitors arrive. Expert at converting apples into friendship.',
    emoji: '🐽',
  },
  {
    name: 'Carrot',
    trait: 'The adventurer',
    blurb: 'Roots where others won’t, splashes in the creek, and keeps the whole herd curious.',
    emoji: '🥕',
  },
] as const

export const PRICING_PLACEHOLDERS = [
  ['Price', 'Whole $7.75/lb HW, half $8.50/lb HW, quarter $9.25/lb HW.'],
  ['Deposit', 'Deposit holds your share; final balance is based on actual hanging weight.'],
  ['Processing', 'Base processing is included; specialty curing or links may add pass-through costs.'],
  ['Pickup', 'Summer pickup from Eagle Bridge Custom Meat & Smokehouse or the farm.'],
] as const
