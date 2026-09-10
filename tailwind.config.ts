import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#121212",
        paper: "#FAF8F5",
        mist: "#E8E4DC",
        stone: "#6B6862",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "PingFang SC", "Noto Sans SC", "sans-serif"],
        serif: ["var(--font-serif)", "Noto Serif SC", "Songti SC", "serif"],
      },
    },
  },
};

export default config;
