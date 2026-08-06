/**
 * Tailwind theme.
 *
 * NOTE: values mirror Src/theme/tokens.js (the canonical, platform-agnostic
 * design tokens). Keep both in sync; tokens.js is what a future React Native /
 * NativeWind build will consume.
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./Src/**/*.{html,js}",
  ],
  theme: {
    extend: {
      colors: {
        brand: "#ff6b00",
        "brand-strong": "#e8590c",
        "brand-soft": "#ff7a1a",
        "brand-deep": "#d94800",
        navy: "#0f172a",
        "navy-soft": "#1e293b",
        surface: "#ffffff",
        "surface-soft": "#fafafa",
        ink: "#111827",
        "ink-body": "#282c3f",
        "ink-muted": "#6b7280",
        "ink-faint": "#9ca3af",
        success: "#16a34a",
        danger: "#ef4444",
        info: "#2563eb",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Manrope", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}
