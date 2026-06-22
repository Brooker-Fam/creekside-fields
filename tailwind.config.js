/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Themeable palette — resolves to CSS variables so it flips under
        // [data-theme="dark"] (see :root / [data-theme="dark"] in index.css).
        linen: {
          50: 'var(--linen-50)',
          100: 'var(--linen-100)',
          200: 'var(--linen-200)',
        },
        forest: {
          600: 'var(--forest-600)',
          700: 'var(--forest-700)',
          800: 'var(--forest-800)',
        },
        earth: {
          500: 'var(--earth-500)',
          600: 'var(--earth-600)',
          800: 'var(--earth-800)',
        },
        copper: {
          500: 'var(--copper-500)',
          600: 'var(--copper-600)',
        },
        sage: {
          100: 'var(--sage-100)',
          200: 'var(--sage-200)',
          400: 'var(--sage-400)',
          500: 'var(--sage-500)',
        },
        creek: {
          300: 'var(--creek-300)',
          500: 'var(--creek-500)',
        },
        // Raised card/input surface (white in light, warm charcoal in dark).
        surface: 'var(--surface)',
        // Legacy aliases used in admin/reserve/print flows. Now themeable —
        // resolve to RGB-channel CSS vars (see :root / [data-theme=*] in
        // index.css) so cream surfaces, mud text/borders, and the blush accent
        // flip in dark/medium mode and stay legible.
        cream: {
          50: 'rgb(var(--cream-50) / <alpha-value>)',
          100: 'rgb(var(--cream-100) / <alpha-value>)',
          200: 'rgb(var(--cream-200) / <alpha-value>)',
        },
        mud: {
          400: 'rgb(var(--mud-400) / <alpha-value>)',
          600: 'rgb(var(--mud-600) / <alpha-value>)',
          700: 'rgb(var(--mud-700) / <alpha-value>)',
          800: 'rgb(var(--mud-800) / <alpha-value>)',
        },
        blush: {
          400: 'rgb(var(--blush-400) / <alpha-value>)',
          500: 'rgb(var(--blush-500) / <alpha-value>)',
        },
        marigold: { 100: '#f5ead8', 300: '#d4a96a' },
        clay: { 300: '#c49a7a', 500: '#a65d3f' },
        indigo: { 100: '#e8ebe4', 700: '#3d4f36' },
      },
      fontFamily: {
        // Storybook serif system — Marcellus display, Marcellus SC small-caps,
        // Spectral book serif for body/UI and italic accents.
        display: ['"Marcellus"', 'ui-serif', 'Georgia', '"Times New Roman"', 'serif'],
        smallcaps: ['"Marcellus SC"', '"Marcellus"', 'ui-serif', 'serif'],
        accent: ['"Spectral"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Spectral"', 'ui-serif', 'Georgia', 'serif'],
        hand: ['"Spectral"', 'ui-serif', 'Georgia', 'serif'],
      },
      boxShadow: {
        // Themeable — driven by --shadow-* so shadows deepen in dark mode.
        soft: 'var(--shadow-soft)',
        card: 'var(--shadow-card)',
      },
      maxWidth: {
        prose: '42rem',
      },
    },
  },
  plugins: [],
}
