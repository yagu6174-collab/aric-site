"use client";

import { I18nProvider } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";
import { ThemeProvider, type Theme } from "@/lib/theme";

export function Providers({
  locale,
  theme,
  children,
}: {
  locale: Locale;
  theme: Theme;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider initialTheme={theme}>
      <I18nProvider initialLocale={locale}>{children}</I18nProvider>
    </ThemeProvider>
  );
}
