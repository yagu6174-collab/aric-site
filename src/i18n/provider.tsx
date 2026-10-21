"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { parseLocale, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";

const STORAGE_KEY = "aric-locale";

const I18nContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh-CN");
  const dict = useMemo(() => getDictionary(locale), [locale]);

  useEffect(() => {
    const stored = parseLocale(window.localStorage.getItem(STORAGE_KEY));
    setLocaleState(stored);
    document.documentElement.lang = stored;
  }, []);

  const value = useMemo(
    () => ({
      locale,
      dict,
      setLocale: (next: Locale) => {
        setLocaleState(next);
        document.documentElement.lang = next;
        window.localStorage.setItem(STORAGE_KEY, next);
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
