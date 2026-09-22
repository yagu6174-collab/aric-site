"use client";

import Link from "next/link";
import type { Insight } from "@/types/insight";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/utils";

export function LatestInsights({ items }: { items: Insight[] }) {
  const { dict, locale } = useI18n();

  return (
    <section className="essay-chapter">
      <p className="essay-num" aria-hidden>
        02
      </p>
      <div className="essay-prose">
        <Reveal>
          <h2>{dict.home.latestTitle}</h2>
        </Reveal>
        <ul className="essay-article-list">
          {items.slice(0, 3).map((item, index) => (
            <li key={item.slug}>
              <Reveal delay={index * 0.06} className="overflow-hidden">
                <Link href={`/insights/${item.slug}`}>
                  <small>
                    {formatDate(item.date, locale)} · {item.readingMinutes}{" "}
                    {dict.insights.minRead} · {dict.insights.categories[item.category]}
                  </small>
                  <strong>{item.title}</strong>
                  <span>{item.excerpt}</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
