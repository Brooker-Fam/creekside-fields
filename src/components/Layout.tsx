import { useEffect, useState, type MouseEvent } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { FireflyField, FooterFireflies, WhimsyDivider } from './site/Whimsy'
import { ThemeToggle } from './site/ThemeToggle'

const SECTION_LINKS = [
  { href: '/shares', label: 'Pork' },
  { href: '/geese-and-ducks', label: 'Geese & ducks' },
  { href: '/#how', label: 'How it works' },
  { href: '/our-pigs', label: 'Our pigs' },
  { href: '/#faq', label: 'Questions' },
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

function Logo({ size = 22, dusk = false }: { size?: number; dusk?: boolean }) {
  return (
    <span className="flex flex-col" style={{ lineHeight: 1.04 }}>
      <span
        className={`font-display leading-none ${dusk ? '' : 'text-forest-800'}`}
        style={{ fontSize: size, whiteSpace: 'nowrap', ...(dusk ? { color: '#f1ebde' } : null) }}
      >
        Creekside Fields
      </span>
      <span
        className={`font-accent italic ${dusk ? '' : 'text-copper-500'}`}
        style={{
          fontSize: Math.round(size * 0.55),
          lineHeight: 1.15,
          marginTop: 2,
          whiteSpace: 'nowrap',
          ...(dusk ? { color: '#e8b892' } : null),
        }}
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

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          <div className="flex items-center gap-5 xl:gap-[26px]">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link whitespace-nowrap"
                onClick={(e) => handleSectionClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <a href="/contact" className="btn-pill">
            Contact us
          </a>
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center px-2 text-sm font-medium text-forest-800"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-linen-200 px-6 py-4 lg:hidden">
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
              href="/contact"
              className="btn-pill mt-2 self-start"
              onClick={() => setOpen(false)}
            >
              Contact us
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

function Footer() {
  return (
    <>
      <div className="pb-8 pt-14">
        <WhimsyDivider />
      </div>
      <footer className="cf-footer">
        <FooterFireflies />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-12 sm:grid-cols-3">
          <div>
            <Logo dusk />
            <p className="footer-muted mt-4 text-[0.95rem] leading-relaxed">
              49 Clarks Mills Rd
              <br />
              Greenwich, NY 12834
            </p>
          </div>
          <div>
            <h2 className="footer-label">Explore</h2>
            <ul className="mt-4 space-y-2 text-base">
              {SECTION_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => handleSectionClick(e, link.href)}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="footer-label">Contact</h2>
            <p className="mt-4 text-base">
              <a href="/contact">Send us a note</a>
            </p>
            <p className="mt-2 text-base">
              <a href="mailto:brookerhousehold@gmail.com">brookerhousehold@gmail.com</a>
            </p>
            <p className="footer-muted mt-5 font-accent text-base italic leading-relaxed">
              Heritage pork, raised on pasture in Greenwich, NY. No antibiotics.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default function Layout() {
  const { pathname, hash } = useLocation()

  // In-app navigation keeps the old scroll position by default; start each new
  // page at the top unless the link targets a section.
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

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
      <FireflyField />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
