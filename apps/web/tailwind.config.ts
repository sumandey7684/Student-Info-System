import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        card: { DEFAULT: 'var(--card)', foreground: 'var(--card-foreground)' },
        border: 'var(--border)',
        ring: 'var(--ring)',
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
          muted: 'var(--accent-muted)',
        },
        destructive: { DEFAULT: 'var(--destructive)', foreground: 'var(--destructive-foreground)' },
        success: { DEFAULT: 'var(--success)', muted: 'var(--success-muted)' },
        warning: { DEFAULT: 'var(--warning)', muted: 'var(--warning-muted)' },
        input: 'var(--input-border)',
      },
      spacing: {
        gutter: '1.25rem',
        xs: '0.25rem',
        sm: '0.375rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        section: '2.25rem',
        page: '1.75rem',
      },
      borderRadius: {
        xs: 'var(--radius-xs)',
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      ringOffsetColor: {
        background: 'var(--background)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': [
          '2.25rem',
          { lineHeight: '2.75rem', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        'display-md': [
          '1.75rem',
          { lineHeight: '2.25rem', fontWeight: '600', letterSpacing: '-0.02em' },
        ],
        headline: ['1.125rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        subtitle: [
          '0.9375rem',
          { lineHeight: '1.375rem', fontWeight: '500', letterSpacing: '0.02em' },
        ],
        body: ['0.9375rem', { lineHeight: '1.5rem' }],
        caption: ['0.75rem', { lineHeight: '1.125rem' }],
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(120%) skewX(-12deg)' } },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config;
