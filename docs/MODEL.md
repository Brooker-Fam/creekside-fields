# Business + legal model

Recap of the rules the site is built around. Read before changing
anything that touches the bill of sale, the reservation flow, or how
money moves.

## The deal

Customer buys an **undivided percentage interest in a specific live
animal** (a whole / half / quarter of one of our gilts) before slaughter.
After slaughter the processor cuts and wraps it, the customer picks the
meat up from the processor (or the farm), and the customer pays one
bundled bill to the farm that includes the processor pass-through fee.

## Legal foundation

- **Federal**: 9 CFR 303.1(a)(2)(i), "custom-exempt" slaughter
  exemption. Requires:
  - Buyer is identified **before** slaughter (signed bill of sale, dated pre-slaughter).
  - Every wrapped package bears the federally-required "Not For Sale" stamp.
  - The meat is for the share owners' personal use only; no resale.
- **New York**: NY Ag &amp; Markets Law Article 5-A §96-d. Specifically
  exempts farmers who deliver their animals to a custom processor for
  slaughter for use by the owners. No NY-specific licensing layered on
  top.
- **Sales tax**: NY Tax Law §1115(a)(1) — food for human consumption is
  exempt. Live animals sold by a farmer for human consumption qualify.
  Don't register for a Certificate of Authority for these sales.
- **Farmer's inputs**: get an ST-125 (Farmer's Exemption Certificate) for
  feed / fencing / vet supplies. Has nothing to do with sales to customers.

Full research lives in conversation history. If the model changes (e.g.
USDA-inspected, which is being pursued in parallel), revisit the bill of
sale recitals and "Not For Sale" stamp language.

## Operationally

- The **farmer** schedules slaughter slot with the processor, transports
  the live animals, and hands over a roster of owners + cut preferences.
- The **customer** signs a bill of sale with the farmer + a cut sheet
  directly with the processor (the cut prefs in the site are
  a heads-up, not the binding cut sheet).
- The **processor** kills, cuts, wraps, stamps "Not For Sale", and bills
  the farmer (we then pass through the cost in the final invoice to the
  customer).

## Anti-patterns to avoid

- Don't take a deposit **after** slaughter. Bill of sale must predate
  kill date.
- Don't quote price per pound of finished meat ("$X/lb bacon"). Always
  per pound of **hanging weight** × share %.
- Don't have the farmer take possession of the meat from the processor
  and redistribute. Pickup is direct from processor or farm — meat
  doesn't roundtrip through a third party.
- Don't sell more than ~4 shares per animal (we sell whole / half / quarter,
  fine). The IRS / USDA gets suspicious if a single animal has 12 owners.
- Don't refund/resell a share after slaughter to a different person —
  they would be an illegal post-slaughter owner.

## If you ever go USDA-inspected

The pre-sale bill of sale becomes optional (meat can be sold by the
pound post-slaughter). The "Not For Sale" stamp goes away (USDA mark of
inspection takes its place). The recitals on the BoS need a rewrite to
drop the custom-exempt references. The pricing model can stay the same
or shift to retail by-the-cut.
