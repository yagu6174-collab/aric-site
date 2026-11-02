"use client";

import type { ArticleBlock } from "@/types/insight";
import type { InsightDraft } from "@/lib/draft";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { EditAnchor } from "@/components/edit/EditAnchor";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";
import { formatDate, insightCharCount } from "@/lib/utils";

function bodyOpensWith(body: ArticleBlock[], excerpt: string) {
  const lead = excerpt.trim();
  if (!lead) return true;
  const first = body.find((block) => block.type === "p" && block.text.trim());
  return first?.type === "p" && first.text.trim().startsWith(lead);
}

export function InsightArticle({ item, traditional }: { item: InsightDraft; traditional?: InsightDraft }) {
  const { dict, locale } = useI18n();
  const edit = useEditMode();
  const localized = locale === "zh-TW" && traditional ? traditional : item;
  const showExcerpt = !bodyOpensWith(localized.body, localized.excerpt);
  const lang = locale === "zh-TW" ? "zh-TW" : "zh-CN";
  const hit = editHit(edit?.selected, `insight:${item.id}`, undefined, edit?.onSelect);

  return (
    <article className="page reading">
      <div className="shell reading-grid">
        <aside className="reading-rail">
          <EditAnchor href="/insights" id="insights-copy" className="text-link">
            <span aria-hidden>←</span>
            {dict.insights.back}
          </EditAnchor>
          <time dateTime={localized.date} {...hit}>
            {formatDate(localized.date, locale)}
          </time>
          <span {...hit}>{dict.insights.categories[localized.category]}</span>
          <span {...hit}>
            {insightCharCount(item)} {dict.insights.charCount}
          </span>
        </aside>
        <div lang={lang} {...hit}>
          <h1>{localized.title}</h1>
          {showExcerpt ? <p className="lede">{localized.excerpt}</p> : null}
          <ArticleBody body={localized.body} />
          <Disclaimer />
        </div>
      </div>
    </article>
  );
}
