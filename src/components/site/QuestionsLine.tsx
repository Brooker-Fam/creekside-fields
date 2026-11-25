/** "Questions? Get in touch" — closes pages so nobody hits a dead end. */
export default function QuestionsLine({ lead = 'Questions? We’d love to hear from you.' }: { lead?: string }) {
  return (
    <div className="text-center">
      <p className="font-accent text-[1.2rem] italic leading-[1.6] text-earth-600">{lead}</p>
      <div className="mt-5">
        <a href="/contact" className="btn-secondary">
          Get in touch
        </a>
      </div>
    </div>
  )
}
