-- Per-share-kind pricing. Up to now `animals.rate_per_lb_hw_cents` was the
-- single per-animal rate that applied to every share, regardless of size.
-- Move the rate onto `share_options` so a whole / half / quarter of the same
-- animal can each have their own per-pound rate. Smaller shares cost more
-- per pound (standard pasture-pork practice — more per-customer overhead
-- on a smaller cut).

ALTER TABLE share_options ADD COLUMN rate_per_lb_hw_cents INT;

-- Seed defaults: $7.50 / $8.00 / $8.50 by kind.
-- Existing animals.rate_per_lb_hw_cents stays as a fallback for any share
-- that doesn't have its own rate yet (handled in app code).
UPDATE share_options SET rate_per_lb_hw_cents = CASE kind
  WHEN 'whole'   THEN 750
  WHEN 'half'    THEN 800
  WHEN 'quarter' THEN 850
  WHEN 'eighth'  THEN 900
  ELSE 750
END
WHERE rate_per_lb_hw_cents IS NULL;

-- Recompute estimated total ranges from the new rate. Both pigs were seeded
-- without an `estimated_live_weight_lbs`, so use a typical Gloucestershire
-- Old Spots band: ~250–300 lb live × ~70% dressing = ~175–210 lb HW per pig.
UPDATE share_options SET
  est_total_low_cents = CASE kind
    WHEN 'whole'   THEN 131300  --  175 lb × $7.50
    WHEN 'half'    THEN  70000  --  87.5 lb × $8.00
    WHEN 'quarter' THEN  37200  --  43.75 lb × $8.50
    ELSE est_total_low_cents
  END,
  est_total_high_cents = CASE kind
    WHEN 'whole'   THEN 157500  --  210 lb × $7.50
    WHEN 'half'    THEN  84000  --  105 lb × $8.00
    WHEN 'quarter' THEN  44600  --   52.5 lb × $8.50
    ELSE est_total_high_cents
  END
WHERE kind IN ('whole','half','quarter');
