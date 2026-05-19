import { Link, useLocation } from 'react-router-dom'
import BillOfSale, { type BillOfSaleData } from '../components/BillOfSale'

export default function ReserveConfirm() {
  const location = useLocation()
  const data = location.state as BillOfSaleData | null

  if (!data) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="hand text-4xl text-blush-500">High five.</p>
        <h1 className="mt-2 font-display text-5xl">Your share is on hold.</h1>
        <p className="mt-6 text-lg text-mud-600">
          We'll email you within a day to confirm and arrange the deposit.
        </p>
        <p className="mt-2 text-mud-600">
          Got a question?{' '}
          <a className="font-semibold text-blush-500 underline" href="mailto:brookerhousehold@gmail.com">
            Email us →
          </a>
        </p>
        <div className="mt-10 flex justify-center gap-3">
          <Link to="/" className="btn-secondary">Back to the farm</Link>
        </div>
      </div>
    )
  }

  function emailBillOfSale() {
    if (!data) return
    const subject = `Bill of Sale — Creekside Fields — ${data.customer.name}`
    const body = `Hi ${data.customer.name},

Thanks for reserving a share with us. Here's your bill of sale to look over.

Once you've signed it, please email it back to brookerhousehold@gmail.com (or print, sign, and mail to 49 Clarks Mills Rd, Greenwich, NY 12834). We'll send wiring/check details for the deposit separately.

— Creekside Fields
${window.location.origin}`
    window.location.href = `mailto:${data.customer.email}?cc=brookerhousehold@gmail.com&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="text-center print:hidden">
        <p className="hand text-4xl text-blush-500">High five.</p>
        <h1 className="mt-2 font-display text-5xl">Your share is on hold.</h1>
        <p className="mx-auto mt-4 max-w-xl text-mud-600">
          Below is your bill of sale. Print it, sign it, and either drop it in the mail or scan/email it back —
          we'll then send deposit instructions. We've saved a copy of the reservation on our end too.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button onClick={() => window.print()} className="btn-primary">
            🖨 Print bill of sale
          </button>
          <button onClick={emailBillOfSale} className="btn-secondary">
            ✉ Email a copy
          </button>
          <Link to="/" className="btn-secondary">Back to the farm</Link>
        </div>
      </div>

      <div className="mt-10">
        <BillOfSale data={data} />
      </div>

      <p className="mt-8 text-center text-sm text-mud-600 print:hidden">
        Questions?{' '}
        <a className="underline" href="mailto:brookerhousehold@gmail.com">
          brookerhousehold@gmail.com
        </a>
      </p>
    </div>
  )
}
