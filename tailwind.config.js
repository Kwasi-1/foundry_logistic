/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#075056",
          foreground: "hsl(var(--primary-foreground))",
          green: "#075056",
          gray: "#e4eef0",
          dark: "#1a1a1a",
          50: "#e6f4f5",
          100: "#cce9eb",
          200: "#99d3d7",
          300: "#66bdc3",
          400: "#33a7af",
          500: "#075056",
          600: "#064045",
          700: "#043034",
          800: "#032023",
          900: "#011011",
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
        warning: {
          DEFAULT: "rgba(249, 180, 0, 1)",
          foreground: "#000000",
        },
        gold: {
          DEFAULT: "rgb(244, 178, 51)",
          foreground: "#000000",
        },
      },
      borderRadius: {
        // lg: "0",
        // md: "0",
        // sm: "0",
        // none: "0",
        // DEFAULT: "0",
      },
      fontFamily: {
        sans: ["Public Sans", "sans-serif"],
      },
      fontSize: {
        xs: "11px",
        sm: "13px",
        base: "14px",
        lg: "18px",
        xl: "28px",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        black: "900",
      },
      letterSpacing: {
        tight: "-0.6px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-out-to-top": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-in": "slide-in-from-top 0.3s ease-out",
        "slide-out": "slide-out-to-top 0.3s ease-in",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar-hide')],
};
