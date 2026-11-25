# Business + legal model

Recap of the rules the site is built around. Read before changing
anything that touches ordering or how money moves.

## The deal

Customers order through the site's forms: a **pork share** (a whole / half
/ quarter of a pig, $10/lb of take-home pork), **individual cuts** priced per
pound, or **whole geese and ducks** priced per pound. Nothing is paid online:
the farm gets an email, confirms the total (actual weight × price), and sets a
pickup time at the farm. The pigs were processed at a **USDA-inspected**
facility, which cut and wrapped the meat under the USDA mark of inspection.

Geese and ducks: how they're processed and labeled isn't documented here —
check with the farm before making inspection claims about them on the site.

## Legal foundation

- **USDA inspection (FSIS)**: because the animals are slaughtered and
  processed under federal inspection, the meat bears the USDA mark of
  inspection and can be **sold by the cut or by the share to anyone,
  post-slaughter**. There's no need to transfer ownership of a live animal
  before slaughter, no "personal use only" restriction, and no "Not For
  Sale" stamp — those are custom-exempt requirements that no longer apply.
- **Sales tax**: NY Tax Law §1115(a)(1) — food for human consumption is
  exempt. Sales of meat for human consumption qualify.
- **Farmer's inputs**: get an ST-125 (Farmer's Exemption Certificate) for
  feed / fencing / vet supplies. Has nothing to do with sales to customers.

## Operationally

- The **farmer** schedules the slaughter slot with the USDA-inspected
  processor, transports the animals, and hands over a roster of orders +
  cut preferences (the cut prefs in the site are a heads-up, not a binding
  cut sheet — confirm directly with the processor).
- The **processor** kills, cuts, wraps, applies the USDA mark of
  inspection, and bills the farmer (we then pass through the cost in the
  final invoice to the customer).
- The **customer** sends an order; the farm follows up about the total and
  payment, and the customer picks up at the farm. No bill of sale, no
  signature, and the site doesn't mention deposits.

## Anti-patterns to avoid

- Prices are per pound of packaged (take-home) meat: $10/lb for shares,
  the listed per-pound price for each cut and bird. The final total is always
  the actual weight × price.
- Don't have the farmer take possession of the meat from the processor and
  redistribute through a third party — keep pickup direct from the
  processor or farm.
- Keep the pricing honest: list prices up front, and set the final total from
  the actual weights.

## History: the old custom-exempt model

Before moving to USDA-inspected processing, the site sold under the federal
**custom-exempt** exemption (9 CFR 303.1(a)(2)(i)) plus NY Ag & Markets Law
Article 5-A §96-d. Under that model the customer bought an *undivided
percentage interest in a specific live animal before slaughter*, every
package bore the "Not For Sale" stamp, the meat was for the owners'
personal use only, and the deal was documented with a **signed bill of
sale dated before the kill date**. That required an on-screen signature pad,
a `signatures` storage bucket, and a `sign_reservation` RPC — all removed
when we switched to USDA inspection (migration
`20260622130000_drop-bill-of-sale-signature.sql`). If you ever revert to
custom-exempt, those pieces and the pre-slaughter recitals need to come
back.
