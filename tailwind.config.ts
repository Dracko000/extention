/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0E11",
        surface: "#181A20",
        primary: "#3B82F6",
        vampire: "#F84960",
        success: "#00C087",
        muted: "#848E9C",
        border: "#2B2F36",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
