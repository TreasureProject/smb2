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
      },
      gridTemplateAreas: {
        widgets: [
          "w1 w1 w2 w2 w3 w3 w4 w4",
          "w1 w1 w2 w2 w3 w3 w4 w4",
          "w5 w5 w5 w5 w3 w3 w4 w4",
          "w5 w5 w5 w5 w3 w3 w4 w4",
        ],
        apps: ["a1 a1 a2 a2 a3 a4 a5 a6", "a7 a7 a8 a8 a9 a10 a11 a12"],
      },
      fontFamily: {
        sans: ["Norline", ...defaultTheme.fontFamily.sans],
        mono: ["PPNeueBit", ...defaultTheme.fontFamily.mono],
        chad: ["PPEditorialNew", ...defaultTheme.fontFamily.sans],
        oakley: ["Oakley", ...defaultTheme.fontFamily.sans],
        mondwest: ["PPMondwest", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
} satisfies Config;
