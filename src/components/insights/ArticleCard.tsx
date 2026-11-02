"use client";

import type { InsightDraft } from "@/lib/draft";
import { EditAnchor } from "@/components/edit/EditAnchor";
import { useI18n } from "@/i18n/provider";
import { formatDate, insightCharCount } from "@/lib/utils";

export function ArticleCard({ item, traditional }: { item: InsightDraft; traditional?: InsightDraft }) {
  const { dict, locale } = useI18n();
  const localized = locale === "zh-TW" && traditional ? traditional : item;
  const showQuote = Boolean(localized.quote) && localized.quote !== localized.excerpt;

  return (
    <li>
      <EditAnchor className="insight-row" href={`/insights/${encodeURIComponent(item.slug)}`} id={`insight:${item.id}`}>
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
          {insightCharCount(item)} {dict.insights.charCount}
        </span>
      </EditAnchor>
    </li>
  );
}
