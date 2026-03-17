/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      colors: {
        notion: {
          bg: '#ffffff',
          'bg-secondary': '#f7f7f5',
          'bg-hover': '#f1f1ef',
          border: '#e9e9e7',
          'border-dark': '#d3d3cf',
          text: '#37352f',
          'text-secondary': '#9b9a97',
          'text-tertiary': '#b5b4b0',
          accent: '#2f80ed',
          'accent-light': '#e8f0fd',
          red: '#eb5757',
          'red-light': '#fbe4e4',
          green: '#0f9b58',
          'green-light': '#ddedea',
          yellow: '#dfab01',
          'yellow-light': '#fdecc8',
          purple: '#9065b0',
          'purple-light': '#f4eefd',
        },
      },
    },
  },
  plugins: [],
}
