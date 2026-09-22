"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function StudioDirectory() {
  const { dict } = useI18n();
  const items = [
    { href: "/about", ...dict.studio.about },
    { href: "/contact", ...dict.studio.contact },
  ];

  return (
    <section className="essay-index">
      <Reveal>
        <p className="essay-kicker">{dict.home.studioLabel}</p>
      </Reveal>
      <Reveal delay={0.08} className="overflow-hidden">
        <p className="essay-index-hint">{dict.home.studioHint}</p>
      </Reveal>
      <ul className="essay-index-list">
        {items.map((item, index) => (
          <li key={item.href}>
            <Reveal delay={index * 0.06} className="overflow-hidden">
              <Link href={item.href}>
                <span>{item.title}</span>
                <em>{item.desc}</em>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
