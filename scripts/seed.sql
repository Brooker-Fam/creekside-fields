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
    'Born on the farm in February 2025. Spent her whole life on grass, in the woods, and in the mud. Heritage Gloucestershire Old Spots are a slow-grow breed known for richly marbled, deeply flavored pork — they''re sometimes called the "orchard pig" because they were traditionally raised under fruit trees, cleaning up the windfalls. This one has done plenty of that, plus a year of cafeteria leftovers from the local school. Pasture-raised, never grain-finished in a barn.',
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
    'The school-lunch enthusiast.',
    'Same litter as the other one, same heritage breed, same pasture — but a noticeably bigger appetite for the school cafeteria leftovers that come our way. Mac and cheese, mashed potatoes, leftover pizza ends, the lot. Photogenic in a feed trough. Beautifully marbled. Ready by end of June 2026.',
    '/farm-media/pig-feast.jpg',
    '["/farm-media/pig-feast.jpg"]'::jsonb,
    '["heritage breed", "pasture-raised", "no antibiotics", "no hormones"]'::jsonb,
    2
  )
  RETURNING id
)
-- Share options: 1 whole, 2 halves, 4 quarters per pig
INSERT INTO share_options (animal_id, kind, label, est_total_low_cents, est_total_high_cents, deposit_cents, status)
SELECT id, 'whole',   'Whole hog',     110000, 150000, 30000, 'available' FROM pig1
UNION ALL SELECT id, 'half',    'Half hog #1',    60000,  80000, 20000, 'available' FROM pig1
UNION ALL SELECT id, 'half',    'Half hog #2',    60000,  80000, 20000, 'available' FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #1', 35000,  45000, 12500, 'available' FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #2', 35000,  45000, 12500, 'available' FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #3', 35000,  45000, 12500, 'available' FROM pig1
UNION ALL SELECT id, 'quarter', 'Quarter hog #4', 35000,  45000, 12500, 'available' FROM pig1
UNION ALL SELECT id, 'whole',   'Whole hog',     115000, 155000, 30000, 'available' FROM pig2
UNION ALL SELECT id, 'half',    'Half hog #1',    62000,  82000, 20000, 'available' FROM pig2
UNION ALL SELECT id, 'half',    'Half hog #2',    62000,  82000, 20000, 'available' FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #1', 36000,  46000, 12500, 'available' FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #2', 36000,  46000, 12500, 'available' FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #3', 36000,  46000, 12500, 'available' FROM pig2
UNION ALL SELECT id, 'quarter', 'Quarter hog #4', 36000,  46000, 12500, 'available' FROM pig2;
