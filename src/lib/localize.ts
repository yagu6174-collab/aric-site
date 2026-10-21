import type { Locale } from "@/i18n/config";

export function forLocale<T>(locale: Locale, simplified: T, traditional: T): T {
  return locale === "zh-TW" ? traditional : simplified;
}
