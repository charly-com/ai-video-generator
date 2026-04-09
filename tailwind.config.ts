// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        dm: ['var(--font-dm)', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#f97316',
          'orange-dim': '#ea6c0a',
          amber: '#f59e0b',
          pink: '#ec4899',
          purple: '#a855f7',
          cyan: '#06b6d4',
        },
        surface: {
          base: '#0a0a0f',
          card: '#12121a',
          elevated: '#1e1e2e',
          input: '#16161f',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #f97316 0%, #ec4899 50%, #a855f7 100%)',
        'orange-gradient': 'linear-gradient(135deg, #f97316, #f59e0b)',
        'dark-gradient': 'linear-gradient(135deg, #12121a 0%, #1e1e2e 100%)',
        'card-glow': 'radial-gradient(ellipse at top, rgba(249,115,22,0.1) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        'slide-up': 'slide-up 0.4s ease forwards',
        'gradient': 'gradient-x 4s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(249,115,22,0.5), 0 0 80px rgba(249,115,22,0.1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'bounce-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '70%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      screens: {
        xs: '375px',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'brand': '0 8px 25px rgba(249,115,22,0.35)',
        'glow-orange': '0 0 40px rgba(249,115,22,0.2)',
        'glow-purple': '0 0 40px rgba(168,85,247,0.2)',
        'card': '0 20px 60px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config