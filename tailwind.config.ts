import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#2a241e",
        ivory: "#f6f3ec",
        gold: "#6a4e3c",
        stone: "#5e574e",
      },
      fontFamily: {
        sans: ["var(--font-serif)", "serif"],
        serif: ["var(--font-serif)", "serif"],
      },
    },
  },
};

export default config;
