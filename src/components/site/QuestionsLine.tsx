/** Closes a page so nobody hits a dead end. */
export default function QuestionsLine({ lead = 'Something we didn’t cover?' }: { lead?: string }) {
  return (
    <p className="text-center font-accent text-[1.2rem] italic leading-[1.6] text-earth-600">
      {lead}{' '}
      <a href="/contact" className="not-italic font-body font-semibold text-copper-500 underline underline-offset-4 hover:text-copper-600">
        Just ask
      </a>
      .
    </p>
  )
}
