"use client";

import Link from "next/link";
import type { ArticleBlock, Insight } from "@/types/insight";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { useI18n } from "@/i18n/provider";
import { localizeInsight } from "@/lib/localize";
import { formatDate, insightCharCount } from "@/lib/utils";

function bodyOpensWith(body: ArticleBlock[], excerpt: string) {
  const lead = excerpt.trim();
  if (!lead) return true;
  const first = body.find((block) => block.type === "p" && block.text.trim());
  return first?.type === "p" && first.text.trim().startsWith(lead);
}

export function InsightArticle({ item }: { item: Insight }) {
  const { dict, locale } = useI18n();
  const localized = localizeInsight(item, locale);
  const showExcerpt = !bodyOpensWith(localized.body, localized.excerpt);

  return (
    <article className="essay-chapter essay-reading">
      <div className="essay-prose">
        <Link href="/insights" className="essay-kicker">
          ← {dict.insights.back}
        </Link>
        <h1>{localized.title}</h1>
        <p className="essay-kicker essay-article-meta">
          {formatDate(localized.date, locale)} · {insightCharCount(item)}{" "}
          {dict.insights.charCount} · {dict.insights.categories[localized.category]}
        </p>
        {showExcerpt ? <p className="essay-reading-lead">{localized.excerpt}</p> : null}
        <ArticleBody body={localized.body} />
        <Disclaimer />
      </div>
    </article>
  );
}
