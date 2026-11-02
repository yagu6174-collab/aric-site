"use client";

import { I18nProvider } from "@/i18n/provider";
import type { Dictionary } from "@/i18n/dictionaries";

export function Providers({
  children,
  source,
  traditional,
}: {
  children: React.ReactNode;
  source: Dictionary;
  traditional: Dictionary;
}) {
  return (
    <I18nProvider source={source} traditional={traditional}>
      {children}
    </I18nProvider>
  );
}
