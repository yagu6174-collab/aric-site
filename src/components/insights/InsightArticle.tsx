"use client";

import Link from "next/link";
import type { Insight } from "@/types/insight";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { useI18n } from "@/i18n/provider";
import { localizeInsight } from "@/lib/localize";
import { formatDate } from "@/lib/utils";

export function InsightArticle({ item }: { item: Insight }) {
  const { dict, locale } = useI18n();
  const localized = localizeInsight(item, locale);

  return (
    <article className="essay-chapter">
      <div className="essay-prose">
        <Link href="/insights" className="essay-kicker">
          ← {dict.insights.back}
        </Link>
        <p className="essay-kicker essay-article-meta">
          {formatDate(localized.date, locale)} · {localized.readingMinutes}{" "}
          {dict.insights.minRead} · {dict.insights.categories[localized.category]}
        </p>
        <h1>{localized.title}</h1>
        <p>{localized.excerpt}</p>
        <ArticleBody body={localized.body} />
        <Disclaimer />
      </div>
    </article>
  );
}
