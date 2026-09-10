"use client";

import type { InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs tracking-wide",
            value === tab
              ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]"
              : "border-[var(--line)] text-[var(--muted)]",
          )}
        >
          {tab === "all" ? dict.insights.all : dict.insights.categories[tab]}
        </button>
      ))}
    </div>
  );
}
