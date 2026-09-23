import type { Locale } from "@/i18n/config";
import { mapStringsDeep, toZhTW } from "@/lib/locale-sync";
import { en } from "./en";
import { zhCN } from "./zh-CN";
import { zhTW } from "./zh-TW";

export const dictionaries = {
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  en,
} as const;

export type Dictionary = typeof zhCN;

export function getDictionary(locale: Locale): Dictionary {
  if (locale === "zh-TW") {
    return mapStringsDeep(dictionaries["zh-CN"], toZhTW) as Dictionary;
  }
  return dictionaries[locale] as Dictionary;
}
