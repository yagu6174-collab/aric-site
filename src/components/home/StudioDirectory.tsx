"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function StudioDirectory() {
  const { dict } = useI18n();
  const items = [
    { href: "/insights", ...dict.studio.insights },
    { href: "/about", ...dict.studio.about },
    { href: "/photography", ...dict.studio.photography },
    { href: "/contact", ...dict.studio.contact },
  ];

  return (
    <section className="py-20 sm:py-28">
      <Reveal>
        <p className="text-xs tracking-[0.24em] uppercase text-[var(--muted)]">
          {dict.home.studioLabel}
        </p>
      </Reveal>
      <Reveal delay={0.08} className="mt-3 overflow-hidden">
        <p className="max-w-xl text-sm text-[var(--muted)]">{dict.home.studioHint}</p>
      </Reveal>
      <ul className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
        {items.map((item, index) => (
          <li key={item.href}>
            <Reveal delay={index * 0.06} className="overflow-hidden">
              <Link
                href={item.href}
                className="group flex items-end justify-between gap-6 py-7"
              >
                <div>
                  <h2 className="font-serif text-3xl sm:text-4xl">{item.title}</h2>
                  <p className="mt-2 max-w-md text-sm text-[var(--muted)]">
                    {item.desc}
                  </p>
                </div>
                <ArrowUpRight className="mb-1 h-4 w-4 shrink-0 text-[var(--muted)] transition duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--fg)]" />
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
