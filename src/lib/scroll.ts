import type { MouseEvent } from 'react'

/**
 * Click handler for same-page section links (`<a href="#cuts">`). Scrolls to
 * the section ourselves — native fragment navigation doesn't fire reliably
 * with this site's scroll container (see Layout.tsx). Modified clicks (new
 * tab, etc.) are left alone.
 */
export function scrollToSection(e: MouseEvent<HTMLAnchorElement>) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  const id = e.currentTarget.hash.slice(1)
  const el = id ? document.getElementById(id) : null
  if (!el) return
  e.preventDefault()
  el.scrollIntoView({ behavior: 'smooth' })
  window.history.replaceState(null, '', `#${id}`)
}
