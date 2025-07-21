/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        soko: {
          yellow: {
            light: '#FFF9E5', // background
            DEFAULT: '#FFE14D', // main yellow
            dark: '#FFD600', // button/accents
            contrast: '#1B3A1B', // for text on yellow
          },
          green: {
            light: '#A7D28D',
            DEFAULT: '#4CAF50', // main green
            dark: '#205522', // text
            accent: '#388E3C', // button hover
            contrast: '#FFF9E5', // for text on green
          },
          brown: {
            light: '#E6C89F',
            DEFAULT: '#A16943', // accent brown
            dark: '#8B5C2A', // border/text
            contrast: '#FFF9E5', // for text on brown
          },
          maize: '#FFEB7A',
          orange: '#FFB300',
          red: '#E53935',
        },
      },
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "tranlate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}
