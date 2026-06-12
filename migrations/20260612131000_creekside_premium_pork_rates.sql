-- Creekside Fields premium pork pricing, based on 18-month pasture-raised
-- heritage hogs and Eagle Bridge Custom Meat's current butcher pricing.
--
-- Assumption used for displayed ranges:
-- 285-315 lb hanging weight per whole hog, centered on a 300 lb planning weight.

UPDATE share_options SET
  rate_per_lb_hw_cents = CASE kind
    WHEN 'whole'   THEN 775
    WHEN 'half'    THEN 850
    WHEN 'quarter' THEN 925
    ELSE rate_per_lb_hw_cents
  END,
  deposit_cents = CASE kind
    WHEN 'whole'   THEN 30000
    WHEN 'half'    THEN 17500
    WHEN 'quarter' THEN 10000
    ELSE deposit_cents
  END,
  est_total_low_cents = CASE kind
    WHEN 'whole'   THEN 220875  -- 285 lb x $7.75
    WHEN 'half'    THEN 121125  -- 142.5 lb x $8.50
    WHEN 'quarter' THEN  65906  -- 71.25 lb x $9.25
    ELSE est_total_low_cents
  END,
  est_total_high_cents = CASE kind
    WHEN 'whole'   THEN 244125  -- 315 lb x $7.75
    WHEN 'half'    THEN 133875  -- 157.5 lb x $8.50
    WHEN 'quarter' THEN  72844  -- 78.75 lb x $9.25
    ELSE est_total_high_cents
  END
WHERE kind IN ('whole', 'half', 'quarter');
