/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfaf3',
          100: '#fbf3e1',
          200: '#f5e6c4',
        },
        blush: {
          100: '#fce4e0',
          200: '#f6c8c0',
          300: '#eea29a',
          400: '#e07a72',
          500: '#c25a52',
        },
        sage: {
          100: '#e2ebe0',
          200: '#bdd1ba',
          300: '#8fb18b',
          400: '#5f8b5a',
          500: '#456b41',
          700: '#2f4a2c',
        },
        mud: {
          400: '#9a7b5f',
          600: '#6b4f37',
          800: '#3f2c1d',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        hand: ['"Caveat"', 'cursive'],
        body: ['"Nunito"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(63, 44, 29, 0.18)',
        sketch: '4px 4px 0 0 #3f2c1d',
      },
      borderRadius: {
        blob: '60% 40% 50% 50% / 50% 60% 40% 50%',
      },
    },
  },
  plugins: [],
}
