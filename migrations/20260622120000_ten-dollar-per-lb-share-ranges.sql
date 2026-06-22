-- Flat $10 / lb of take-home pork. The two pigs come in at 420 lb and 474 lb
-- hanging weight; take-home meat is ~65% of hanging weight, giving the share
-- weight ranges below. The price is simply that take-home weight × $10/lb:
--   quarter  68–77 lb   → $680–$770
--   half    137–154 lb  → $1,370–$1,540
--   whole   273–308 lb  → $2,730–$3,080
--
-- The app shows these ranges from src/content/sharesCopy.ts (SHARE_PRICE_RANGE);
-- this keeps the database in sync for admin views and any direct reads.

UPDATE share_options SET
  est_total_low_cents = CASE kind
    WHEN 'whole'   THEN 273000  -- 273 lb × $10
    WHEN 'half'    THEN 137000  -- 137 lb × $10
    WHEN 'quarter' THEN  68000  --  68 lb × $10
    ELSE est_total_low_cents
  END,
  est_total_high_cents = CASE kind
    WHEN 'whole'   THEN 308000  -- 308 lb × $10
    WHEN 'half'    THEN 154000  -- 154 lb × $10
    WHEN 'quarter' THEN  77000  --  77 lb × $10
    ELSE est_total_high_cents
  END
WHERE kind IN ('whole', 'half', 'quarter');
