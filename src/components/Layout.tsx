import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const SECTION_LINKS = [
  { href: '/#pig-shares', label: 'Shares' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#meet-the-farm', label: 'The farm' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#reserve', label: 'Reserve' },
] as const

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-linen-200 bg-linen-50/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <span className="flex flex-col">
            <span className="font-display text-lg text-forest-800 sm:text-xl">Creekside Fields</span>
            <span className="text-xs tracking-wide text-earth-500">Greenwich, NY</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {onHome ? (
            SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-earth-600 transition hover:text-forest-800"
              >
                {link.label}
              </a>
            ))
          ) : (
            <>
              <NavLink to="/" className={navClass}>
                Home
              </NavLink>
              <NavLink to="/about" className={navClass}>
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
        <nav className="border-t border-linen-200 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1 text-sm font-medium">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-earth-600 hover:bg-linen-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-forest-800' : 'text-earth-600 hover:text-forest-800'

function Footer() {
  return (
    <footer className="border-t border-linen-200 bg-linen-100/50">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-display text-xl text-forest-800">Creekside Fields</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-earth-600">
            49 Clarks Mills Rd
            <br />
            Greenwich, NY 12834
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-earth-500">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
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
          <h4 className="text-xs font-semibold uppercase tracking-widest text-earth-500">Contact</h4>
          <p className="mt-4 text-sm">
            <a className="text-earth-600 hover:text-copper-500" href="mailto:brookerhousehold@gmail.com">
              brookerhousehold@gmail.com
            </a>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-earth-500">
            Heritage pasture-raised pork. No hormones, no antibiotics.
          </p>
        </div>
      </div>
    </footer>
  )
}

function Logo() {
  return (
    <span
      aria-hidden
      className="world-logo block h-10 w-10 rounded-full border border-linen-200"
    />
  )
}

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
