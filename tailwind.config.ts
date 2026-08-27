import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#FAF9F6",
        foreground: "#0F172A",
        surface: {
          DEFAULT: "#FFFFFF",
          50: "#FFFDF9",
          100: "#FFF7ED",
          200: "#FFEDD5",
        },
        warm: {
          orange: "#F97316",
          amber: "#F59E0B",
          sunset: "#EA580C",
          coral: "#FB7185",
          cream: "#FFFDF9",
          border: "#FED7AA",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      boxShadow: {
        "warm-sm": "0 2px 8px -2px rgba(249, 115, 22, 0.06), 0 1px 3px 0 rgba(0, 0, 0, 0.04)",
        "warm-md": "0 6px 20px -4px rgba(249, 115, 22, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)",
        "warm-lg": "0 12px 32px -6px rgba(249, 115, 22, 0.12), 0 4px 12px -2px rgba(0, 0, 0, 0.05)",
        "warm-glow": "0 0 25px -5px rgba(249, 115, 22, 0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
