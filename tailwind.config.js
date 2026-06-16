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
        // Legacy aliases used in admin/reserve/print flows — fixed, not themed.
        cream: { 50: '#faf7f2', 100: '#f3ede4', 200: '#e8dfd2' },
        mud: { 400: '#8a7968', 600: '#5c4e42', 700: '#4a3f35', 800: '#2c241c' },
        blush: { 400: '#b87a62', 500: '#a65d3f' },
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
