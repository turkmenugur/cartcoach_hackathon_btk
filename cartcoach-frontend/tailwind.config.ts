import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Brand Colors mapped from design tokens ────────── */
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50:  "var(--color-primary-50)",
          100: "var(--color-primary-100)",
          200: "var(--color-primary-200)",
          300: "var(--color-primary-300)",
          400: "var(--color-primary-400)",
          500: "var(--color-primary-500)",
          600: "var(--color-primary-600)",
          700: "var(--color-primary-700)",
          800: "var(--color-primary-800)",
          900: "var(--color-primary-900)",
        },
        accent: {
          50:  "var(--color-secondary-50)",
          100: "var(--color-secondary-100)",
          200: "var(--color-secondary-200)",
          500: "var(--color-secondary-500)",
          600: "var(--color-secondary-600)",
          700: "var(--color-secondary-700)",
          800: "var(--color-secondary-800)",
          900: "var(--color-secondary-900)",
        },
        surface: {
          primary:   "var(--surface-primary)",
          secondary: "var(--surface-secondary)",
          elevated:  "var(--surface-elevated)",
          overlay:   "var(--surface-overlay)",
        },
        success: {
          50:  "var(--color-success-50)",
          500: "var(--color-success-500)",
          600: "var(--color-success-600)",
          700: "var(--color-success-700)",
        },
        warning: {
          50:  "var(--color-warning-50)",
          500: "var(--color-warning-500)",
          600: "var(--color-warning-600)",
        },
        error: {
          50:  "var(--color-error-50)",
          400: "var(--color-error-400)",
          500: "var(--color-error-500)",
          600: "var(--color-error-600)",
        },
      },

      /* ── Typography ────────────────────────────────────── */
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },

      /* ── Border Radius ─────────────────────────────────── */
      borderRadius: {
        sm:   "var(--radius-sm)",
        md:   "var(--radius-md)",
        lg:   "var(--radius-lg)",
        xl:   "var(--radius-xl)",
        full: "var(--radius-full)",
      },

      /* ── Shadows ───────────────────────────────────────── */
      boxShadow: {
        xs:           "var(--shadow-xs)",
        sm:           "var(--shadow-sm)",
        md:           "var(--shadow-md)",
        lg:           "var(--shadow-lg)",
        xl:           "var(--shadow-xl)",
        "2xl":        "var(--shadow-2xl)",
        inner:        "var(--shadow-inner)",
        primary:      "var(--shadow-primary)",
        "primary-lg": "var(--shadow-primary-lg)",
      },

      /* ── Z-Index ───────────────────────────────────────── */
      zIndex: {
        dropdown:  "10",
        sticky:    "20",
        fixed:     "30",
        telemetry: "40",
        overlay:   "50",
        modal:     "60",
        tooltip:   "70",
        toast:     "80",
      },

      /* ── Animation ─────────────────────────────────────── */
      transitionDuration: {
        fast:    "150ms",
        normal:  "250ms",
        slow:    "400ms",
        slower:  "500ms",
      },
      transitionTimingFunction: {
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        spring:          "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },

      /* ── Sizing ────────────────────────────────────────── */
      minHeight: {
        touch: "var(--size-touch-min)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },

      /* ── Keyframes ─────────────────────────────────────── */
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in":    "fade-in 0.3s var(--ease-out)",
        "slide-up":   "slide-up 0.4s var(--ease-out)",
        "scale-in":   "scale-in 0.25s var(--ease-out)",
        shimmer:      "shimmer 2s infinite linear",
        "pulse-soft": "pulse-soft 2s infinite ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
