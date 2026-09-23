"use client";

import Link from "next/link";
import type { Insight } from "@/types/insight";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";
import { localizeInsight } from "@/lib/localize";
import { formatDate } from "@/lib/utils";

export function ArticleCard({
  item,
  delay = 0,
}: {
  item: Insight;
  delay?: number;
}) {
  const { dict, locale } = useI18n();
  const localized = localizeInsight(item, locale);

  return (
    <li>
      <Reveal delay={delay} className="overflow-hidden">
        <Link href={`/insights/${encodeURIComponent(item.slug)}`}>
          <small>
            {formatDate(localized.date, locale)} · {localized.readingMinutes}{" "}
            {dict.insights.minRead} · {dict.insights.categories[localized.category]}
          </small>
          <strong>{localized.title}</strong>
          <span>{localized.excerpt}</span>
          {localized.quote ? <em>“{localized.quote}”</em> : null}
        </Link>
      </Reveal>
    </li>
  );
}
