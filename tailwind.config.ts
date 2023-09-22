import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [require("@savvywombat/tailwindcss-grid-areas")],
} satisfies Config;
