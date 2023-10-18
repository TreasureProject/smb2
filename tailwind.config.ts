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
          "w1 w1 w2 w2 w3 w3 w4 w4",
          "w1 w1 w2 w2 w3 w3 w4 w4",
          "w5 w5 w5 w5 w3 w3 w4 w4",
          "w5 w5 w5 w5 w3 w3 w4 w4"
        ],
        apps: ["a1 a1 a2 a2 a3 a4 a5 a6", "a7 a7 a8 a8 a9 a10 a11 a12"]
      },
      fontFamily: {
        sans: ["Norline", ...defaultTheme.fontFamily.sans],
        mono: ["PPNeueBit", ...defaultTheme.fontFamily.mono],
        chad: ["PPEditorialNew", ...defaultTheme.fontFamily.sans],
        oakley: ["Oakley", ...defaultTheme.fontFamily.sans],
        mondwest: ["PPMondwest", ...defaultTheme.fontFamily.sans],
        formula: ["PPFormula", ...defaultTheme.fontFamily.sans],
        lazer: ["Lazer", ...defaultTheme.fontFamily.sans]
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
        }
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" }
        },
        marquee2: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" }
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        }
      },
      animation: {
        marquee: "marquee 15s linear infinite",
        marquee2: "marquee2 15s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out"
      }
    }
  },
  plugins: [
    require("@savvywombat/tailwindcss-grid-areas"),
    require("tailwindcss-animate"),
    require("tailwindcss-capsize")
  ]
} satisfies Config;
