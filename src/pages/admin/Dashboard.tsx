import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePostHog } from '@posthog/react'
import { insforge, formatCents, priceRange } from '../../lib/insforge'
import type { Animal, Processor, Reservation, ShareOption } from '../../lib/types'
import BillOfSale from '../../components/BillOfSale'
import Invoice, { computeInvoice, sharePctFromKind } from '../../components/Invoice'
import { renderBillOfSaleEmail, renderInvoiceEmail } from '../../lib/emailTemplates'

type Tab = 'reservations' | 'animals' | 'shares' | 'processors'

const FARM_EMAIL = 'brookerhousehold@gmail.com'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const posthog = usePostHog()
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('reservations')
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [animals, setAnimals] = useState<Animal[]>([])
  const [shares, setShares] = useState<ShareOption[]>([])
  const [processors, setProcessors] = useState<Processor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (!data?.user) {
        navigate('/admin/login')
        return
      }
      setUser({ id: data.user.id, email: data.user.email })
      if (data.user.email) posthog?.identify(data.user.email, { email: data.user.email })
      // is_admin check: try to read from admin_users (RLS allows self-select)
      insforge.database
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .single()
        .then(({ data: adminRow }) => {
          setIsAdmin(!!adminRow)
          if (adminRow) refresh()
          else setLoading(false)
        })
    })
  }, [navigate, posthog])

  function refresh(showLoading = true) {
    if (showLoading) setLoading(true)
    Promise.all([
      insforge.database.from('reservations').select('*').order('created_at', { ascending: false }),
      insforge.database.from('animals').select('*').order('display_order'),
      insforge.database.from('share_options').select('*'),
      insforge.database.from('processors').select('*').order('display_order'),
    ]).then(([r, a, s, p]) => {
      if (r.data) setReservations(r.data as Reservation[])
      if (a.data) setAnimals(a.data as Animal[])
      if (s.data) setShares(s.data as ShareOption[])
      if (p.data) setProcessors(p.data as Processor[])
      setLoading(false)
    })
  }

  // Poll for new reservations every 30s while on the dashboard
  useEffect(() => {
    if (!isAdmin) return
    const t = setInterval(() => refresh(false), 30000)
    return () => clearInterval(t)
  }, [isAdmin])

  const newCount = reservations.filter((r) => !r.acknowledged_at).length

  async function signOut() {
    await insforge.auth.signOut()
    posthog?.capture('admin_logged_out')
    posthog?.reset()
    navigate('/admin/login')
  }

  if (isAdmin === null) {
    return <div className="mx-auto max-w-4xl px-4 py-16">Checking your credentials…</div>
  }
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <p className="hand text-3xl text-blush-500">Sorry partner.</p>
        <h1 className="font-display text-4xl">You're signed in, but not an admin.</h1>
        <p className="mt-4 text-mud-600">
          You're signed in as <strong>{user?.email}</strong>. Ask the farm to add you as an admin, then
          come back.
        </p>
        <button onClick={signOut} className="btn-secondary mt-6">Sign out</button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="hand text-2xl text-blush-500">Farm HQ</p>
          <h1 className="font-display text-4xl">Admin dashboard</h1>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-mud-600">{user?.email}</span>
          <button onClick={signOut} className="btn-secondary py-2">Sign out</button>
        </div>
      </div>

      <nav className="mt-8 flex flex-wrap gap-2">
        {(['reservations', 'animals', 'shares', 'processors'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative rounded-full border-2 border-mud-800 px-5 py-2 text-sm font-semibold capitalize ${
              tab === t ? 'bg-blush-300 shadow-sketch' : 'bg-cream-100 hover:bg-blush-100'
            }`}
          >
            {t}
            {t === 'reservations' && ` (${reservations.length})`}
            {t === 'reservations' && newCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-[1.5rem] place-items-center rounded-full border-2 border-mud-800 bg-blush-500 px-1.5 text-xs font-bold text-cream-50">
                {newCount}
              </span>
            )}
          </button>
        ))}
        <button onClick={() => refresh()} className="ml-auto rounded-full border-2 border-mud-800 bg-cream-100 px-4 py-2 text-sm">
          ↻ refresh
        </button>
      </nav>

      <div className="mt-6">
        {loading ? (
          <p className="text-mud-600">Loading…</p>
        ) : tab === 'reservations' ? (
          <Reservations rows={reservations} shares={shares} animals={animals} processors={processors} onChange={refresh} />
        ) : tab === 'animals' ? (
          <Animals rows={animals} shares={shares} onChange={refresh} />
        ) : tab === 'shares' ? (
          <Shares rows={shares} animals={animals} onChange={refresh} />
        ) : (
          <Processors rows={processors} onChange={refresh} />
        )}
      </div>
    </div>
  )
}

function Reservations({
  rows,
  shares,
  animals,
  processors,
  onChange,
}: {
  rows: Reservation[]
  shares: ShareOption[]
  animals: Animal[]
  processors: Processor[]
  onChange: () => void
}) {
  if (rows.length === 0)
    return <p className="text-mud-600">No reservations yet. They'll show up here.</p>

  return (
    <div className="space-y-3">
      {rows.map((r) => {
        const share = shares.find((s) => s.id === r.share_option_id)
        const animal = share ? animals.find((a) => a.id === share.animal_id) : null
        const processor = processors.find((p) => p.id === r.processor_id) ?? null
        return (
          <ReservationRow
            key={r.id}
            r={r}
            share={share}
            animal={animal ?? null}
            processor={processor}
            onChange={onChange}
          />
        )
      })}
    </div>
  )
}

function ReservationRow({
  r,
  share,
  animal,
  processor,
  onChange,
}: {
  r: Reservation
  share: ShareOption | undefined
  animal: Animal | null
  processor: Processor | null
  onChange: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [view, setView] = useState<'closed' | 'bos' | 'invoice'>('closed')
  const [sendingBos, setSendingBos] = useState(false)
  const [sendingInvoice, setSendingInvoice] = useState(false)
  const [sendStatus, setSendStatus] = useState<{ kind: 'ok' | 'err'; msg: string } | null>(null)

  async function update(patch: Partial<Reservation>) {
    await insforge.database.from('reservations').update(patch).eq('id', r.id)
    onChange()
  }

  const isNew = !r.acknowledged_at
  const sharePct = r.share_percentage ?? (share ? sharePctFromKind(share.kind) : 0)

  async function emailBillOfSale() {
    if (!share || !animal) {
      setSendStatus({ kind: 'err', msg: 'Share or animal missing — cannot render bill of sale.' })
      return
    }
    setSendingBos(true)
    setSendStatus(null)
    const pickupPref = (r.cut_preferences as Record<string, unknown>)?.pickup_preference as string | null ?? null
    const html = renderBillOfSaleEmail({
      customer: {
        name: r.customer_name,
        email: r.customer_email,
        phone: r.customer_phone,
        address: r.customer_address,
      },
      share,
      animal,
      pickup_preference: pickupPref,
      share_percentage: sharePct,
      date: r.created_at,
      signature_url: r.signature_url,
      signed_at: r.bill_of_sale_signed_at,
    })
    const subject = `Your bill of sale — Creekside Fields — ${share.label ?? share.kind}`
    const { error } = await insforge.emails.send({
      to: r.customer_email,
      cc: FARM_EMAIL,
      replyTo: FARM_EMAIL,
      subject,
      html,
      from: 'Creekside Fields',
    })
    setSendingBos(false)
    if (error) {
      setSendStatus({ kind: 'err', msg: `Send failed: ${error.message}` })
      return
    }
    setSendStatus({ kind: 'ok', msg: `Bill of sale sent to ${r.customer_email}.` })
  }

  async function emailInvoice() {
    if (!animal || !share) {
      setSendStatus({ kind: 'err', msg: 'Share or animal missing.' })
      return
    }
    const calc = computeInvoice({ reservation: r, share, animal, processor })
    if (!calc.canCompute || calc.finalTotalCents == null || calc.balanceCents == null) {
      setSendStatus({ kind: 'err', msg: 'Set the final price on this reservation first (the “Final $” field above).' })
      return
    }
    setSendingInvoice(true)
    setSendStatus(null)
    const html = renderInvoiceEmail({
      customer: { name: r.customer_name, email: r.customer_email },
      share: { label: share.label, kind: share.kind },
      finalTotalCents: calc.finalTotalCents,
      depositPaidCents: r.total_paid_cents || 0,
      balanceCents: calc.balanceCents,
      processor: processor ? { name: processor.name, address: processor.address } : null,
    })
    const subject = `Final invoice — Creekside Fields — ${share.label ?? share.kind}`
    const { error } = await insforge.emails.send({
      to: r.customer_email,
      cc: FARM_EMAIL,
      replyTo: FARM_EMAIL,
      subject,
      html,
      from: 'Creekside Fields',
    })
    setSendingInvoice(false)
    if (error) {
      setSendStatus({ kind: 'err', msg: `Send failed: ${error.message}` })
      return
    }
    await update({ invoice_sent_at: new Date().toISOString() })
    setSendStatus({ kind: 'ok', msg: `Invoice sent to ${r.customer_email}.` })
  }

  async function markAcknowledged() {
    await update({ acknowledged_at: new Date().toISOString() })
  }

  return (
    <div className={`card ${isNew ? 'border-blush-500 ring-2 ring-blush-300' : ''}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex-1 min-w-[260px]">
          <div className="flex items-center gap-2">
            {isNew && (
              <span className="rounded-full border-2 border-mud-800 bg-blush-300 px-2 py-0.5 text-xs font-bold uppercase">
                New
              </span>
            )}
            <p className="font-display text-xl">{r.customer_name}</p>
          </div>
          <p className="text-sm text-mud-600">
            <a className="underline" href={`mailto:${r.customer_email}`}>{r.customer_email}</a>
            {r.customer_phone && <> · <a className="underline" href={`tel:${r.customer_phone}`}>{r.customer_phone}</a></>}
          </p>
          {r.customer_address && <p className="text-xs text-mud-600">{r.customer_address}</p>}
          <p className="mt-1 text-sm">
            <strong>{sharePct}%</strong> · {animal?.breed}
            {animal?.headline ? ` · "${animal.headline}"` : ''} · {priceRange(share?.est_total_low_cents, share?.est_total_high_cents)}
          </p>
          <p className="text-sm text-mud-600">
            Processor: {processor?.name ?? 'Not chosen yet'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <select
            value={r.status}
            onChange={(e) => update({ status: e.target.value as Reservation['status'] })}
            className="input w-auto"
          >
            {['pending','confirmed','processing','ready','picked_up','cancelled'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={r.deposit_paid}
              onChange={(e) => update({ deposit_paid: e.target.checked })}
            />
            Deposit paid
          </label>
          <label className="flex items-center gap-2 text-sm">
            Final $
            <RateInput
              cents={r.final_total_cents}
              onSave={(cents) => update({ final_total_cents: cents })}
            />
          </label>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-sm">
        <button onClick={emailBillOfSale} disabled={sendingBos} className="rounded-full border-2 border-mud-800 bg-cream-50 px-3 py-1.5 font-semibold hover:bg-blush-100 disabled:opacity-60">
          {sendingBos ? 'Sending…' : '✉ Email bill of sale'}
        </button>
        <button onClick={emailInvoice} disabled={sendingInvoice} className="rounded-full border-2 border-mud-800 bg-cream-50 px-3 py-1.5 font-semibold hover:bg-blush-100 disabled:opacity-60">
          {sendingInvoice ? 'Sending…' : '✉ Email invoice'}
        </button>
        <button onClick={() => setView(view === 'bos' ? 'closed' : 'bos')} className="rounded-full border-2 border-mud-800 bg-cream-50 px-3 py-1.5 hover:bg-blush-100">
          {view === 'bos' ? 'Hide' : 'View'} bill of sale
        </button>
        <button onClick={() => setView(view === 'invoice' ? 'closed' : 'invoice')} className="rounded-full border-2 border-mud-800 bg-cream-50 px-3 py-1.5 hover:bg-blush-100">
          {view === 'invoice' ? 'Hide' : 'View'} invoice
        </button>
        {isNew && (
          <button onClick={markAcknowledged} className="rounded-full border-2 border-mud-800 bg-sage-200 px-3 py-1.5 font-semibold hover:bg-sage-300">
            ✓ Mark as seen
          </button>
        )}
        <button onClick={() => setExpanded(!expanded)} className="ml-auto rounded-full px-3 py-1.5 text-mud-600 hover:underline">
          {expanded ? '▲ less' : '▼ more'}
        </button>
      </div>

      {sendStatus && (
        <p
          className={`mt-3 rounded-xl border-2 px-3 py-2 text-sm ${
            sendStatus.kind === 'ok'
              ? 'border-sage-700 bg-sage-200 text-sage-700'
              : 'border-blush-500 bg-blush-100 text-mud-800'
          }`}
        >
          {sendStatus.msg}
        </p>
      )}

      {expanded && (
        <div className="mt-3 rounded-xl border border-mud-800/20 bg-cream-50 p-3 text-sm">
          <p className="text-xs text-mud-600">
            Submitted {new Date(r.created_at).toLocaleString()}
            {r.acknowledged_at && <> · Acknowledged {new Date(r.acknowledged_at).toLocaleString()}</>}
          </p>
          {r.notes && <p className="mt-2"><strong>Notes:</strong> {r.notes}</p>}
          {(r.cut_preferences as Record<string, unknown>)?.pickup_preference != null && (
            <p className="mt-2">
              <strong>Pickup preference:</strong>{' '}
              {String((r.cut_preferences as Record<string, unknown>).pickup_preference)}
            </p>
          )}
        </div>
      )}

      {view !== 'closed' && share && animal && (
        <div className="mt-4">
          {view === 'bos' ? (
            <BillOfSale
              data={{
                customer: {
                  name: r.customer_name,
                  email: r.customer_email,
                  phone: r.customer_phone,
                  address: r.customer_address,
                },
                share,
                animal,
                pickup_preference: (r.cut_preferences as Record<string, unknown>)?.pickup_preference as string | null ?? null,
                share_percentage: sharePct,
                date: r.created_at,
                signature_url: r.signature_url,
                signed_at: r.bill_of_sale_signed_at,
              }}
            />
          ) : (
            <Invoice data={{ reservation: r, share, animal, processor }} />
          )}
        </div>
      )}
    </div>
  )
}

function Animals({ rows, shares, onChange }: { rows: Animal[]; shares: ShareOption[]; onChange: () => void }) {
  return (
    <div className="space-y-4">
      {rows.map((a) => (
        <AnimalEditor key={a.id} animal={a} shareCount={shares.filter((s) => s.animal_id === a.id).length} onChange={onChange} />
      ))}
      <NewAnimal onChange={onChange} />
    </div>
  )
}

function AnimalEditor({ animal, shareCount, onChange }: { animal: Animal; shareCount: number; onChange: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(animal)
  async function save() {
    await insforge.database.from('animals').update({
      kind: form.kind,
      breed: form.breed,
      sex: form.sex,
      dob: form.dob,
      estimated_live_weight_lbs: form.estimated_live_weight_lbs,
      hanging_weight_lbs: form.hanging_weight_lbs,
      rate_per_lb_hw_cents: form.rate_per_lb_hw_cents,
      slaughter_date: form.slaughter_date,
      status: form.status,
      ready_by: form.ready_by,
      headline: form.headline,
      story: form.story,
      hero_image_url: form.hero_image_url,
      notes: form.notes,
    }).eq('id', animal.id)
    setEditing(false)
    onChange()
  }
  return (
    <div className="card">
      <div className="flex justify-between gap-3">
        <div>
          <p className="font-display text-xl">{animal.breed ?? '(no breed)'}{animal.headline ? ` — "${animal.headline}"` : ''}</p>
          <p className="text-sm text-mud-600">
            {animal.status} · {shareCount} shares
            {animal.hanging_weight_lbs ? ` · ${animal.hanging_weight_lbs} lb HW` : ''}
          </p>
        </div>
        <button onClick={() => setEditing((e) => !e)} className="btn-secondary py-2 text-sm">
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      {editing && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField label="Headline" value={form.headline ?? ''} onChange={(v) => setForm({ ...form, headline: v })} />
          <TextField label="Breed" value={form.breed ?? ''} onChange={(v) => setForm({ ...form, breed: v })} />
          <TextField label="DOB" type="date" value={form.dob ?? ''} onChange={(v) => setForm({ ...form, dob: v })} />
          <TextField label="Ready by" type="date" value={form.ready_by ?? ''} onChange={(v) => setForm({ ...form, ready_by: v })} />
          <TextField
            label="Est. live weight (lb)"
            type="number"
            value={form.estimated_live_weight_lbs?.toString() ?? ''}
            onChange={(v) => setForm({ ...form, estimated_live_weight_lbs: v ? parseInt(v) : null })}
          />
          <SelectField
            label="Status"
            value={form.status}
            onChange={(v) => setForm({ ...form, status: v as Animal['status'] })}
            options={['available','reserved','sold','processed','retired']}
          />
          <div className="sm:col-span-2 mt-2 rounded-2xl border-2 border-mud-800 bg-sage-100 p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-mud-600">After slaughter — for your records (helps you set each share's flat price)</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <TextField
                label="Slaughter date"
                type="date"
                value={form.slaughter_date ?? ''}
                onChange={(v) => setForm({ ...form, slaughter_date: v || null })}
              />
              <TextField
                label="Hanging weight (lb)"
                type="number"
                value={form.hanging_weight_lbs?.toString() ?? ''}
                onChange={(v) => setForm({ ...form, hanging_weight_lbs: v ? parseFloat(v) : null })}
              />
            </div>
          </div>
          <TextField label="Hero image URL" value={form.hero_image_url ?? ''} onChange={(v) => setForm({ ...form, hero_image_url: v })} className="sm:col-span-2" />
          <div className="sm:col-span-2">
            <label className="label">Story</label>
            <textarea
              className="input"
              rows={4}
              value={form.story ?? ''}
              onChange={(e) => setForm({ ...form, story: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button onClick={save} className="btn-primary">Save changes</button>
          </div>
        </div>
      )}
    </div>
  )
}

function NewAnimal({ onChange }: { onChange: () => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ kind: 'pig', breed: '', headline: '', dob: '', ready_by: '' })
  async function create() {
    await insforge.database.from('animals').insert([{ ...form, dob: form.dob || null, ready_by: form.ready_by || null }])
    setOpen(false)
    setForm({ kind: 'pig', breed: '', headline: '', dob: '', ready_by: '' })
    onChange()
  }
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary">+ Add a new animal</button>
    )
  }
  return (
    <div className="card">
      <h3 className="font-display text-xl">New animal</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <SelectField label="Kind" value={form.kind} onChange={(v) => setForm({ ...form, kind: v })} options={['pig','chicken','duck','cow','sheep','goat','egg','other']} />
        <TextField label="Breed" value={form.breed} onChange={(v) => setForm({ ...form, breed: v })} />
        <TextField label="Headline" value={form.headline} onChange={(v) => setForm({ ...form, headline: v })} className="sm:col-span-2" />
        <TextField label="DOB" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} />
        <TextField label="Ready by" type="date" value={form.ready_by} onChange={(v) => setForm({ ...form, ready_by: v })} />
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={create} className="btn-primary">Create</button>
        <button onClick={() => setOpen(false)} className="btn-secondary">Cancel</button>
      </div>
    </div>
  )
}

function Shares({ rows, animals, onChange }: { rows: ShareOption[]; animals: Animal[]; onChange: () => void }) {
  async function update(id: string, patch: Partial<ShareOption>) {
    await insforge.database.from('share_options').update(patch).eq('id', id)
    onChange()
  }
  return (
    <div className="space-y-2">
      <p className="text-sm text-mud-600">
        Each share is a flat price. The estimated range and deposit shown here are what customers
        see up front; you set each customer's final flat price on their reservation (the “Final $”
        field on the Reservations tab) once the pig is processed.
      </p>
      {animals.map((a) => (
        <div key={a.id} className="card">
          <p className="font-display text-lg">{a.headline}</p>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-mud-600">
                <th className="py-1">Label</th>
                <th>Kind</th>
                <th>Est. price range</th>
                <th>Deposit</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.filter((s) => s.animal_id === a.id).map((s) => (
                <tr key={s.id} className="border-t border-mud-800/10">
                  <td className="py-2">{s.label}</td>
                  <td>{s.kind}</td>
                  <td>{priceRange(s.est_total_low_cents, s.est_total_high_cents)}</td>
                  <td>{formatCents(s.deposit_cents)}</td>
                  <td>
                    <select
                      className="input w-auto py-1 text-xs"
                      value={s.status}
                      onChange={(e) => update(s.id, { status: e.target.value as ShareOption['status'] })}
                    >
                      {['available','reserved','sold'].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}

function RateInput({ cents, onSave }: { cents: number | null; onSave: (cents: number | null) => void }) {
  const [value, setValue] = useState(cents != null ? (cents / 100).toFixed(2) : '')
  useEffect(() => {
    setValue(cents != null ? (cents / 100).toFixed(2) : '')
  }, [cents])
  function commit() {
    const parsed = value.trim() === '' ? null : Math.round(parseFloat(value) * 100)
    if (parsed === cents) return
    if (parsed != null && Number.isNaN(parsed)) return
    onSave(parsed)
  }
  return (
    <input
      type="number"
      step="0.01"
      min="0"
      className="input w-24 py-1 text-xs"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
    />
  )
}

function Processors({ rows, onChange }: { rows: Processor[]; onChange: () => void }) {
  return (
    <div className="space-y-3">
      {rows.map((p) => (
        <ProcessorEditor key={p.id} p={p} onChange={onChange} />
      ))}
    </div>
  )
}

function ProcessorEditor({ p, onChange }: { p: Processor; onChange: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(p)
  async function save() {
    await insforge.database.from('processors').update({
      name: form.name,
      address: form.address,
      phone: form.phone,
      website: form.website,
      notes: form.notes,
      distance_mi: form.distance_mi,
      active: form.active,
    }).eq('id', p.id)
    setEditing(false)
    onChange()
  }
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-xl">{p.name}</p>
          <p className="text-sm text-mud-600">{p.address}</p>
          {p.phone && <p className="text-sm">{p.phone}</p>}
        </div>
        <button onClick={() => setEditing((e) => !e)} className="btn-secondary py-2 text-sm">
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      {editing && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <TextField label="Address" value={form.address ?? ''} onChange={(v) => setForm({ ...form, address: v })} />
          <TextField label="Phone" value={form.phone ?? ''} onChange={(v) => setForm({ ...form, phone: v })} />
          <TextField label="Website" value={form.website ?? ''} onChange={(v) => setForm({ ...form, website: v })} />
          <div className="sm:col-span-2">
            <label className="label">Notes</label>
            <textarea
              className="input"
              rows={3}
              value={form.notes ?? ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
            />
            Active
          </label>
          <div className="sm:col-span-2">
            <button onClick={save} className="btn-primary">Save</button>
          </div>
        </div>
      )}
    </div>
  )
}

function TextField({ label, value, onChange, type = 'text', className = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; className?: string
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      <input className="input" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

// helper for unused Link import elimination in dev
export const _ = Link
