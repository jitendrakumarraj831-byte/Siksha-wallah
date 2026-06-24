import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    // colorMap classes assembled dynamically at runtime — Tailwind can't detect these statically
    // blue
    'text-blue-700', 'border-blue-600', 'bg-blue-50', 'bg-blue-600', 'hover:bg-blue-700',
    'hover:border-blue-300', 'bg-blue-100', 'text-blue-600', 'from-blue-600', 'to-indigo-700',
    'from-blue-500', 'to-indigo-500', 'bg-blue-50/40', 'shadow-blue-200', 'border-blue-100',
    'text-blue-800', 'text-blue-500',
    // red
    'text-red-700', 'border-red-600', 'bg-red-50', 'bg-red-600', 'hover:bg-red-700',
    'hover:border-red-300', 'bg-red-100', 'text-red-600', 'from-red-600', 'to-rose-700',
    'from-red-500', 'to-rose-500', 'bg-red-50/40', 'shadow-red-200', 'border-red-100',
    'text-red-800', 'text-red-500',
    // green
    'text-green-700', 'border-green-600', 'bg-green-50', 'bg-green-600', 'hover:bg-green-700',
    'hover:border-green-300', 'bg-green-100', 'text-green-600', 'from-green-600', 'to-green-800',
    'from-green-500', 'to-green-700', 'bg-green-50/40', 'shadow-green-200', 'border-green-100',
    'text-green-800', 'text-green-500',
    // amber
    'text-amber-700', 'border-amber-600', 'bg-amber-50', 'bg-amber-600', 'hover:bg-amber-700',
    'hover:border-amber-300', 'bg-amber-100', 'text-amber-600', 'from-amber-500', 'to-orange-600',
    'from-amber-400', 'to-orange-500', 'bg-amber-50/40', 'shadow-amber-200', 'border-amber-100',
    'text-amber-800', 'text-amber-500',
    // orange
    'text-orange-700', 'border-orange-600', 'bg-orange-50', 'bg-orange-600', 'hover:bg-orange-700',
    'hover:border-orange-300', 'bg-orange-100', 'text-orange-600', 'from-orange-600', 'to-amber-600',
    'from-orange-500', 'to-amber-500', 'bg-orange-50/40', 'shadow-orange-200', 'border-orange-100',
    'text-orange-800', 'text-orange-500',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        headline: ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          'blue': '#003f9f',
          'red': '#dc143c',
          'green': '#2d5016',
          'yellow': '#ffc107',
          'orange': '#ff8c00',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
