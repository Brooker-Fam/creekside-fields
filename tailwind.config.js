/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fff9ee',
          100: '#f6ecd8',
          200: '#e6d8b9',
        },
        blush: {
          100: '#f7dedb',
          200: '#efbfb8',
          300: '#d9897f',
          400: '#b7665d',
          500: '#87483f',
        },
        marigold: {
          100: '#f8e9b7',
          300: '#e6b94e',
          500: '#a9761f',
        },
        indigo: {
          100: '#dfe4f1',
          400: '#59688e',
          700: '#26304f',
        },
        clay: {
          100: '#efd7c7',
          300: '#d49272',
          500: '#995a43',
        },
        sage: {
          100: '#edf3dd',
          200: '#d4e2b8',
          300: '#abc17e',
          400: '#7f9b5d',
          500: '#5f7845',
          700: '#34482d',
        },
        mud: {
          400: '#9c8368',
          600: '#705741',
          800: '#3d3027',
        },
        creek: {
          100: '#d9edf0',
          300: '#94c3c7',
          500: '#4d8588',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        hand: ['"Cormorant Garamond"', 'ui-serif', 'Georgia', 'serif'],
        body: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 16px 42px -24px rgba(52, 72, 45, 0.28)',
        sketch: '0 18px 48px -28px rgba(61, 48, 39, 0.34)',
        glow: '0 0 42px rgba(230, 185, 78, 0.24)',
      },
      borderRadius: {
        blob: '60% 40% 50% 50% / 50% 60% 40% 50%',
      },
    },
  },
  plugins: [],
}
