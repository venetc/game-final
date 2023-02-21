/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        nunito: ["var(--font-nunito)"],
        fira: ["var(--font-fira)"],
        rubik: ["var(--font-rubik)"],
      },
      colors: {
        navy: {
          50: "#f4f7fb",
          100: "#e7f0f7",
          200: "#cbdeec",
          300: "#9dc3dc",
          400: "#68a3c8",
          500: "#4487b3",
          600: "#336c96",
          700: "#2a577a",
          800: "#264b66",
          900: "#27445c",
        },
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require("tailwindcss-radix")(), require("@tailwindcss/forms")],
};
