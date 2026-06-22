# Business + legal model

Recap of the rules the site is built around. Read before changing
anything that touches the reservation flow or how money moves.

## The deal

Customer reserves a **pork share** (a whole / half / quarter of one of our
gilts), pays a deposit to hold it, and picks up the meat once it's ready.
The pigs are processed at a **USDA-inspected** facility, the processor cuts
and wraps the meat under the USDA mark of inspection, and the customer pays
one bundled bill to the farm that includes the processor pass-through fee.
Pickup is from the farm (or, if arranged, the processor).

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
- The **customer** pays a deposit to reserve, then a single flat balance at
  pickup. No bill of sale, no signature.

## Anti-patterns to avoid

- Don't quote price per pound of finished meat ("$X/lb bacon"). Always
  per pound of **hanging weight** × share %.
- Don't have the farmer take possession of the meat from the processor and
  redistribute through a third party — keep pickup direct from the
  processor or farm.
- Keep the pricing honest: the deposit is credited toward a single flat
  final price set from the actual processing weights.

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
