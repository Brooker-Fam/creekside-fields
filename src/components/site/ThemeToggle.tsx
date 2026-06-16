import { useEffect, useState } from 'react'

type Theme = 'light' | 'medium' | 'dark'

// Click cycles through the three themes in this order.
const ORDER: Theme[] = ['light', 'medium', 'dark']

// Keep these in sync with the no-flash script in index.html and the theme
// blocks in index.css.
const BG: Record<Theme, string> = {
  light: '#faf7f2',
  medium: '#ddcfb4',
  dark: '#181410',
}

// The no-flash script in index.html sets data-theme on <html> before paint,
// so we initialize from whatever it chose (stored choice or system preference).
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'light'
  const t = document.documentElement.getAttribute('data-theme')
  return t === 'dark' || t === 'medium' ? t : 'light'
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    // Keep the <html> background (set inline by the no-flash script) in sync.
    root.style.backgroundColor = BG[theme]
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* private mode / storage disabled — keep working without persistence */
    }
  }, [theme])

  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length]
  const label = `Theme: ${theme}. Switch to ${next} mode.`
  const Icon = theme === 'dark' ? MoonIcon : theme === 'medium' ? HalfIcon : SunIcon

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-linen-200 text-copper-500 transition hover:border-sage-400 hover:text-copper-600 ${className}`}
    >
      <Icon />
    </button>
  )
}

function HalfIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 3.6 A8.4 8.4 0 0 0 12 20.4 Z" fill="currentColor" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12.8A8.6 8.6 0 1 1 11.2 3a6.7 6.7 0 0 0 9.8 9.8Z"
        fill="currentColor"
        opacity="0.92"
      />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="3.6" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7" />
    </svg>
  )
}
