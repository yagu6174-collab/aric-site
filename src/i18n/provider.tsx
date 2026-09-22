"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/dictionaries";
import { applyHomeCopy } from "@/lib/home-copy";
import type { HomeCopyBundle } from "@/types/home-copy";

const I18nContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function I18nProvider({
  initialLocale,
  homeCopy,
  children,
}: {
  initialLocale: Locale;
  homeCopy?: HomeCopyBundle;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const dict = useMemo(() => {
    const base = getDictionary(locale);
    const copy = homeCopy?.[locale];
    return copy ? applyHomeCopy(base, copy, locale) : base;
  }, [locale, homeCopy]);

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
