import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        ink: "#0F172A",
        muted: "#64748B",
        border: "#E2E8F0",
        accent: {
          DEFAULT: "#2563EB",
          light: "#3B82F6",
          dark: "#1D4ED8",
        },
        success: {
          DEFAULT: "#10B981",
          light: "#34D399",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FBBF24",
        },
        danger: {
          DEFAULT: "#EF4444",
          light: "#F87171",
        },
        // Warm "restaurant" palette used only by the public-facing guest menu
        // (home / catalog / cart / about), scoped via the (public) layout so
        // the owner dashboard keeps its existing blue/slate theme.
        cream: {
          DEFAULT: "#FBF6EE",
          dark: "#F3EADA",
        },
        gold: {
          DEFAULT: "#C08A2E",
          light: "#D9A94E",
          dark: "#9C6F1E",
        },
        cocoa: "#3B2A1A",
      },
      fontFamily: {
        display: ["var(--font-inter)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      borderRadius: {
        card: "20px",
        "card-lg": "24px",
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.06)",
        glass: "0 8px 32px 0 rgba(15, 23, 42, 0.06)",
        "glass-lg": "0 20px 48px 0 rgba(15, 23, 42, 0.10)",
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(37, 99, 235, 0.35)" },
          "100%": { boxShadow: "0 0 0 8px rgba(37, 99, 235, 0)" },
        },
      },
      animation: {
        shimmer: "shimmer 2.2s linear infinite",
        "fade-up": "fade-up 0.4s ease-out",
        "pulse-ring": "pulse-ring 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
