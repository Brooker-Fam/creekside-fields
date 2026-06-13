import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SparkleField, WhimsyDivider } from './site/Whimsy'

const SECTION_LINKS = [
  { href: '/#shares', label: 'Shares' },
  { href: '/#how', label: 'How it works' },
  { href: '/#pigs', label: 'Our pigs' },
  { href: '/#farm', label: 'The farm' },
  { href: '/#faq', label: 'FAQ' },
] as const

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
        style={{ fontSize: Math.round(size * 0.5), lineHeight: 1.15, marginTop: 2 }}
      >
        <span className="block">Pasture raised,</span>
        <span className="block">family loved</span>
      </span>
    </span>
  )
}

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <header
      className="cf-header border-b border-linen-200 bg-linen-50/90 backdrop-blur-md"
      style={{ position: 'sticky', top: 0, zIndex: 50 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {onHome ? (
            SECTION_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="nav-link">
                {link.label}
              </a>
            ))
          ) : (
            <>
              <NavLink to="/" className="nav-link">
                Home
              </NavLink>
              <NavLink to="/about" className="nav-link">
                Details
              </NavLink>
            </>
          )}
          <a href="/#reserve" className="btn-primary px-4 py-2 text-xs">
            Reserve
          </a>
        </nav>

        <button
          type="button"
          className="text-sm font-medium text-forest-800 md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav className="border-t border-linen-200 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link rounded-md px-3 py-2.5 hover:bg-linen-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#reserve"
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
    <footer className="border-t border-linen-200 bg-linen-100/60">
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
                <a className="text-earth-600 hover:text-copper-500" href={link.href}>
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
