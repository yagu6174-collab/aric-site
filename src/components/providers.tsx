"use client";

import { I18nProvider } from "@/i18n/provider";
import type { Locale } from "@/i18n/config";
import type { HomeCopyBundle } from "@/types/home-copy";

export function Providers({
  locale,
  homeCopy,
  children,
}: {
  locale: Locale;
  homeCopy?: HomeCopyBundle;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider initialLocale={locale} homeCopy={homeCopy}>
      {children}
    </I18nProvider>
  );
}
