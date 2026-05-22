/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      keyframes: {

        bounceSlow: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },

        glow: {
          "0%, 100%": {
            textShadow: "0 0 5px #ffd54f, 0 0 10px #ff9800",
          },
          "50%": {
            textShadow: "0 0 15px #ffd54f, 0 0 25px #ff9800",
          },
        },

        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },

        borderGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(59,130,246,0.6)" },
          "50%": { boxShadow: "0 0 40px rgba(59,130,246,1)" },
        }

      },

      animation: {
        bounceSlow: "bounceSlow 1.5s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        borderGlow: "borderGlow 3s ease-in-out infinite"
      },

      fontFamily: {
        mochiy: ['"Mochiy Pop P One"', "sans-serif"],
        baloo: ['"Baloo 2"', "cursive"],
        sans: ["Nunito", "sans-serif"],
      },

    },
  },
  plugins: [],
};