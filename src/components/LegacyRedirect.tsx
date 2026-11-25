import { useEffect } from 'react'

/**
 * Sends old URLs (retired pages, old reservation links) to where that content
 * lives now. A full-page replace, so section targets like "/#how" scroll
 * into place on load.
 */
export default function LegacyRedirect({ to }: { to: string }) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])
  return null
}
