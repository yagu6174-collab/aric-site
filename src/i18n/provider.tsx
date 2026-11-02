"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { parseLocale, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { en } from "@/i18n/dictionaries/en";
import { zhCN } from "@/i18n/dictionaries/zh-CN";

const STORAGE_KEY = "aric-locale";

const I18nContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function I18nProvider({
  children,
  source,
  traditional,
  lockLocale,
}: {
  children: React.ReactNode;
  source?: Dictionary;
  traditional?: Dictionary;
  lockLocale?: Locale;
}) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>(lockLocale ?? "zh-CN");
  const simplified = source ?? (zhCN as Dictionary);
  const dict = useMemo(() => {
    const active = lockLocale ?? locale;
    if (active === "en") return en as unknown as Dictionary;
    if (active === "zh-TW") return traditional ?? simplified;
    return simplified;
  }, [locale, lockLocale, simplified, traditional]);

  useEffect(() => {
    if (lockLocale || pathname.startsWith("/admin")) return;
    const stored = parseLocale(window.localStorage.getItem(STORAGE_KEY));
    setLocaleState(stored);
    document.documentElement.lang = stored;
  }, [lockLocale, pathname]);

  useEffect(() => {
    if (lockLocale || pathname.startsWith("/admin")) return;
    document.documentElement.lang = locale;
  }, [locale, lockLocale, pathname]);

  const value = useMemo(
    () => ({
      locale: lockLocale ?? locale,
      dict,
      setLocale: (next: Locale) => {
        if (lockLocale) return;
        setLocaleState(next);
        document.documentElement.lang = next;
        window.localStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [locale, dict, lockLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
