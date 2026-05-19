-- Per-animal hanging weight + rate. Set after slaughter so invoices can be sent.
ALTER TABLE animals ADD COLUMN hanging_weight_lbs NUMERIC(6,1);
ALTER TABLE animals ADD COLUMN rate_per_lb_hw_cents INT;
ALTER TABLE animals ADD COLUMN slaughter_date DATE;

-- Per-reservation acknowledgement tracking (so admin can mark new-vs-seen)
ALTER TABLE reservations ADD COLUMN acknowledged_at TIMESTAMPTZ;
ALTER TABLE reservations ADD COLUMN invoice_sent_at TIMESTAMPTZ;
ALTER TABLE reservations ADD COLUMN final_total_cents INT;
