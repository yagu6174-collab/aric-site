"use client";

import Link from "next/link";
import type { InsightCopy } from "@/types/insight";
import { useI18n } from "@/i18n/provider";
import { forLocale } from "@/lib/localize";
import { formatDate, insightCharCount } from "@/lib/utils";

export function LatestInsights({ items }: { items: InsightCopy[] }) {
  const { dict, locale } = useI18n();
  const localized = items.slice(0, 3).map((item) => ({
    shown: forLocale(locale, item.simplified, item.traditional),
    count: insightCharCount(item.simplified),
    slug: item.simplified.slug,
  }));

  return (
    <div>
      <h2 className="kicker">{dict.home.latestTitle}</h2>
      {localized.length ? (
        <ul className="writing-list">
          {localized.map((item) => (
            <li key={item.slug}>
              <Link href={`/insights/${encodeURIComponent(item.slug)}`}>
                <small>
                  {formatDate(item.shown.date, locale)} · {item.count} {dict.insights.charCount}{" "}
                  · {dict.insights.categories[item.shown.category]}
                </small>
                <strong>{item.shown.title}</strong>
                <span>{item.shown.excerpt}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="lede">{dict.insights.empty}</p>
      )}
      <Link href="/insights" className="text-link">
        {dict.nav.insights}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
