"use client";

import { useMemo } from "react";
import type { InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";
import { useI18n } from "@/i18n/provider";

export function CategoryTabs({
  categories,
  value,
  onChange,
}: {
  categories: InsightCategory[];
  value: "all" | InsightCategory;
  onChange: (value: "all" | InsightCategory) => void;
}) {
  const { dict } = useI18n();
  const present = useMemo(
    () => INSIGHT_CATEGORIES.filter((category) => categories.includes(category)),
    [categories],
  );

  if (present.length < 2) return null;

  const tabs: Array<"all" | InsightCategory> = ["all", ...present];

  return (
    <div className="filters" role="group" aria-label={dict.insights.title}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-pressed={value === tab}
          onClick={() => onChange(tab)}
        >
          {tab === "all" ? dict.insights.all : dict.insights.categories[tab]}
        </button>
      ))}
    </div>
  );
}
