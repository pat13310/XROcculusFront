/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      textShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.2)',
        lg: '0 2px 4px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-text': 'linear-gradient(to right, #9333ea, #ec4899, #6d28d9)',
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          'text-shadow': '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        '.text-shadow': {
          'text-shadow': '0 1px 3px rgba(0, 0, 0, 0.2)',
        },
        '.text-shadow-lg': {
          'text-shadow': '0 2px 4px rgba(0, 0, 0, 0.3)',
        },
        '.gradient-text': {
          'background-image': 'linear-gradient(to right, #9333ea, #ec4899, #6d28d9)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          'color': 'transparent',
          '-webkit-text-stroke': '1.5px rgba(126, 34, 206, 0.3)',
          'paint-order': 'stroke fill',
          '-webkit-text-fill-color': 'transparent'
        }
      }
      addUtilities(newUtilities)
    }
  ]
};
