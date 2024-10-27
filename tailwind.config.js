const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'daring-indigo': '#4B4E6D',
        'parfait': '#C6B3AB',
        'puturple': '#B2A7D1',
        'emerald-pool': '#346B6D',
        'napoleon': '#4A4A4A',
        'notion': {
          default: '#37352F',
          gray: '#787774',
          hover: '#F7F7F7',
          border: '#E6E6E6',
        }
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight: '-0.01em',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}