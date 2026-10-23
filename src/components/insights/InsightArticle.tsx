"use client";

import Link from "next/link";
import type { ArticleBlock, InsightCopy } from "@/types/insight";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { useI18n } from "@/i18n/provider";
import { forLocale } from "@/lib/localize";
import { formatDate, insightCharCount } from "@/lib/utils";

function bodyOpensWith(body: ArticleBlock[], excerpt: string) {
  const lead = excerpt.trim();
  if (!lead) return true;
  const first = body.find((block) => block.type === "p" && block.text.trim());
  return first?.type === "p" && first.text.trim().startsWith(lead);
}

export function InsightArticle({ item }: { item: InsightCopy }) {
  const { dict, locale } = useI18n();
  const localized = forLocale(locale, item.simplified, item.traditional);
  const showExcerpt = !bodyOpensWith(localized.body, localized.excerpt);
  const lang = locale === "zh-TW" ? "zh-TW" : "zh-CN";

  return (
    <article className="page reading">
      <div className="shell reading-grid">
        <aside className="reading-rail">
          <Link href="/insights" className="text-link">
            <span aria-hidden>←</span>
            {dict.insights.back}
          </Link>
          <time dateTime={localized.date}>{formatDate(localized.date, locale)}</time>
          <span>{dict.insights.categories[localized.category]}</span>
          <span>
            {insightCharCount(item.simplified)} {dict.insights.charCount}
          </span>
        </aside>
        <div lang={lang}>
          <h1>{localized.title}</h1>
          {showExcerpt ? <p className="lede">{localized.excerpt}</p> : null}
          <ArticleBody body={localized.body} />
          <Disclaimer />
        </div>
      </div>
    </article>
  );
}
