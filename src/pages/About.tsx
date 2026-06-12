import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="field-tag">How it works</p>
      <h1 className="mt-4 font-display text-6xl leading-tight text-sage-700">From our pasture to your freezer</h1>

      <Section title="The animals">
        Heritage Gloucestershire Old Spots, born February 2025. They came to us at about
        8 weeks old and have lived on our farm in Greenwich, NY ever since. They are a slow-growing
        pasture breed, raised outdoors with room to root, wander, rest, and settle into the rhythms
        of the land.
      </Section>

      <Section title="What you're actually buying">
        A whole (100%), half (50%), or quarter (25%) share. You sign a quick bill of sale and put
        down a deposit to hold the share. When the meat is ready, you pick it up and pay one bill
        to us — processing fees already included.
      </Section>

      <Section title="The share size">
        A whole hog is roughly 195 lb of cut &amp; wrapped meat at our current 300 lb hanging-weight
        planning assumption. A half is around 95-100 lb, and a quarter is around 45-50 lb. Actual
        take-home weight depends on hanging weight and cut choices.
      </Section>

      <Section title="Processing">
        Slaughter and cut &amp; wrap happen at Eagle Bridge Custom Meat &amp; Smokehouse, about 12
        miles from the farm. Slaughter date isn't locked in yet — we'll text reservation holders
        as soon as it is.
      </Section>

      <Section title="The price">
        Hanging weight of your share × per-pound rate. Whole hogs are priced at $7.75/lb hanging
        weight, halves at $8.50/lb, and quarters at $9.25/lb. The rate includes base processing
        using Eagle Bridge Custom Meat's current price sheet. Smoking, no-nitrate curing, links,
        hot dogs, and specialty sausage may add pass-through butcher costs.
      </Section>

      <Section title="The cut sheet">
        Bacon or fresh belly, smoked or fresh hams, bone-in chops or roasts, sausage flavors,
        soup bones, leaf lard, hocks, and optional offal.
        <strong> If you reserve before we send the pigs to the processor</strong>, you fill out a
        cut sheet and we pass it along. Reserve after that and your share comes as our standard
        pre-cut packages.
      </Section>

      <Section title="The pickup">
        We'll text you when it's ready. You can grab it directly from the processor or pick it up
        from us at the farm — whichever's easier for you.
      </Section>

      <div className="mt-12">
        <Link to="/" className="btn-primary">See the shares →</Link>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-3xl text-sage-700">{title}</h2>
      <p className="mt-2 text-lg leading-relaxed text-mud-700">{children}</p>
    </section>
  )
}
