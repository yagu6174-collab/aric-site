import type { Locale } from "@/i18n/config";
import { en } from "./en";
import { zhCN } from "./zh-CN";

export type Dictionary = typeof zhCN;

export function getDictionary(locale: Locale): Dictionary {
  if (locale === "en") return en as unknown as Dictionary;
  return zhCN;
}
