"use client";

import { useI18n } from "@/i18n/provider";

export function Disclaimer() {
  const { dict } = useI18n();
  return <p className="essay-note">{dict.insights.disclaimer}</p>;
}
