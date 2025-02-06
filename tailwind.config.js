/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#0456FB',
        primary_dark: '#0042C8'
      }
    },
  },
  plugins: [],
}

