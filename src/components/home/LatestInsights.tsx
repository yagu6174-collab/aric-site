"use client";

import type { Insight } from "@/types/insight";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { useI18n } from "@/i18n/provider";

export function LatestInsights({ items }: { items: Insight[] }) {
  const { dict } = useI18n();

  return (
    <section className="py-10">
      <h2 className="font-serif text-3xl">{dict.home.latestTitle}</h2>
      <div className="mt-6 grid gap-4">
        {items.slice(0, 3).map((item) => (
          <ArticleCard key={item.slug} item={item} />
        ))}
      </div>
    </section>
  );
}
