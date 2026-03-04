/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: '#1a0f0a',
        'luxury-light': '#2a1a12',
        cream: '#f5f0e8',
        gold: '#D4AF37',
        'gold-light': '#e8c84a',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
