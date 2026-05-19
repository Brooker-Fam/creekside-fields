import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="hand text-3xl text-blush-500">How it works</p>
      <h1 className="font-display text-5xl">From our patch to your freezer</h1>

      <Section title="The animals">
        Two heritage Gloucestershire Old Spots gilts, born February 2025. They came to us at about
        8 weeks old and have lived on our farm in Greenwich, NY ever since. Slow-grow breed, deeply
        flavored pork. Their whole adult lives outdoors on pasture, rooting in the woods, and getting
        fat on the local school's lunch leftovers.
      </Section>

      <Section title="What you're actually buying">
        A whole (100%), half (50%), or quarter (25%) share. You sign a quick bill of sale and put
        down a deposit to hold the share. When the meat is ready, you pick it up — and you pay one
        single bill to us, no separate processor invoice to chase.
      </Section>

      <Section title="The share size">
        A whole hog is roughly 140–150 lb of cut &amp; wrapped meat — a chest-freezer's worth. A half is
        70–75 lb, a quarter is 35–40 lb (fits in a regular freezer drawer).
      </Section>

      <Section title="Processing">
        We're working on going USDA-inspected so we can sell finished cuts directly. We haven't
        scheduled the slaughter date yet — we'll hear back from the processor and update reservation
        holders as soon as we know.
      </Section>

      <Section title="The price">
        Hanging weight of your share × per-pound rate. Hanging weight is typically ~70% of live
        weight. We post an estimated price range when you reserve, and lock in the final number once
        we have the actual hanging weight. One bill, paid to us.
      </Section>

      <Section title="The cut sheet">
        Bacon thick or thin, hams smoked or fresh, what kind of sausages, save the bones or no.
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
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-2 text-lg leading-relaxed text-mud-700">{children}</p>
    </section>
  )
}
