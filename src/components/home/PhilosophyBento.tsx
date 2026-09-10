"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function PhilosophyBento() {
  const { dict } = useI18n();

  return (
    <section className="py-16 sm:py-24">
      <Reveal className="overflow-hidden">
        <h2 className="font-serif text-3xl sm:text-4xl">{dict.home.philosophyTitle}</h2>
      </Reveal>
      <div className="mt-12 grid gap-12 md:grid-cols-3 md:gap-8">
        {dict.philosophies.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.08} className="overflow-hidden">
            <article>
              <p className="text-xs tracking-[0.2em] uppercase text-[var(--muted)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-5 font-serif text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
