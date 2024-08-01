/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: '#212529',
          subtle: '#1b1d20',
          secondary: '#343a40',
        },
        primary:
        {
          DEFAULT: '#0d6efd',
          emphasis: '#007bff',
        },
        border: {
          DEFAULT: '#495057',
        },
        body: {
          DEFAULT: '#f8f9fa',
          secondary: '#6c757d',
        },

      },
    },
  },
  plugins: [],
}

