/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        webflix: {
          lightblue: '#60a5fa',
          cyan: '#06b6d4',
          dark: '#121212',
          darker: '#0a0a0a',
          light: '#f5f5f5',
        },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
}
