/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Cabinet Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono:    ['"Fira Code"', 'monospace'],
      },
      colors: {
        // Backgrounds — clairs et propres
        bg:       '#f0fafa',
        surface:  '#ffffff',
        'surface-2': '#f5fafa',
        'surface-3': '#eaf4f4',

        // Bordures
        border:   '#d0eaea',
        'border-2': '#b8dede',

        // Teal — couleur principale
        teal: {
          50:  '#e6fafa',
          100: '#ccf5f5',
          200: '#99ebeb',
          300: '#5dd8d8',
          400: '#2ec4c4',
          500: '#14b8b8',   // primaire
          600: '#0e9b9b',
          700: '#0a7a7a',
          800: '#075c5c',
          900: '#054040',
        },

        // Accent — violet doux pour contraste
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },

        // Sémantique
        success: '#10b981',
        warning: '#f59e0b',
        danger:  '#ef4444',

        // Texte
        ink:   '#0f2b2b',
        'ink-2': '#3d6363',
        'ink-3': '#7aa5a5',
        'ink-4': '#b8d8d8',
      },

      boxShadow: {
        xs:   '0 1px 2px rgba(0,0,0,0.05)',
        sm:   '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        card: '0 4px 16px rgba(0,100,100,0.06), 0 1px 3px rgba(0,0,0,0.04)',
        md:   '0 8px 24px rgba(0,100,100,0.1), 0 2px 6px rgba(0,0,0,0.04)',
        glow: '0 0 0 3px rgba(20,184,184,0.15)',
        'glow-lg': '0 8px 32px rgba(20,184,184,0.2)',
      },

      borderRadius: {
        DEFAULT: '10px',
        sm:  '6px',
        md:  '12px',
        lg:  '16px',
        xl:  '20px',
        '2xl': '24px',
      },

      animation: {
        'fade-up':   'fadeUp 0.3s cubic-bezier(.16,1,.3,1) both',
        'fade-in':   'fadeIn 0.2s ease both',
        'scale-in':  'scaleIn 0.2s cubic-bezier(.16,1,.3,1) both',
        'shimmer':   'shimmer 1.6s linear infinite',
        'pulse-teal':'pulseTeal 2.5s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:    { from: { opacity: 0, transform: 'translateY(10px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:    { from: { opacity: 0 }, to: { opacity: 1 } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.96)' }, to: { opacity: 1, transform: 'none' } },
        shimmer:   { '0%': { backgroundPosition: '-400% 0' }, '100%': { backgroundPosition: '400% 0' } },
        pulseTeal: { '0%,100%': { boxShadow: '0 0 0 0 rgba(20,184,184,0)' }, '50%': { boxShadow: '0 0 0 6px rgba(20,184,184,0.12)' } },
      },
    },
  },
  plugins: [],
}
