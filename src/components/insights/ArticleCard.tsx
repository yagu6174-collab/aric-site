"use client";

import Link from "next/link";
import type { Insight } from "@/types/insight";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/utils";

export function ArticleCard({
  item,
  delay = 0,
}: {
  item: Insight;
  delay?: number;
}) {
  const { dict, locale } = useI18n();

  return (
    <li>
      <Reveal delay={delay} className="overflow-hidden">
        <Link href={`/insights/${encodeURIComponent(item.slug)}`}>
          <small>
            {formatDate(item.date, locale)} · {item.readingMinutes}{" "}
            {dict.insights.minRead} · {dict.insights.categories[item.category]}
          </small>
          <strong>{item.title}</strong>
          <span>{item.excerpt}</span>
          {item.quote ? <em>“{item.quote}”</em> : null}
        </Link>
      </Reveal>
    </li>
  );
}
