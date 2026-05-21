// Vercel serverless function that sends the signed bill of sale via Resend.
// Called by ReserveConfirm.tsx after the signature is saved server-side.
// Lives at https://creeksidefields.com/api/send-bill-of-sale

import { renderBillOfSaleEmail } from '../src/lib/emailTemplates'
import type { BillOfSaleData } from '../src/components/BillOfSale'

const FARM_EMAIL = 'brookerhousehold@gmail.com'
const SENDER = 'Creekside Fields <hello@creeksidefields.com>'

interface RequestBody {
  data: BillOfSaleData
}

export const config = { runtime: 'nodejs' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return json({ error: 'RESEND_API_KEY missing on server' }, 500)
  }

  let body: RequestBody
  try {
    body = (await req.json()) as RequestBody
  } catch {
    return json({ error: 'Bad JSON' }, 400)
  }
  const { data } = body
  if (!data?.customer?.email || !data?.share?.id || !data?.animal?.id) {
    return json({ error: 'Missing required fields' }, 400)
  }

  const html = renderBillOfSaleEmail(data)
  const subject = `Bill of sale — Creekside Fields — ${data.customer.name}`

  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: SENDER,
      to: data.customer.email,
      cc: FARM_EMAIL,
      reply_to: FARM_EMAIL,
      subject,
      html,
    }),
  })

  const payload = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    return json({ error: 'Resend failed', detail: payload }, 502)
  }
  return json({ ok: true, id: (payload as { id?: string }).id }, 200)
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
}
