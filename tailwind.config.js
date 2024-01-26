/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {},
  },
  purge: ["./src/**/*.{js,jsx,ts,tsx}"],
  variants: {
    extend: {
      height: ["group-hover"],
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
