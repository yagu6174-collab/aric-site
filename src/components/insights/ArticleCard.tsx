"use client";

import Link from "next/link";
import type { Insight } from "@/types/insight";
import { Card } from "@/components/ui/Card";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/utils";

export function ArticleCard({ item }: { item: Insight }) {
  const { dict, locale } = useI18n();

  return (
    <Link href={`/insights/${item.slug}`}>
      <Card className="transition hover:border-[var(--fg)]">
        <p className="text-xs text-[var(--muted)]">
          {formatDate(item.date, locale)} · {item.readingMinutes}{" "}
          {dict.insights.minRead} · {dict.insights.categories[item.category]}
        </p>
        <h3 className="mt-3 font-serif text-2xl">{item.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)]">{item.excerpt}</p>
        <p className="mt-4 font-serif text-[var(--fg)]">“{item.quote}”</p>
      </Card>
    </Link>
  );
}
