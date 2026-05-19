import { Link, NavLink, Outlet } from 'react-router-dom'

function Header() {
  return (
    <header className="border-b-2 border-mud-800 bg-cream-100">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="flex flex-col leading-none">
            <span className="hand text-3xl text-blush-500">Creekside</span>
            <span className="font-display text-xl font-semibold tracking-tight">Fields</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-semibold">
          <NavLink to="/" end className={navClass}>The hogs</NavLink>
          <NavLink to="/about" className={navClass}>How it works</NavLink>
          <a href="mailto:brookerhousehold@gmail.com" className="hidden sm:inline">Get in touch</a>
        </nav>
      </div>
    </header>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-blush-500 underline decoration-wavy underline-offset-4' : 'hover:text-blush-500'

function Footer() {
  return (
    <footer className="mt-24 border-t-2 border-mud-800 bg-sage-100">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="hand text-3xl text-blush-500">Creekside Fields</div>
          <p className="mt-2 text-sm text-mud-600">
            49 Clarks Mills Rd<br />Greenwich, NY 12834
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-display text-lg">Say hi</h4>
          <p className="text-sm">
            <a className="underline" href="mailto:brookerhousehold@gmail.com">brookerhousehold@gmail.com</a>
          </p>
        </div>
        <div>
          <h4 className="mb-2 font-display text-lg">Small print</h4>
          <p className="text-sm text-mud-600">
            Pasture-raised. No hormones, no antibiotics, lots of fresh air.
          </p>
        </div>
      </div>
    </footer>
  )
}

function Logo() {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden>
      <circle cx="22" cy="22" r="20" fill="#fce4e0" stroke="#3f2c1d" strokeWidth="2" />
      <circle cx="14" cy="18" r="3" fill="#3f2c1d" />
      <circle cx="29" cy="14" r="2.4" fill="#3f2c1d" />
      <circle cx="32" cy="27" r="3.6" fill="#3f2c1d" />
      <circle cx="17" cy="30" r="2" fill="#3f2c1d" />
      <ellipse cx="22" cy="28" rx="5" ry="3.5" fill="#eea29a" stroke="#3f2c1d" strokeWidth="1.5" />
      <circle cx="20" cy="28" r="0.8" fill="#3f2c1d" />
      <circle cx="24" cy="28" r="0.8" fill="#3f2c1d" />
    </svg>
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
