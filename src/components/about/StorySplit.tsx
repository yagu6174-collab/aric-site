"use client";

import Image from "next/image";
import type { AboutContent } from "@/types/site";
import { useI18n } from "@/i18n/provider";

export function StorySplit({ story }: { story: AboutContent["story"] }) {
  const { dict } = useI18n();

  return (
    <section className="grid gap-10 md:grid-cols-2 md:items-start">
      <div>
        <h2 className="font-serif text-3xl">{dict.about.storyTitle}</h2>
        <div className="mt-6 space-y-4 leading-8 text-[var(--muted)]">
          {story.map((para) => (
            <p key={para}>{para}</p>
          ))}
        </div>
      </div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--card)]">
        <Image
          src="/placeholders/portrait.svg"
          alt={dict.about.portraitAlt}
          fill
          className="object-cover"
        />
      </div>
    </section>
  );
}
