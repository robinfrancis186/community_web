/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      primary: {
        DEFAULT: '#9333ea', // Purple 600 (from logo)
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7e22ce',
        800: '#6b21a8',
        900: '#581c87',
      },
      secondary: {
        DEFAULT: '#3b82f6', // Blue 500 (from logo)
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      colors: {
        background: '#f8fafc', // Slate 50 (Light)
        surface: '#ffffff', // White (Light)
        text: '#0f172a', // Slate 900 (Dark Text)
      },
      // Also keeping these as top-level extend properties if they were used that way, 
      // but usually they should be under colors. 
      // The previous config had them directly under extend, which works as custom colors too.
      // I will keep them as they were to avoid breaking existing usages, but ensure valid JS syntax.
      backgroundColor: {
        background: '#f8fafc',
        surface: '#ffffff',
      },
      textColor: {
        text: '#0f172a',
      }
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
}
