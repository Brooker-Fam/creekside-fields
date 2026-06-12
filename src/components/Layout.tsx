import { Link, NavLink, Outlet } from 'react-router-dom'

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sage-200/60 bg-cream-50/88 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-3">
          <Logo />
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl font-semibold text-sage-700">Creekside Fields</span>
            <span className="font-hand text-base italic leading-4 text-blush-500">pasture pork, gently raised</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold sm:flex">
          <NavLink to="/" end className={navClass}>Pig shares</NavLink>
          <NavLink to="/about" className={navClass}>How it works</NavLink>
          <a href="mailto:brookerhousehold@gmail.com" className="hidden lg:inline">Get in touch</a>
        </nav>
      </div>
    </header>
  )
}

const navClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'text-blush-500 underline decoration-blush-200 underline-offset-4' : 'text-sage-700/80 hover:text-blush-500'

function Footer() {
  return (
    <footer className="mt-24 border-t border-sage-200/70 bg-sage-100/70">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <div className="font-display text-3xl font-semibold text-sage-700">Creekside Fields</div>
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
    <span
      aria-hidden
      className="world-logo block h-12 w-12 rounded-full border-2 border-sage-300/70 shadow-soft"
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
