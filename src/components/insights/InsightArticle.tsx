"use client";

import Link from "next/link";
import type { Insight } from "@/types/insight";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/utils";

export function InsightArticle({ item }: { item: Insight }) {
  const { dict, locale } = useI18n();

  return (
    <article className="essay-chapter">
      <div className="essay-prose">
        <Link href="/insights" className="essay-kicker">
          ← {dict.insights.back}
        </Link>
        <p className="essay-kicker essay-article-meta">
          {formatDate(item.date, locale)} · {item.readingMinutes}{" "}
          {dict.insights.minRead} · {dict.insights.categories[item.category]}
        </p>
        <h1>{item.title}</h1>
        <p>{item.excerpt}</p>
        <ArticleBody body={item.body} />
        <Disclaimer />
      </div>
    </article>
  );
}
