"use client";

import { useMemo, useState } from "react";
import type { InsightCategory } from "@/types/insight";
import type { InsightDraft } from "@/lib/draft";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { CategoryTabs } from "@/components/insights/CategoryTabs";
import { EditAdd } from "@/components/edit/EditAdd";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

export function InsightsBoard({
  items,
  traditional,
}: {
  items: InsightDraft[];
  traditional?: InsightDraft[];
}) {
  const { dict } = useI18n();
  const edit = useEditMode();
  const traditionalById = new Map((traditional ?? []).map((item) => [item.id, item]));
  const [category, setCategory] = useState<"all" | InsightCategory>("all");
  const filtered = useMemo(
    () => (edit || category === "all" ? items : items.filter((item) => item.category === category)),
    [items, category, edit],
  );

  return (
    <div className="page">
      <div className="shell">
        <header className="page-head">
          <p {...editHit(edit?.selected, "brand", "kicker", edit?.onSelect)}>
            {dict.nameEn}
          </p>
          <h1 {...editHit(edit?.selected, "insights-copy", undefined, edit?.onSelect)}>{dict.insights.title}</h1>
          <p {...editHit(edit?.selected, "insights-copy", "lede", edit?.onSelect)}>
            {dict.insights.disclaimer}
          </p>
        </header>
        <CategoryTabs
          categories={items.map((item) => item.category)}
          value={category}
          onChange={setCategory}
        />
        {filtered.length ? (
          <ul className="insight-list">
            {filtered.map((item) => (
              <ArticleCard key={item.id} item={item} traditional={traditionalById.get(item.id)} />
            ))}
          </ul>
        ) : (
          <p {...editHit(edit?.selected, "insights-copy", "lede", edit?.onSelect)}>
            {dict.insights.empty}
          </p>
        )}
        <EditAdd kind="insight" label="加一篇" />
      </div>
    </div>
  );
}
