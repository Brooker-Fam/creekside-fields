-- Customer signature on the bill of sale (uploaded to the signatures bucket).
ALTER TABLE reservations ADD COLUMN signature_url TEXT;
ALTER TABLE reservations ADD COLUMN signature_key TEXT;

-- RLS for the signatures storage bucket:
-- - Public read (so the signed BoS image renders in emails / printable views)
-- - Anon insert into the bucket (customer is unauthenticated when signing)
-- - Admin can manage (read/delete) any object
CREATE POLICY signatures_public_read ON storage.objects
  FOR SELECT USING (bucket = 'signatures');

CREATE POLICY signatures_public_insert ON storage.objects
  FOR INSERT WITH CHECK (bucket = 'signatures');

CREATE POLICY signatures_admin_manage ON storage.objects
  FOR ALL USING (bucket = 'signatures' AND is_admin())
  WITH CHECK (bucket = 'signatures' AND is_admin());
