"use client";

import { useI18n } from "@/i18n/provider";

export function Hero() {
  const { dict } = useI18n();

  return (
    <section className="essay-hero">
      <h1 className="essay-hero-title">
        {dict.home.heroLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p className="essay-hero-lead">{dict.home.heroSubtitle}</p>
    </section>
  );
}
