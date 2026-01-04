/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1754cf',
        'background-light': '#f6f6f8',
        'background-dark': '#111621',
        'surface-dark': '#1c1f26',
        'border-dark': '#292e38',
        'text-secondary': '#9da6b8',
        'card-dark': '#1c1f26',
        'input-bg': '#292e38',
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Noto Sans', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        'full': '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
  ],
}
