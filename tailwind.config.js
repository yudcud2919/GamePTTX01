/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        pixel: ['"Chakra Petch"', '"Be Vietnam Pro"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        winter: {
          950: '#0d1a21',
          900: '#13262f',
          800: '#1b353e',
          700: '#274952',
          600: '#356068',
        },
        pine: {
          700: '#254c43',
          600: '#2f6154',
          500: '#49856f',
          400: '#74b096',
          300: '#a7d4bf',
        },
        snow: {
          50: '#fbf8f1',
          100: '#f3ecde',
          200: '#e2d7c2',
          300: '#c7d8db',
        },
        lantern: {
          500: '#d89b48',
          400: '#e8b86d',
          300: '#f5d497',
        },
        holly: {
          600: '#a84448',
          500: '#c75b5f',
          400: '#e07c7f',
        },
      },
      boxShadow: {
        'pixel-card':
          '0 4px 0 0 rgba(8, 18, 24, 0.72), inset 0 1px 0 0 rgba(243, 236, 222, 0.14)',
        'pixel-gold':
          '0 4px 0 0 rgba(120, 74, 24, 0.65), 0 0 22px rgba(232, 184, 109, 0.25)',
        'pixel-pine':
          '0 4px 0 0 rgba(20, 48, 42, 0.75), 0 0 20px rgba(116, 176, 150, 0.22)',
        'pixel-holly':
          '0 4px 0 0 rgba(104, 34, 38, 0.75), 0 0 22px rgba(199, 91, 95, 0.3)',
      },
      keyframes: {
        snowDrift: {
          '0%': { transform: 'translateY(-10vh) translateX(0px)' },
          '50%': { transform: 'translateY(50vh) translateX(14px)' },
          '100%': { transform: 'translateY(110vh) translateX(-8px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.45' },
          '50%': { opacity: '1' },
        },
        kenBurns: {
          '0%': { transform: 'scale(1.0) translate(0%, 0%)' },
          '50%': { transform: 'scale(1.06) translate(-1%, -0.8%)' },
          '100%': { transform: 'scale(1.0) translate(0%, 0%)' },
        },
      },
      animation: {
        'snow-drift': 'snowDrift 10s linear infinite',
        twinkle: 'twinkle 2.6s ease-in-out infinite',
        'ken-burns': 'kenBurns 22s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
