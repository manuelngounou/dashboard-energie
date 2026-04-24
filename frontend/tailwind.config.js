/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: '#0b0e15',
          1: '#10141e',
          2: '#161b28',
          3: '#1c2333',
          4: '#232c40',
          5: '#2a3450',
        },
        accent: {
          green:     '#00e5a0',
          'green-d': '#00b87a',
          'green-l': '#80ffcf',
          blue:      '#4d9fff',
          orange:    '#ff8c42',
          red:       '#ff4d6a',
          yellow:    '#ffd166',
          purple:    '#b06fff',
        },
        ink: {
          DEFAULT: '#e2e8f4',
          2:       '#a0abc0',
          3:       '#5a6680',
          4:       '#2e3a52',
        }
      },
      boxShadow: {
        card:   '0 2px 16px rgba(0,0,0,0.5)',
        glow:   '0 0 20px rgba(0,229,160,0.12)',
        'glow-lg': '0 0 40px rgba(0,229,160,0.2)',
        modal:  '0 8px 48px rgba(0,0,0,0.7)',
      },
      animation: {
        'fade-up':    'fadeUp 0.35s ease both',
        'fade-in':    'fadeIn 0.25s ease both',
        'slide-in':   'slideIn 0.3s ease both',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2.5s ease-in-out infinite',
        'shimmer':    'shimmer 1.6s linear infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn:   { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'none' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 12px rgba(0,229,160,0.1)' }, '50%': { boxShadow: '0 0 24px rgba(0,229,160,0.3)' } },
        shimmer:   { '0%': { backgroundPosition: '-400% 0' }, '100%': { backgroundPosition: '400% 0' } },
      }
    }
  },
  plugins: []
}
