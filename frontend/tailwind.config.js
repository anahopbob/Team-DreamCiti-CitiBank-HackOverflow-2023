/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        citiblue: "#003B70",
      },
    },
  },
  plugins: [require("daisyui")],
};
