import { keyframes } from 'framer-motion';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'custom-gradient': 'linear-gradient(135deg, #1E293B, #111827)',
      },
      animation: {
        'glow': 'glow 4s infinite alternate', 
      },
      keyframes: {
        glow: {
          '0%': { backgroundColor: '#0f172a' },
          '100%': { backgroundColor: '#1e293b' },
        },
      }
    },
  },
  plugins: [],
}
