-- RPC for anon customers to attach their signature to their reservation.
-- The reservations table is admin-only for UPDATE; this SECURITY DEFINER
-- function lets the customer write *only* the three signature columns and
-- *only* if the row hasn't already been signed.
CREATE OR REPLACE FUNCTION sign_reservation(
  p_reservation_id UUID,
  p_signature_url TEXT,
  p_signature_key TEXT
) RETURNS UUID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  updated_id UUID;
BEGIN
  UPDATE reservations
  SET signature_url = p_signature_url,
      signature_key = p_signature_key,
      bill_of_sale_signed_at = now()
  WHERE id = p_reservation_id
    AND bill_of_sale_signed_at IS NULL
  RETURNING id INTO updated_id;

  IF updated_id IS NULL THEN
    RAISE EXCEPTION 'Reservation not found or already signed';
  END IF;

  RETURN updated_id;
END;
$$;

GRANT EXECUTE ON FUNCTION sign_reservation(UUID, TEXT, TEXT) TO PUBLIC;
