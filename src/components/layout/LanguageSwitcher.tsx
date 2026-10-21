"use client";

import { Fragment } from "react";
import { LOCALES, type Locale } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";

const labels: Record<Locale, string> = {
  "zh-CN": "简",
  "zh-TW": "繁",
  en: "EN",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="lang" role="group" aria-label="Language">
      {LOCALES.map((item, index) => (
        <Fragment key={item}>
          {index > 0 ? (
            <span className="lang-slash" aria-hidden>
              /
            </span>
          ) : null}
          <button type="button" aria-pressed={locale === item} onClick={() => setLocale(item)}>
            {labels[item]}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
