/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        citiblue: "#004685",
        citidark: "#00325e",
      },
    },
    daisyui: {
      themes: ["coporate", "light"],
    },
  },
  plugins: [require("daisyui")],
};
