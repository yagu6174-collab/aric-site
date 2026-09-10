"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(next)}
      className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--line)]"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -40, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {theme === "dark" ? (
          <Sun className="h-3.5 w-3.5" />
        ) : (
          <Moon className="h-3.5 w-3.5" />
        )}
      </motion.span>
    </button>
  );
}
