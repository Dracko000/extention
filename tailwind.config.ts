/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#121212",
        primary: "#6366F1",
        secondary: "#8B5CF6",
        cyan: "#06B6D4",
        muted: "#A1A1AA",
      },
    },
  },
  plugins: [],
}
