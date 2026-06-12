import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

const SECTION_LINKS = [
  { href: '/#pig-shares', label: 'Shares' },
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#meet-the-farm', label: 'Meet the farm' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/#reserve', label: 'Reserve' },
] as const

function Header() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const onHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream-50/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-semibold text-sage-700 sm:text-2xl">Creekside Fields</span>
            <span className="font-hand text-sm italic leading-4 text-blush-500 sm:text-base">
              Greenwich, NY · pasture pork
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
          {onHome ? (
            SECTION_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sage-700/80 transition hover:text-blush-500">
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
          <a
            href="mailto:brookerhousehold@gmail.com"
            className="rounded-full border border-sage-300/50 bg-cream-100/80 px-4 py-2 text-sage-700 transition hover:border-marigold-300/60 hover:bg-marigold-100/50"
          >
            Get in touch
          </a>
        </nav>

        <button
          type="button"
          className="rounded-full border border-sage-300/50 bg-cream-100/80 px-3 py-2 text-sm font-semibold text-sage-700 md:hidden"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav className="border-t border-sage-200/60 bg-cream-50/95 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 text-sm font-semibold">
            {SECTION_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sage-700 hover:bg-sage-100/60"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="mailto:brookerhousehold@gmail.com"
              className="btn-secondary justify-center"
              onClick={() => setOpen(false)}
            >
              Email us
            </a>
          </div>
        </nav>
      )}
    </header>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive
    ? 'text-blush-500 underline decoration-blush-200 underline-offset-4'
    : 'text-sage-700/80 hover:text-blush-500'

function Footer() {
  return (
    <footer className="mt-12 border-t border-sage-200/70 bg-sage-100/70">
      <div className="folk-border mx-auto max-w-6xl opacity-60" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo />
            <div className="font-display text-2xl font-semibold text-sage-700 sm:text-3xl">Creekside Fields</div>
          </div>
          <p className="mt-3 text-sm leading-6 text-mud-600">
            49 Clarks Mills Rd
            <br />
            Greenwich, NY 12834
          </p>
          <p className="mt-2 font-hand text-lg italic text-blush-500">A small regenerative family farm</p>
        </div>
        <div>
          <h4 className="mb-2 font-display text-lg text-sage-700">Explore</h4>
          <ul className="space-y-2 text-sm">
            {SECTION_LINKS.map((link) => (
              <li key={link.href}>
                <a className="text-mud-600 underline-offset-2 hover:text-blush-500 hover:underline" href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 font-display text-lg text-sage-700">Say hi</h4>
          <p className="text-sm">
            <a className="text-mud-600 underline hover:text-blush-500" href="mailto:brookerhousehold@gmail.com">
              brookerhousehold@gmail.com
            </a>
          </p>
          <p className="mt-4 text-sm text-mud-600">
            Pasture-raised heritage pork. No hormones, no antibiotics, lots of fresh air and creek water.
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
      className="world-logo block h-11 w-11 rounded-full border-2 border-sage-300/70 shadow-soft sm:h-12 sm:w-12"
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
