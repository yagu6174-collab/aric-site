"use client";

import { Card } from "@/components/ui/Card";
import { useI18n } from "@/i18n/provider";

export function PhilosophyBento() {
  const { dict } = useI18n();

  return (
    <section className="py-10">
      <h2 className="font-serif text-3xl">{dict.home.philosophyTitle}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {dict.philosophies.map((item, index) => (
          <Card key={item.title} className="min-h-44">
            <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-4 font-serif text-2xl">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
              {item.body}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
