/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
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
          300: "#9cc3dd",
          400: "#67a3c9",
          500: "#4488b3",
          600: "#336c96",
          700: "#2a577a",
          800: "#264b66",
          900: "#244056",
          950: "#182939",
        },
        tussock: {
          50: "#f9f8ed",
          100: "#f2efcf",
          200: "#e5dca3",
          300: "#d6c56e",
          400: "#caad45",
          500: "#be9c39",
          600: "#a07a2e",
          700: "#805b28",
          800: "#6c4b27",
          900: "#5d3f26",
          950: "#352213",
        },
        mojo: {
          50: "#fbf6f1",
          100: "#f7ebdd",
          200: "#edd3bb",
          300: "#e1b490",
          400: "#d49063",
          500: "#cb7344",
          600: "#be5f39",
          700: "#9d4a31",
          800: "#7f3d2d",
          900: "#673327",
          950: "#371913",
        },
        eucalyptus: {
          50: "#f0f9f4",
          100: "#daf1e2",
          200: "#b7e3ca",
          300: "#88cdaa",
          400: "#56b185",
          500: "#34956a",
          600: "#27825b",
          700: "#1d5f44",
          800: "#194c38",
          900: "#153f2f",
          950: "#0b231a",
        },
        minsk: {
          50: "#f2f4fc",
          100: "#e2e6f7",
          200: "#ccd3f1",
          300: "#a8b7e8",
          400: "#7f92db",
          500: "#6171d0",
          600: "#4d56c3",
          700: "#4346b2",
          800: "#363685",
          900: "#343574",
          950: "#232348",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
  plugins: [require("@tailwindcss/forms"), require("tailwindcss-animate")],
};
