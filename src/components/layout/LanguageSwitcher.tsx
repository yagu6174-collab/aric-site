"use client";

import { LOCALES } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

const labels: Record<string, string> = {
  "zh-CN": "简",
  "zh-TW": "繁",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex items-center gap-1 text-xs tracking-wide">
      {LOCALES.map((item, index) => (
        <span key={item} className="flex items-center gap-1">
          {index > 0 ? <span className="text-[var(--muted)]">/</span> : null}
          <button
            type="button"
            onClick={() => setLocale(item)}
            className={cn(
              "rounded px-1 py-0.5 transition",
              locale === item
                ? "text-[var(--fg)]"
                : "text-[var(--muted)] hover:text-[var(--fg)]",
            )}
          >
            {labels[item]}
          </button>
        </span>
      ))}
    </div>
  );
}
