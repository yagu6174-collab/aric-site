"use client";

import { useMemo, useState } from "react";
import type { Insight, InsightCategory } from "@/types/insight";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { CategoryTabs } from "@/components/insights/CategoryTabs";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { Reveal } from "@/components/motion/Reveal";
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
    <section className="essay-chapter">
      <div className="essay-prose">
        <Reveal className="overflow-hidden">
          <h1>{dict.insights.title}</h1>
        </Reveal>
        <Disclaimer />
        <CategoryTabs value={category} onChange={setCategory} />
        {filtered.length ? (
          <ul className="essay-article-list">
            {filtered.map((item, index) => (
              <ArticleCard key={item.slug} item={item} delay={index * 0.05} />
            ))}
          </ul>
        ) : (
          <p className="essay-note">{dict.insights.empty}</p>
        )}
      </div>
    </section>
  );
}
