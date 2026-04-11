import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        heading: ['Roboto', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1A2238", // Midnight Navy
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'template-primary': "hsl(var(--color-primary))",
        'template-secondary': "hsl(var(--color-secondary))",
        'template-background': "hsl(var(--color-background))",
        'text-dark': "hsl(var(--color-text-dark))",
        'text-light': "hsl(var(--color-text-light))",
        'navy-deep': "hsl(var(--navy-deep))",
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-hero': 'var(--gradient-hero)',
        'navy-gradient': 'var(--navy-gradient)',
      },
      boxShadow: {
        'sm': '0 1px 3px 0 rgba(26, 34, 56, 0.05), 0 1px 2px 0 rgba(26, 34, 56, 0.04)',
        'md': '0 4px 6px -1px rgba(26, 34, 56, 0.08), 0 2px 4px -1px rgba(26, 34, 56, 0.05)',
        'lg': '0 10px 15px -3px rgba(26, 34, 56, 0.1), 0 4px 6px -2px rgba(26, 34, 56, 0.04)',
        'glass': '0 8px 32px 0 rgba(26, 34, 56, 0.07)',
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "slow-zoom": {
          "0%, 100%": {
            transform: "scale(1)",
          },
          "50%": {
            transform: "scale(1.1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slow-zoom": "slow-zoom 20s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
