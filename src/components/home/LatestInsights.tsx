"use client";

import type { InsightDraft } from "@/lib/draft";
import { EditAdd } from "@/components/edit/EditAdd";
import { EditAnchor } from "@/components/edit/EditAnchor";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";
import { formatDate, insightCharCount } from "@/lib/utils";

export function LatestInsights({
  items,
  traditional,
}: {
  items: InsightDraft[];
  traditional?: InsightDraft[];
}) {
  const { dict, locale } = useI18n();
  const edit = useEditMode();
  const traditionalById = new Map((traditional ?? []).map((item) => [item.id, item]));
  const localized = items.slice(0, 3).map((item) => ({
    shown: locale === "zh-TW" ? (traditionalById.get(item.id) ?? item) : item,
    count: insightCharCount(item),
    slug: item.slug,
    id: item.id,
  }));

  return (
    <div>
      <h2 {...editHit(edit?.selected, "latest", "kicker", edit?.onSelect)}>
        {dict.home.latestTitle}
      </h2>
      {localized.length ? (
        <ul className="writing-list">
          {localized.map((item) => (
            <li key={item.id}>
              <EditAnchor href={`/insights/${encodeURIComponent(item.slug)}`} id={`insight:${item.id}`}>
                <small>
                  {formatDate(item.shown.date, locale)} · {item.count} {dict.insights.charCount}{" "}
                  · {dict.insights.categories[item.shown.category]}
                </small>
                <strong>{item.shown.title}</strong>
                <span>{item.shown.excerpt}</span>
              </EditAnchor>
            </li>
          ))}
        </ul>
      ) : (
        <p {...editHit(edit?.selected, "insights-copy", "lede", edit?.onSelect)}>
          {dict.insights.empty}
        </p>
      )}
      <EditAdd kind="insight" label="加一篇" />
      <EditAnchor href="/insights" id="nav" className="text-link">
        {dict.nav.insights}
        <span aria-hidden>→</span>
      </EditAnchor>
    </div>
  );
}
