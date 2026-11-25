// Home page copy: how ordering works and the FAQ, plus the season notes on the
// Our pigs page. Share sizes and prices live in `sharesCopy.ts`; geese and
// ducks in `poultryCopy.ts`.

export const WORK_STEPS = [
  ['i', 'Pick what you’d like', 'A pig share, a few cuts, or a whole goose or duck. Every price is on the site.'],
  ['ii', 'Send us the order', 'It’s a short form, and you won’t pay anything online. You’ll get a copy by email.'],
  ['iii', 'We write back', 'We weigh everything, send your total, and set a pickup time with you.'],
  ['iv', 'Come to the farm', 'Bring a cooler or a few boxes, and take it home to your freezer.'],
] as const

export const SEASONS = [
  [
    'Spring through fall',
    'Our pigs are out on pasture, grazing and digging for roots, bugs and acorns. They also get locally milled feed and leftovers from a nearby school cafeteria.',
  ],
  [
    'Winter',
    'Once the ground freezes there’s not much to dig for, so it’s locally milled feed and the school’s leftovers until spring.',
  ],
] as const

export const FAQS = [
  [
    'What’s a pig share?',
    'A whole pig, or a half or quarter of one, raised here on our farm and already cut and wrapped. It’s $10 a pound for the pork you take home.',
  ],
  [
    'Can I choose my cuts?',
    'Shares come as a set mix, so there’s nothing to pick. If you’d rather choose, buy cuts by the pack instead.',
  ],
  [
    'How do I pay?',
    'Not on the website. Everything is priced by the pound, so once we’ve weighed your order we’ll email you the total. You can pay by check, Venmo or Zelle.',
  ],
  [
    'Do you deliver?',
    'Not right now. Everything is picked up at our farm, 49 Clarks Mills Rd in Greenwich, at a time we set together.',
  ],
  [
    'How much freezer space will I need?',
    'A quarter share fits in most fridge freezers. A half fits in a small chest freezer, and a whole needs a chest or upright freezer.',
  ],
  [
    'When can I pick up?',
    'Now. The pork is cut, wrapped and in our freezer, so send your order and we’ll set a time.',
  ],
] as const
