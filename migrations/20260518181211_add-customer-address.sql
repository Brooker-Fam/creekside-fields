ALTER TABLE reservations ADD COLUMN customer_address TEXT;
ALTER TABLE reservations ADD COLUMN share_percentage NUMERIC(5,2);
ALTER TABLE reservations ADD COLUMN bill_of_sale_signed_at TIMESTAMPTZ;
