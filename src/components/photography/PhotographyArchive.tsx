"use client";

import type { Photo } from "@/types/photo";
import { MasonryGrid } from "@/components/photography/MasonryGrid";
import { useI18n } from "@/i18n/provider";

export function PhotographyArchive({ photos }: { photos: Photo[] }) {
  const { dict } = useI18n();

  return (
    <div className="mx-auto w-full max-w-[1360px] px-5 py-16 sm:px-8 sm:py-20">
      <header className="max-w-xl pb-6">
        <h1 className="font-serif text-4xl leading-tight sm:text-6xl">
          {dict.photography.title}
        </h1>
        <p className="mt-4 text-[var(--muted)]">{dict.photography.intro}</p>
      </header>
      <MasonryGrid photos={photos} />
    </div>
  );
}
