import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // BrightPlan-matched palette
        // Primary = deep navy (matches BrightPlan #1a3058)
        // Secondary = golden yellow (matches BrightPlan accent)
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        navy: {
          50:  "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          400: "#7699b8",
          600: "#3d6494",
          700: "#2a4d79",
          800: "#1c3a5e",
          900: "#0d2137",
        },
        // Golden accent matches BrightPlan secondary
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f5c842",
          600: "#d4a017",
          700: "#b07d0e",
        },
        wellness: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
        },
        sky: {
          50:  "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          400: "#38bdf8",
          500: "#4a94cf",
          600: "#0284c7",
          700: "#0369a1",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
