"use client";

import type { InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";
import { useI18n } from "@/i18n/provider";

export function CategoryTabs({
  value,
  onChange,
}: {
  value: "all" | InsightCategory;
  onChange: (value: "all" | InsightCategory) => void;
}) {
  const { dict } = useI18n();
  const tabs: Array<"all" | InsightCategory> = ["all", ...INSIGHT_CATEGORIES];

  return (
    <div className="essay-cats">
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
