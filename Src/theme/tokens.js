/**
 * BeYuumi design tokens.
 *
 * Single source of truth for brand colors, spacing, typography and breakpoints.
 * Exported for tailwind.config.js (web) and mirrored as RN-compatible maps so
 * the same values can be reused by a future React Native / NativeWind app.
 */

export const BREAKPOINTS = {
  /** Mobile < 640, Tablet 640–1024, Desktop > 1024 */
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

/** Explicit breakpoints used for QA at standard device widths. */
export const BREAKPOINTS_NATIVE = {
  phone: 375,
  tablet: 768,
  desktop: 1024,
};

export const COLORS = {
  primary: {
    DEFAULT: "#ff6b00",
    strong: "#e8590c",
    soft: "#ff7a1a",
    deep: "#d94800",
    light: "rgba(255,107,0,0.12)",
  },
  navy: {
    DEFAULT: "#0f172a",
    soft: "#1e293b",
  },
  scheme: {
    brand: "#ff6b00",
    accent: "#e8590c",
    navy: "#0f172a",
    surface: "#ffffff",
    background: "#f8f8f8",
    surfaceSoft: "#fafafa",
  },
  ink: {
    DEFAULT: "#111827",
    body: "#282c3f",
    muted: "#6b7280",
    faint: "#9ca3af",
  },
  green: "#16a34a",
  red: "#ef4444",
  blue: "#2563eb",
};

export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  pill: 9999,
};

export const TYPOGRAPHY = {
  fontFamily: {
    sans: ["Inter", "system-ui", "sans-serif"],
    display: ["Manrope", "Inter", "sans-serif"],
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
  },
  weights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export default { BREAKPOINTS, BREAKPOINTS_NATIVE, COLORS, SPACING, RADIUS, TYPOGRAPHY };