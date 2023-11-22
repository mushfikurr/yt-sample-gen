/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.08)",
          "0 0px 65px rgba(255, 255,255, 0.05)",
        ],
      },
    },
  },
  plugins: [require("@shrutibalasa/tailwind-grid-auto-fit")],
};
