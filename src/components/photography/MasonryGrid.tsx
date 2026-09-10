"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo } from "@/types/photo";
import { Lightbox } from "@/components/photography/Lightbox";
import { useI18n } from "@/i18n/provider";

export function MasonryGrid({ photos }: { photos: Photo[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<Photo | null>(null);

  if (!photos.length) {
    return <p className="py-20 text-[var(--muted)]">{dict.photography.empty}</p>;
  }

  return (
    <>
      <div className="masonry">
        {photos.map((photo) => (
          <button
            key={photo.id}
            type="button"
            className="masonry-item group relative w-full overflow-hidden rounded-xl"
            onClick={() => setActive(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.album}
              width={800}
              height={1000}
              className="h-auto w-full object-cover"
              unoptimized
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-black/45 px-3 py-2 text-left text-sm text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
              {photo.album}
            </span>
          </button>
        ))}
      </div>
      {active ? <Lightbox photo={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}
