"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
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
    <section className="py-10">
      <p className="text-xs tracking-[0.24em] uppercase text-[var(--muted)]">
        {dict.home.studioLabel}
      </p>
      <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
        {dict.home.studioHint}
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className="group">
            <Card className="h-full transition group-hover:border-[var(--fg)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl">{item.title}</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">{item.desc}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-[var(--muted)] transition group-hover:text-[var(--fg)]" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
