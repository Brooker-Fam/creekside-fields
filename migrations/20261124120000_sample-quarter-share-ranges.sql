-- Share weights from a real sample quarter. Its packages added up to 44.07 lb
-- of take-home pork (not counting ham hocks, soup bones, or fat). Against the
-- two pigs' 420 lb and 474 lb hanging weights, that's a ~39% take-home yield
-- (the previous ranges assumed 65%), giving:
--   quarter   41–47 lb  → $410–$470
--   half      83–93 lb  → $830–$930
--   whole   166–187 lb  → $1,660–$1,870
-- Still $10 per pound of take-home pork.
--
-- The app shows these ranges from src/content/sharesCopy.ts (SHARE_PRICE_RANGE);
-- this keeps the database in sync for admin views and any direct reads.

UPDATE share_options SET
  est_total_low_cents = CASE kind
    WHEN 'whole'   THEN 166000  -- 166 lb × $10
    WHEN 'half'    THEN  83000  --  83 lb × $10
    WHEN 'quarter' THEN  41000  --  41 lb × $10
    ELSE est_total_low_cents
  END,
  est_total_high_cents = CASE kind
    WHEN 'whole'   THEN 187000  -- 187 lb × $10
    WHEN 'half'    THEN  93000  --  93 lb × $10
    WHEN 'quarter' THEN  47000  --  47 lb × $10
    ELSE est_total_high_cents
  END
WHERE kind IN ('whole', 'half', 'quarter');
