"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function PhilosophyBento() {
  const { dict, locale } = useI18n();
  const glue = locale === "en" ? " " : "";

  return (
    <section className="essay-chapter">
      <p className="essay-num" aria-hidden>
        01
      </p>
      <Reveal className="essay-prose overflow-hidden">
        <h2>{dict.home.philosophyTitle}</h2>
        {dict.philosophies.map((item) => (
          <p key={item.body}>
            {[item.title, item.body].filter(Boolean).join(glue)}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
