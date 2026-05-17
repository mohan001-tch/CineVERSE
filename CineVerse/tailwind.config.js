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
        cinema: {
          dark: '#0a0a0f',
          deeper: '#06060a',
          card: '#12121a',
          surface: '#1a1a2e',
          border: '#2a2a3e',
          text: '#e0e0e8',
          muted: '#8888a0',
          accent: '#00d4ff',
          purple: '#a855f7',
          pink: '#ec4899',
          orange: '#f97316',
          green: '#22c55e',
          red: '#ef4444',
          gold: '#fbbf24',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-slower': 'float 10s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'spin-slow': 'spin 8s linear infinite',
        'particle': 'particle 15s linear infinite',
        'gradient': 'gradient 8s ease infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'typing': 'typing 1.5s steps(3) infinite',
        'border-glow': 'borderGlow 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0,212,255,0.3), 0 0 20px rgba(0,212,255,0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(0,212,255,0.6), 0 0 60px rgba(0,212,255,0.3)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-30px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        particle: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: 0 },
          '10%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: 0 },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        pulseNeon: {
          '0%, 100%': { textShadow: '0 0 5px rgba(0,212,255,0.5), 0 0 20px rgba(0,212,255,0.3)' },
          '50%': { textShadow: '0 0 20px rgba(0,212,255,0.8), 0 0 60px rgba(0,212,255,0.5), 0 0 100px rgba(0,212,255,0.2)' },
        },
        typing: {
          '0%': { content: '.' },
          '33%': { content: '..' },
          '66%': { content: '...' },
        },
        borderGlow: {
          '0%, 100%': { borderColor: 'rgba(0,212,255,0.3)' },
          '50%': { borderColor: 'rgba(168,85,247,0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0,212,255,0.4), 0 0 45px rgba(0,212,255,0.15)',
        'neon-lg': '0 0 30px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.2)',
        'neon-purple': '0 0 15px rgba(168,85,247,0.4), 0 0 45px rgba(168,85,247,0.15)',
        'neon-pink': '0 0 15px rgba(236,72,153,0.4), 0 0 45px rgba(236,72,153,0.15)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'glass-lg': '0 16px 64px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
