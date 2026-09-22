"use client";

import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function PhilosophyBento() {
  const { dict } = useI18n();

  return (
    <section className="essay-chapter">
      <p className="essay-num" aria-hidden>
        01
      </p>
      <Reveal className="essay-prose overflow-hidden">
        <h2>{dict.home.philosophyTitle}</h2>
        {dict.philosophies.map((item) => (
          <p key={item.title}>
            {item.title}。{item.body}
          </p>
        ))}
      </Reveal>
    </section>
  );
}
