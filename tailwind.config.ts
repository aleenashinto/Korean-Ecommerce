import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f472b6",
          400: "#e11d48",
          500: "#be185d",
          600: "#9d174d",
          700: "#831843",
          800: "#701a75",
          900: "#4c0519",
        },
        champagne: {
          50: "#fdfbf7",
          100: "#f7f1e7",
          200: "#eee1cf",
          300: "#dfc7a7",
          400: "#cea77a",
          500: "#be8954",
        },
        surface: {
          light: "#fafafa",
          card: "#ffffff",
          dark: "#0f172a",
        }
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
