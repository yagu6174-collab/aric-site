import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0c0b09",
        ivory: "#f4efe6",
        gold: "#c6a36a",
        stone: "#c4bbb0",
      },
      fontFamily: {
        sans: ["var(--font-serif)", "serif"],
        serif: ["var(--font-serif)", "serif"],
      },
    },
  },
};

export default config;
