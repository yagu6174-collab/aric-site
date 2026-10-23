"use client";

import { useMemo, useState } from "react";
import type { InsightCategory, InsightCopy } from "@/types/insight";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { CategoryTabs } from "@/components/insights/CategoryTabs";
import { useI18n } from "@/i18n/provider";

export function InsightsBoard({ items }: { items: InsightCopy[] }) {
  const { dict } = useI18n();
  const [category, setCategory] = useState<"all" | InsightCategory>("all");
  const filtered = useMemo(
    () =>
      category === "all"
        ? items
        : items.filter((item) => item.simplified.category === category),
    [items, category],
  );

  return (
    <div className="page">
      <div className="shell">
        <header className="page-head">
          <p className="kicker">{dict.nameEn}</p>
          <h1>{dict.insights.title}</h1>
          <p className="lede">{dict.insights.disclaimer}</p>
        </header>
        <CategoryTabs
          categories={items.map((item) => item.simplified.category)}
          value={category}
          onChange={setCategory}
        />
        {filtered.length ? (
          <ul className="insight-list">
            {filtered.map((item) => (
              <ArticleCard key={item.simplified.slug} item={item} />
            ))}
          </ul>
        ) : (
          <p className="lede">{dict.insights.empty}</p>
        )}
      </div>
    </div>
  );
}
