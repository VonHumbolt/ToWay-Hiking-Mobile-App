/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        regular: ['Montserrat_500Medium'],
        black: ['Montserrat_900Black'],
        thin: ['Montserrat_200ExtraLight_Italic'],
      },
    },
  },
  plugins: [],
};
