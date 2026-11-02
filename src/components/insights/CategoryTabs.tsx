"use client";

import { useMemo } from "react";
import type { InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
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
  const edit = useEditMode();
  const present = useMemo(
    () => (edit ? [...INSIGHT_CATEGORIES] : INSIGHT_CATEGORIES.filter((category) => categories.includes(category))),
    [categories, edit],
  );

  if (!edit && present.length < 2) return null;

  const tabs: Array<"all" | InsightCategory> = ["all", ...present];

  return (
    <div
      role="group"
      aria-label={dict.insights.title}
      {...editHit(edit?.selected, "categories", "filters", edit?.onSelect)}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          aria-pressed={value === tab}
          onClick={(event) => {
            if (edit) {
              event.preventDefault();
              event.stopPropagation();
              edit.onSelect("categories");
              return;
            }
            onChange(tab);
          }}
        >
          {tab === "all" ? dict.insights.all : dict.insights.categories[tab]}
        </button>
      ))}
    </div>
  );
}
