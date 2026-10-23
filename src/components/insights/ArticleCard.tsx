"use client";

import Link from "next/link";
import type { InsightCopy } from "@/types/insight";
import { useI18n } from "@/i18n/provider";
import { forLocale } from "@/lib/localize";
import { formatDate, insightCharCount } from "@/lib/utils";

export function ArticleCard({ item }: { item: InsightCopy }) {
  const { dict, locale } = useI18n();
  const localized = forLocale(locale, item.simplified, item.traditional);
  const showQuote = Boolean(localized.quote) && localized.quote !== localized.excerpt;

  return (
    <li>
      <Link className="insight-row" href={`/insights/${encodeURIComponent(item.simplified.slug)}`}>
        <span className="insight-meta">
          <time dateTime={localized.date}>{formatDate(localized.date, locale)}</time>
          <span>{dict.insights.categories[localized.category]}</span>
        </span>
        <span>
          <h2>{localized.title}</h2>
          {localized.excerpt ? <p>{localized.excerpt}</p> : null}
          {showQuote ? <em className="insight-quote">“{localized.quote}”</em> : null}
        </span>
        <span className="insight-count">
          {insightCharCount(item.simplified)} {dict.insights.charCount}
        </span>
      </Link>
    </li>
  );
}
