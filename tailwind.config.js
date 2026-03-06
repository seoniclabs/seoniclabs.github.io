/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        surface: 'var(--surface)',
        'surface-border': 'var(--surface-border)',
        ink: 'var(--ink)',
        'ink-secondary': 'var(--ink-secondary)',
        'ink-tertiary': 'var(--ink-tertiary)',
        brand: 'var(--brand)',
        'brand-deep': 'var(--brand-deep)',
        accent: 'var(--accent)',
        'accent-warm': 'var(--accent-warm)',
        'accent-dim': 'var(--accent-dim)',
      },
      fontFamily: {
        sans: ['Pretendard', 'sans-serif'],
        display: ['Space Grotesk', 'Pretendard', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
    },
  },
  plugins: [],
}
