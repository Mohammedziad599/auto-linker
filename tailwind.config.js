/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        gray: {
          '50': '#e7e7e7',
          '100': '#cfcfcf',
          '200': '#b7b7b7',
          '300': '#9f9f9f',
          '400': '#888888',
          '500': '#707070',
          '600': '#585858',
          '700': '#404040',
          '800': '#222222',
          '900': '#101010',
        },
      }
    },
  },
  plugins: [],
}