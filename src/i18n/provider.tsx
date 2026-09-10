"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

const I18nContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const dict = useMemo(() => getDictionary(locale), [locale]);

  const value = useMemo(
    () => ({
      locale,
      dict,
      setLocale: (next: Locale) => {
        setLocaleState(next);
        document.cookie = `locale=${next}; path=/; max-age=31536000; samesite=lax`;
        document.documentElement.lang = next;
      },
    }),
    [locale, dict],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
