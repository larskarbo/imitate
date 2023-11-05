/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  variants: {
    extend: {
      height: ["group-hover"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
