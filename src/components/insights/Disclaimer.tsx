"use client";

import { useI18n } from "@/i18n/provider";

export function Disclaimer() {
  const { dict } = useI18n();
  return (
    <p className="rounded-xl border border-[var(--line)] px-4 py-3 text-sm text-[var(--muted)]">
      {dict.insights.disclaimer}
    </p>
  );
}
