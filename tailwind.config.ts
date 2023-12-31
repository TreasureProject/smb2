import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        troll: "#7237E3",
        acid: "#95F22A",
        fud: "#0E072D",
        vroom: "#1938F2",
        rage: "#FF0000",
        tang: "#FF4C22",
        neonRed: "#FF016C",
        neonPink: "#FA1DFA",
        pepe: "#F8FF1D",
        dream: "#12F6FC",
        grayOne: "#919191",
        grayTwo: "#EFF0F0",
        intro: "#190087"
      },
      gridTemplateAreas: {
        widgets: [
          "w1 w1 w1 w1 w1 w2 w2 w3 w3 w4 w4 w4 w4",
          "w1 w1 w1 w1 w1 w6 w6 w6 w6 w4 w4 w4 w4",
          "w5 w5 w5 w5 w5 w6 w6 w6 w6 w4 w4 w4 w4",
          "w5 w5 w5 w5 w5 w6 w6 w6 w6 w7 w7 w8 w8"
        ],
        apps: ["a1 a1 a2 a2 a3 a4 a5 a6", "a7 a7 a8 a8 a9 a10 a11 a12"]
      },
      fontFamily: {
        sans: ["Norline", ...defaultTheme.fontFamily.sans],
        neuebit: ["PPNeueBit", ...defaultTheme.fontFamily.sans],
        chad: ["PPEditorialNew", ...defaultTheme.fontFamily.sans],
        oakley: ["Oakley", ...defaultTheme.fontFamily.sans],
        mondwest: ["PPMondwest", ...defaultTheme.fontFamily.sans],
        formula: ["PPFormula", ...defaultTheme.fontFamily.sans],
        lazer: ["Lazer", ...defaultTheme.fontFamily.sans],
        paperboy: ["Paperboy", ...defaultTheme.fontFamily.sans]
      },
      // get values from here: https://seek-oss.github.io/capsize/
      fontMetrics: {
        sans: {
          capHeight: 1434,
          ascent: 1718,
          descent: 353,
          lineGap: 24,
          unitsPerEm: 2048
        },
        mono: {
          capHeight: 1024,
          ascent: 1390,
          descent: 332,
          lineGap: 24,
          unitsPerEm: 2048
        },
        formula: {
          capHeight: 826,
          ascent: 906,
          descent: 306,
          lineGap: 24,
          unitsPerEm: 1000
        },
        mondwest: {
          capHeight: 1310,
          ascent: 1884,
          descent: 532,
          lineGap: 24,
          unitsPerEm: 2048
        },
        paperboy: {
          capHeight: 2000,
          ascent: 2000,
          descent: 0,
          lineGap: 24,
          unitsPerEm: 1000
        }
      },

      keyframes: {
        noiseAnim: {
          "0%": {
            clipPath: "inset(40% 0 61% 0)"
          },
          "100%": { clipPath: "inset(58% 0 43% 0)" }
        }
      },
      animation: {
        noiseAnim1: "noiseAnim 2s infinite linear alternate-reverse",
        noiseAnim2: "noiseAnim 3s infinite linear alternate-reverse"
      }
    }
  },
  plugins: [
    require("@savvywombat/tailwindcss-grid-areas"),
    require("tailwindcss-animate"),
    require("tailwindcss-capsize")
  ]
} satisfies Config;
