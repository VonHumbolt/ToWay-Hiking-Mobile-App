/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F6F6F6",
        primary: "#A5D936",
        secondary: "#527324",
        secondaryDark: "#852221",
        heading: "#172501",
        body: "#101010",
      },
      fontFamily: {
        regular: ["Montserrat_500Medium"],
        semibold: ["Montserrat_600SemiBold"],
        bold: ["Montserrat_700Bold"],
        extrabold: ["Montserrat_800ExtraBold"],
        black: ["Montserrat_900Black"],
        thin: ["Montserrat_200ExtraLight_Italic"],
      },
    },
  },
  plugins: [],
};
