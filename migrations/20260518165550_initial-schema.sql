-- Creekside Fields: pig/livestock share marketplace
-- Tables: admin_users, animals, processors, share_options, reservations

-- ---------------------------------------------------------------
-- Admin allowlist (links to auth.users; presence = admin)
-- ---------------------------------------------------------------
CREATE TABLE admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid());
$$;

-- ---------------------------------------------------------------
-- Animals (extensible: kind covers pig/chicken/duck/egg-source/etc)
-- ---------------------------------------------------------------
CREATE TABLE animals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('pig','chicken','duck','cow','sheep','goat','egg','other')),
  breed TEXT,
  sex TEXT CHECK (sex IN ('male','female','unknown')),
  dob DATE,
  estimated_live_weight_lbs INT,
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available','reserved','sold','processed','retired')),
  ready_by DATE,
  headline TEXT,
  story TEXT,
  hero_image_url TEXT,
  photo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX animals_status_idx ON animals(status);
CREATE INDEX animals_kind_idx ON animals(kind);

-- ---------------------------------------------------------------
-- Processors
-- ---------------------------------------------------------------
CREATE TABLE processors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  notes TEXT,
  distance_mi NUMERIC(5,1),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- Share options: each animal has 1+ purchasable shares
-- (e.g. one whole, two halves, four quarters)
-- ---------------------------------------------------------------
CREATE TABLE share_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  animal_id UUID NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('whole','half','quarter','eighth','dozen','custom')),
  label TEXT,
  est_total_low_cents INT,
  est_total_high_cents INT,
  deposit_cents INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available'
    CHECK (status IN ('available','reserved','sold')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX share_options_animal_idx ON share_options(animal_id);
CREATE INDEX share_options_status_idx ON share_options(status);

-- ---------------------------------------------------------------
-- Reservations: a customer claims a share, picks a processor,
-- and submits cut preferences. No auth required on customer side.
-- ---------------------------------------------------------------
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_option_id UUID NOT NULL REFERENCES share_options(id) ON DELETE RESTRICT,
  processor_id UUID REFERENCES processors(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  cut_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','processing','ready','picked_up','cancelled')),
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  total_paid_cents INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX reservations_share_idx ON reservations(share_option_id);
CREATE INDEX reservations_status_idx ON reservations(status);
CREATE INDEX reservations_email_idx ON reservations(customer_email);

-- ---------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER animals_updated_at
  BEFORE UPDATE ON animals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------
ALTER TABLE admin_users   ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals       ENABLE ROW LEVEL SECURITY;
ALTER TABLE processors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE share_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations  ENABLE ROW LEVEL SECURITY;

-- admin_users: only admins can read/manage (deliberately self-referential via SECURITY DEFINER func above)
CREATE POLICY admin_users_select_self ON admin_users
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY admin_users_admin_all ON admin_users
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- animals: public read everything; admin writes
CREATE POLICY animals_public_read ON animals
  FOR SELECT USING (TRUE);
CREATE POLICY animals_admin_write ON animals
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- processors: public read active; admin writes
CREATE POLICY processors_public_read ON processors
  FOR SELECT USING (active = TRUE OR is_admin());
CREATE POLICY processors_admin_write ON processors
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- share_options: public read; admin writes
CREATE POLICY share_options_public_read ON share_options
  FOR SELECT USING (TRUE);
CREATE POLICY share_options_admin_write ON share_options
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- reservations: anyone can insert (customer submitting); admin can read/update/delete
CREATE POLICY reservations_public_insert ON reservations
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY reservations_admin_read ON reservations
  FOR SELECT USING (is_admin());
CREATE POLICY reservations_admin_update ON reservations
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY reservations_admin_delete ON reservations
  FOR DELETE USING (is_admin());
