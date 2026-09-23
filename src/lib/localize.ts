import type { Locale } from "@/i18n/config";
import { insightToZhTW, mapStringsDeep, toZhTW } from "@/lib/locale-sync";
import type { Insight } from "@/types/insight";
import type { AboutContent } from "@/types/site";

export function localizeInsight(item: Insight, locale: Locale): Insight {
  if (locale === "zh-TW") return insightToZhTW(item);
  return item;
}

export function localizeInsights(items: Insight[], locale: Locale): Insight[] {
  if (locale !== "zh-TW") return items;
  return items.map(insightToZhTW);
}

export function localizeAbout(about: AboutContent, locale: Locale): AboutContent {
  if (locale !== "zh-TW") return about;
  return mapStringsDeep(about, toZhTW);
}
