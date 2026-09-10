export const LOCALES = ["zh-CN", "zh-TW", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh-CN";

export function parseLocale(value?: string | null): Locale {
  if (value === "zh-TW" || value === "en" || value === "zh-CN") return value;
  return DEFAULT_LOCALE;
}
