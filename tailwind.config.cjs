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
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("tailwindcss-radix")(),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
};
