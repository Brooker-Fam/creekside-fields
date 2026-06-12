-- Seed processors
INSERT INTO processors (name, address, phone, website, notes, distance_mi, display_order) VALUES
  ('Eagle Bridge Custom Meat & Smokehouse', '139 Center Rd, Eagle Bridge, NY 12057', NULL, NULL,
   'USDA-inspected slaughter, processing, and smokehouse. Family run since 2005. Handles pigs, cattle, sheep, and goats.',
   12.0, 1),
  ('Rut''s Ridge Farm', '132 Lick Spring Rd, Greenwich, NY 12834', '(518) 695-5364', NULL,
   'Family-owned custom meat processor and smokehouse in Greenwich. A+ BBB rated.',
   3.5, 2);

-- Seed two pigs (no names per request)
WITH pig1 AS (
  INSERT INTO animals (kind, breed, sex, dob, estimated_live_weight_lbs, ready_by,
                       headline, story, hero_image_url, photo_urls, tags, display_order)
  VALUES (
    'pig',
    'Gloucestershire Old Spots',
    'female',
    '2025-02-01',
    NULL,
    '2026-06-30',
    'The pasture wanderer.',
    'Born in February 2025 and raised slowly outdoors on our farm in Greenwich, NY. Heritage Gloucestershire Old Spots are a slow-grow breed known for richly marbled, deeply flavored pork. She has lived with pasture underfoot, woods nearby, fresh water, shelter, and daily care.',
    '/farm-media/pig-grazing.jpg',
    '["/farm-media/pig-grazing.jpg"]'::jsonb,
    '["heritage breed", "pasture-raised", "no antibiotics", "no hormones"]'::jsonb,
    1
  )
  RETURNING id
),
pig2 AS (
  INSERT INTO animals (kind, breed, sex, dob, estimated_live_weight_lbs, ready_by,
                       headline, story, hero_image_url, photo_urls, tags, display_order)
  VALUES (
    'pig',
    'Gloucestershire Old Spots',
    'female',
    '2025-02-01',
    NULL,
    '2026-06-30',
    'The careful forager.',
    'Same litter as the other one, same heritage breed, same pasture. Raised slowly with room to root, graze, nap in the shade, and settle into the rhythms of the farm. Beautifully marbled. Ready by end of June 2026.',
    '/farm-media/pig-feast.jpg',
    '["/farm-media/pig-feast.jpg"]'::jsonb,
    '["heritage breed", "pasture-raised", "no antibiotics", "no hormones"]'::jsonb,
    2
  )
  RETURNING id
)
-- Share options: 1 whole, 2 halves, 4 quarters per pig
INSERT INTO share_options (animal_id, kind, label, est_total_low_cents, est_total_high_cents, deposit_cents, status, rate_per_lb_hw_cents)
SELECT id, 'whole',   'Whole hog',     220875, 244125, 30000, 'available', 775 FROM pig1
UNION ALL SELECT id, 'half',    'Half hog #1',   121125, 133875, 17500, 'available', 850 FROM pig1
UNION ALL SELECT id, 'half',    'Half hog #2',   121125, 133875, 17500, 'available', 850 FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #1', 65906,  72844, 10000, 'available', 925 FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #2', 65906,  72844, 10000, 'available', 925 FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #3', 65906,  72844, 10000, 'available', 925 FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #4', 65906,  72844, 10000, 'available', 925 FROM pig1
UNION ALL SELECT id, 'whole',   'Whole hog',     220875, 244125, 30000, 'available', 775 FROM pig2
UNION ALL SELECT id, 'half',    'Half hog #1',   121125, 133875, 17500, 'available', 850 FROM pig2
UNION ALL SELECT id, 'half',    'Half hog #2',   121125, 133875, 17500, 'available', 850 FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #1', 65906,  72844, 10000, 'available', 925 FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #2', 65906,  72844, 10000, 'available', 925 FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #3', 65906,  72844, 10000, 'available', 925 FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #4', 65906,  72844, 10000, 'available', 925 FROM pig2;
