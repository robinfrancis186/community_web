/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Modern vibrant primary palette - Rich Purple
        primary: {
          DEFAULT: 'hsl(271, 81%, 56%)', // Vibrant purple
          50: 'hsl(270, 100%, 98%)',
          100: 'hsl(269, 100%, 95%)',
          200: 'hsl(269, 100%, 92%)',
          300: 'hsl(270, 95%, 85%)',
          400: 'hsl(270, 91%, 75%)',
          500: 'hsl(271, 81%, 56%)',
          600: 'hsl(271, 76%, 53%)',
          700: 'hsl(272, 72%, 47%)',
          800: 'hsl(273, 67%, 39%)',
          900: 'hsl(274, 66%, 32%)',
          950: 'hsl(275, 79%, 21%)',
        },
        // Complementary secondary - Electric Blue
        secondary: {
          DEFAULT: 'hsl(217, 91%, 60%)',
          50: 'hsl(214, 100%, 97%)',
          100: 'hsl(214, 95%, 93%)',
          200: 'hsl(213, 97%, 87%)',
          300: 'hsl(212, 96%, 78%)',
          400: 'hsl(213, 94%, 68%)',
          500: 'hsl(217, 91%, 60%)',
          600: 'hsl(221, 83%, 53%)',
          700: 'hsl(224, 76%, 48%)',
          800: 'hsl(226, 71%, 40%)',
          900: 'hsl(224, 64%, 33%)',
          950: 'hsl(226, 57%, 21%)',
        },
        // Accent colors
        accent: {
          cyan: 'hsl(189, 94%, 43%)',
          pink: 'hsl(328, 86%, 70%)',
          orange: 'hsl(25, 95%, 53%)',
          green: 'hsl(142, 71%, 45%)',
          yellow: 'hsl(45, 93%, 47%)',
        },
        // Neutral palette
        background: 'hsl(222, 47%, 11%)', // Dark background
        'background-light': 'hsl(210, 40%, 98%)', // Light mode background
        surface: 'hsl(217, 33%, 17%)', // Card background
        'surface-light': 'hsl(0, 0%, 100%)', // Light mode surface
        border: 'hsl(215, 20%, 25%)',
        'border-light': 'hsl(214, 32%, 91%)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, hsl(271, 81%, 56%) 0%, hsl(217, 91%, 60%) 100%)',
        'gradient-secondary': 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(189, 94%, 43%) 100%)',
        'gradient-accent': 'linear-gradient(135deg, hsl(328, 86%, 70%) 0%, hsl(271, 81%, 56%) 100%)',
        'gradient-warm': 'linear-gradient(135deg, hsl(25, 95%, 53%) 0%, hsl(45, 93%, 47%) 100%)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsl(271, 81%, 56%) 0px, transparent 50%), radial-gradient(at 80% 0%, hsl(217, 91%, 60%) 0px, transparent 50%), radial-gradient(at 0% 50%, hsl(189, 94%, 43%) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px hsla(271, 81%, 56%, 0.3)',
        'glow-secondary': '0 0 20px hsla(217, 91%, 60%, 0.3)',
        'glow-accent': '0 0 20px hsla(189, 94%, 43%, 0.3)',
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      display: ['Outfit', 'Inter', 'sans-serif'],
    },
  },
  plugins: [],
}
