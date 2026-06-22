-- USDA-inspected processing: the signed bill of sale is no longer required.
-- The reservation flow is now a simple confirmation (no pre-slaughter live-animal
-- transfer, no signature). Tear down the signature machinery.

-- 1. The RPC anon customers used to attach a signature to their reservation.
DROP FUNCTION IF EXISTS sign_reservation(UUID, TEXT, TEXT);

-- 2. The signature columns on reservations.
ALTER TABLE reservations DROP COLUMN IF EXISTS signature_url;
ALTER TABLE reservations DROP COLUMN IF EXISTS signature_key;
ALTER TABLE reservations DROP COLUMN IF EXISTS bill_of_sale_signed_at;

-- 3. RLS policies that opened the signatures storage bucket to anon read/insert.
DROP POLICY IF EXISTS signatures_public_read ON storage.objects;
DROP POLICY IF EXISTS signatures_public_insert ON storage.objects;
DROP POLICY IF EXISTS signatures_admin_manage ON storage.objects;

-- NOTE: the `signatures` storage bucket itself (and any PNGs already in it) must
-- be deleted manually from the InsForge dashboard / storage API — it isn't
-- removable via SQL here.
