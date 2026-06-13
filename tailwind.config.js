/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        linen: {
          50: '#faf7f2',
          100: '#f3ede4',
          200: '#e8dfd2',
        },
        forest: {
          600: '#3d4f36',
          700: '#2f3d2a',
          800: '#243021',
        },
        earth: {
          500: '#6b5a4a',
          600: '#5c4e42',
          800: '#2c241c',
        },
        copper: {
          500: '#a65d3f',
          600: '#8f4e34',
        },
        sage: {
          100: '#eef2e8',
          200: '#d8e2cc',
          400: '#8fa07a',
          500: '#6b8058',
        },
        creek: {
          300: '#8fada8',
          500: '#5f857d',
        },
        // Legacy aliases used in admin/reserve flows
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
        soft: '0 12px 40px -20px rgba(44, 36, 28, 0.18)',
        card: '0 1px 3px rgba(44, 36, 28, 0.06), 0 8px 24px -12px rgba(44, 36, 28, 0.1)',
      },
      maxWidth: {
        prose: '42rem',
      },
    },
  },
  plugins: [],
}
