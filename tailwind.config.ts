// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/core/**/*.{ts,tsx}',
    './src/types/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Paleta base do dashboard
        dashboard: {
          bg: '#0f172a', // fundo geral (slate-900)
          surface: '#020617', // superfície principal (slate-950)
          card: '#020617',
          cardSoft: '#0b1120',
          border: '#1f2937',
          separator: '#111827',
          primary: '#22c55e',
          primarySoft: '#16a34a',
          primaryMuted: '#15803d',
          danger: '#ef4444',
          warning: '#f59e0b',
          info: '#0ea5e9',
          text: '#e5e7eb',
          textMuted: '#9ca3af'
        }
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        card: '0 18px 45px rgba(15, 23, 42, 0.75)'
      }
    }
  },
  plugins: []
};

export default config;
