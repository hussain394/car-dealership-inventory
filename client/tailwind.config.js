/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f6f4',
          100: '#e2ebe4',
          200: '#c3d6c9',
          300: '#9cbba6',
          400: '#6f9a7e',
          500: '#4d7c5f',
          600: '#39634a',
          700: '#2e4f3c',
          800: '#264032',
          900: '#20352a',
        },
        canvas: '#faf9f6',
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20, 30, 24, 0.04), 0 4px 12px rgba(20, 30, 24, 0.06)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};