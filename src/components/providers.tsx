"use client";

import { I18nProvider } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";
import { ThemeProvider, type Theme } from "@/lib/theme";
import type { HomeCopyBundle } from "@/types/home-copy";

export function Providers({
  locale,
  theme,
  homeCopy,
  children,
}: {
  locale: Locale;
  theme: Theme;
  homeCopy?: HomeCopyBundle;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider initialTheme={theme}>
      <I18nProvider initialLocale={locale} homeCopy={homeCopy}>
        {children}
      </I18nProvider>
    </ThemeProvider>
  );
}
