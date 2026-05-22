export type AnimalKind = 'pig' | 'chicken' | 'duck' | 'cow' | 'sheep' | 'goat' | 'egg' | 'other'
export type AnimalStatus = 'available' | 'reserved' | 'sold' | 'processed' | 'retired'
export type ShareKind = 'whole' | 'half' | 'quarter' | 'eighth' | 'dozen' | 'custom'
export type ShareStatus = 'available' | 'reserved' | 'sold'
export type ReservationStatus =
  | 'pending' | 'confirmed' | 'processing' | 'ready' | 'picked_up' | 'cancelled'

export interface Animal {
  id: string
  kind: AnimalKind
  breed: string | null
  sex: 'male' | 'female' | 'unknown' | null
  dob: string | null
  estimated_live_weight_lbs: number | null
  hanging_weight_lbs: number | null
  rate_per_lb_hw_cents: number | null
  slaughter_date: string | null
  status: AnimalStatus
  ready_by: string | null
  headline: string | null
  story: string | null
  hero_image_url: string | null
  photo_urls: string[]
  tags: string[]
  notes: string | null
  display_order: number
  created_at: string
  updated_at: string
}

export interface Processor {
  id: string
  name: string
  address: string | null
  phone: string | null
  website: string | null
  notes: string | null
  distance_mi: number | null
  active: boolean
  display_order: number
  created_at: string
}

export interface ShareOption {
  id: string
  animal_id: string
  kind: ShareKind
  label: string | null
  est_total_low_cents: number | null
  est_total_high_cents: number | null
  rate_per_lb_hw_cents: number | null
  deposit_cents: number
  status: ShareStatus
  created_at: string
}

export interface Reservation {
  id: string
  share_option_id: string
  processor_id: string | null
  customer_name: string
  customer_email: string
  customer_phone: string | null
  customer_address: string | null
  share_percentage: number | null
  bill_of_sale_signed_at: string | null
  signature_url: string | null
  signature_key: string | null
  acknowledged_at: string | null
  invoice_sent_at: string | null
  final_total_cents: number | null
  cut_preferences: Record<string, unknown>
  notes: string | null
  status: ReservationStatus
  deposit_paid: boolean
  total_paid_cents: number
  created_at: string
  updated_at: string
}
