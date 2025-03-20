/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: '#14176C',
        primary_dark: '#0042C8'
      },
      keyframes: {
        typing: {
          '0%': { width: '0%' },
          '100%': { width: '100%' }
        },
        blink: {
          '50%': { opacity: '0' }
        }
      },
    },
    animation: {
      typing: 'typing 3s steps(40, end) forwards', // Added "forwards" to keep text
      blink: 'blink 1s infinite'
    }
  },
    plugins: [],
  };

