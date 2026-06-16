import { useEffect, useState, type MouseEvent } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { SparkleField, WhimsyDivider } from './site/Whimsy'
import { ThemeToggle } from './site/ThemeToggle'

const SECTION_LINKS = [
  { href: '/shares', label: 'Shares' },
  { href: '/#how', label: 'How it works' },
  { href: '/our-pigs', label: 'Our pigs' },
  { href: '/#faq', label: 'FAQ' },
] as const

// On the home page, scroll straight to the section (native fragment navigation
// doesn't fire reliably with this page's scroll container — html, made
// scrollable by overflow-x: hidden — so we drive scrollIntoView ourselves; the
// section's scroll-margin-top keeps it clear of the sticky header). On other
// pages, let the link navigate home so the mount effect scrolls once it loads.
// Non-anchor links (e.g. /our-pigs) pass through untouched.
function handleSectionClick(e: MouseEvent<HTMLAnchorElement>, href: string) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
  const id = href.includes('#') ? href.split('#')[1] : ''
  if (!id || window.location.pathname !== '/') return
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  el.scrollIntoView()
  window.history.replaceState(null, '', `/#${id}`)
}

function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="flex flex-col" style={{ lineHeight: 1.04 }}>
      <span
        className="font-display leading-none text-forest-800"
        style={{ fontSize: size, whiteSpace: 'nowrap' }}
      >
        Creekside Fields
      </span>
      <span
        className="font-accent italic text-copper-500"
        style={{ fontSize: Math.round(size * 0.5), lineHeight: 1.15, marginTop: 2, whiteSpace: 'nowrap' }}
      >
        Pasture raised, family loved
      </span>
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="cf-header border-b border-linen-200 backdrop-blur-md"
      style={{ position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-[26px]">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={(e) => handleSectionClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a href="/shares" className="btn-primary px-4 py-2 text-xs">
            Reserve
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="text-sm font-medium text-forest-800"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-linen-200 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link rounded-md px-3 py-2.5 hover:bg-linen-100"
                onClick={(e) => {
                  handleSectionClick(e, link.href)
                  setOpen(false)
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/shares"
              className="btn-primary mt-2 px-4 py-2 text-xs"
              onClick={() => setOpen(false)}
            >
              Reserve
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="cf-footer border-t border-linen-200">
      <div className="pb-2 pt-10">
        <WhimsyDivider />
      </div>
      <div className="mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-8 sm:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 text-sm leading-relaxed text-earth-600">
            49 Clarks Mills Rd
            <br />
            Greenwich, NY 12834
          </p>
        </div>
        <div>
          <h4 className="label">Explore</h4>
          <ul className="mt-4 space-y-2 text-base">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  className="text-earth-600 hover:text-copper-500"
                  href={link.href}
                  onClick={(e) => handleSectionClick(e, link.href)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="label">Contact</h4>
          <p className="mt-4 text-base">
            <a
              className="text-earth-600 hover:text-copper-500"
              href="mailto:brookerhousehold@gmail.com"
            >
              brookerhousehold@gmail.com
            </a>
          </p>
          <p className="mt-4 font-accent text-base italic leading-relaxed text-earth-500">
            Heritage pasture-raised pork. No hormones, no antibiotics.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Layout() {
  // When the page loads at a section anchor (e.g. arriving at /#shares from
  // another page), scroll to it once the content has rendered. The browser's
  // native fragment scroll misses because the section doesn't exist yet at
  // load; we retry a few times as images load and the layout settles.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    const scroll = () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant' as ScrollBehavior })
    }
    // Re-scroll as the layout settles — images loading above the section shift
    // its offset, so a single early scroll lands short.
    const timers = [0, 80, 200, 400, 800, 1200].map((t) => window.setTimeout(scroll, t))
    window.addEventListener('load', scroll)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('load', scroll)
    }
  }, [])

  return (
    <div className="book flex min-h-screen flex-col">
      <SparkleField />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
