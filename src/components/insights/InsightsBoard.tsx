"use client";

import { useMemo, useState } from "react";
import type { Insight, InsightCategory } from "@/types/insight";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { CategoryTabs } from "@/components/insights/CategoryTabs";
import { useI18n } from "@/i18n/provider";

export function InsightsBoard({ items }: { items: Insight[] }) {
  const { dict } = useI18n();
  const [category, setCategory] = useState<"all" | InsightCategory>("all");
  const filtered = useMemo(
    () =>
      category === "all"
        ? items
        : items.filter((item) => item.category === category),
    [items, category],
  );

  return (
    <div className="mt-8 space-y-6">
      <CategoryTabs value={category} onChange={setCategory} />
      {filtered.length ? (
        <div className="grid gap-4">
          {filtered.map((item) => (
            <ArticleCard key={item.slug} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-[var(--muted)]">{dict.insights.empty}</p>
      )}
    </div>
  );
}
