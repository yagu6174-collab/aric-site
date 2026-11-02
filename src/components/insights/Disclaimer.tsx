"use client";

import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

export function Disclaimer() {
  const { dict } = useI18n();
  const edit = useEditMode();
  return <p {...editHit(edit?.selected, "insights-copy", "note", edit?.onSelect)}>{dict.insights.disclaimer}</p>;
}
