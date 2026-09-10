"use client";

import type { Insight } from "@/types/insight";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function LatestInsights({ items }: { items: Insight[] }) {
  const { dict } = useI18n();

  return (
    <section className="py-16 sm:py-24">
      <Reveal className="overflow-hidden">
        <h2 className="font-serif text-3xl sm:text-4xl">{dict.home.latestTitle}</h2>
      </Reveal>
      <div className="mt-10 grid gap-8">
        {items.slice(0, 3).map((item, index) => (
          <Reveal key={item.slug} delay={index * 0.06} className="overflow-hidden">
            <ArticleCard item={item} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
