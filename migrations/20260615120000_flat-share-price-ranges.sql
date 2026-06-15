-- Flat per-share pricing. Customers no longer choose cuts or pay a per-pound
-- hanging-weight rate — each share is a flat price, shown up front as an
-- estimated range and finalized once the pig is processed (based on the actual
-- weight of the meat and the cuts included). Align the stored estimate ranges
-- with the published ranges on the site:
--   quarter $650–$775 · half $1,300–$1,550 · whole $2,600–$3,100
--
-- The app shows these ranges from src/content/sharesCopy.ts (SHARE_PRICE_RANGE);
-- this keeps the database in sync for admin views and any direct reads.

UPDATE share_options SET
  est_total_low_cents = CASE kind
    WHEN 'whole'   THEN 260000
    WHEN 'half'    THEN 130000
    WHEN 'quarter' THEN  65000
    ELSE est_total_low_cents
  END,
  est_total_high_cents = CASE kind
    WHEN 'whole'   THEN 310000
    WHEN 'half'    THEN 155000
    WHEN 'quarter' THEN  77500
    ELSE est_total_high_cents
  END
WHERE kind IN ('whole', 'half', 'quarter');
