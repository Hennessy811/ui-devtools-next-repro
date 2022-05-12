const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Genos", ...defaultTheme.fontFamily.sans],
        VT323: ["VT323", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        gray: {
          700: "#1c1c1c",
        },
        primary: {
          DEFAULT: "#25FFDE",
          50: "#DDFFFA",
          100: "#C8FFF7",
          200: "#9FFFF1",
          300: "#77FFEA",
          400: "#4EFFE4",
          500: "#25FFDE",
          600: "#00ECC8",
          700: "#00B499",
          800: "#007C69",
          900: "#004439",
        },
        secondary: {
          DEFAULT: "#A629FF",
          50: "#F2E1FF",
          100: "#EACCFF",
          200: "#D9A3FF",
          300: "#C87BFF",
          400: "#B752FF",
          500: "#A629FF",
          600: "#8C00F0",
          700: "#6B00B8",
          800: "#4B0080",
          900: "#2A0048",
        },
        background: {
          DEFAULT: "#EDE7F5",
          50: "#FAF7FF",
          100: "#E7D4FF",
          500: "#A629FF",
          800: "#716EF3",
        },
      },
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/ui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
}
