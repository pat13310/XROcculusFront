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
        'gradient-text': 'linear-gradient(to right, #ec4899 20%, #8b5cf6 50%, #6366f1 80%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(0px) scale(1)' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.6, transform: 'scale(0.8)' },
          '50%': { opacity: 0.8, transform: 'scale(1)' },
        },
        wave: {
          '0%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(5deg)' },
          '20%': { transform: 'rotate(0deg)' },
          '30%': { transform: 'rotate(5deg)' },
          '40%': { transform: 'rotate(1deg)' },
          '60%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        'lock-bounce': {
          '0%, 100%': { transform: 'rotate(-6deg) translateY(0)' },
          '25%': { transform: 'rotate(6deg) translateY(-10px)' },
          '50%': { transform: 'rotate(-3deg) translateY(0)' },
          '75%': { transform: 'rotate(3deg) translateY(-5px)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        pulse: 'pulse 3s ease-in-out infinite',
        wave: 'wave 1.5s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'lock-bounce': 'lock-bounce 2s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.8s ease-out forwards var(--delay, 0ms)',
        'slide-in-left': 'slide-in-left 0.8s ease-out forwards var(--delay, 0ms)'
      }
    },
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
        '.transform-gpu': {
          'transform': 'translateZ(0)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
