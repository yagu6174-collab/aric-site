"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next: Theme) => setThemeState(next),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
