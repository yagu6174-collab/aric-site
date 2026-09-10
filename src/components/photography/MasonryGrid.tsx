"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import type { Photo } from "@/types/photo";
import { Lightbox } from "@/components/photography/Lightbox";
import { useI18n } from "@/i18n/provider";

const spans = [
  "sm:col-span-6 lg:col-span-6",
  "sm:col-span-6 lg:col-span-6",
  "sm:col-span-6 lg:col-span-4",
  "sm:col-span-6 lg:col-span-5",
  "sm:col-span-6 lg:col-span-3",
  "sm:col-span-6 lg:col-span-7",
  "sm:col-span-6 lg:col-span-5",
  "sm:col-span-6 lg:col-span-4",
  "sm:col-span-6 lg:col-span-8",
  "sm:col-span-6 lg:col-span-4",
];

const offsets = ["", "lg:mt-8", "lg:mt-20", "lg:mt-4", "lg:mt-14", "lg:mt-2"];

function groupPhotos(photos: Photo[], untitled: string) {
  const map = new Map<string, Photo[]>();
  for (const photo of photos) {
    const key = photo.album.trim() || untitled;
    const list = map.get(key) ?? [];
    list.push(photo);
    map.set(key, list);
  }
  return [...map.entries()];
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function MasonryGrid({ photos }: { photos: Photo[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<Photo | null>(null);
  const groups = useMemo(
    () => groupPhotos(photos, dict.photography.untitled),
    [photos, dict.photography.untitled],
  );

  if (!photos.length) {
    return <p className="py-24 text-[var(--muted)]">{dict.photography.empty}</p>;
  }

  return (
    <>
      {groups.map(([album, items]) => (
        <section key={album} className="mt-16 first:mt-0">
          <header className="mb-8 flex items-end justify-between gap-4 border-b border-[var(--line)] pb-3">
            <h2 className="font-serif text-2xl tracking-wide">{album}</h2>
            <p className="text-xs tracking-[0.18em] text-[var(--muted)]">
              {items.length} {dict.photography.count}
            </p>
          </header>
          <ul className="grid grid-cols-12 items-start gap-x-5 gap-y-10">
            {items.map((photo, index) => (
              <li
                key={photo.id}
                className={`col-span-12 ${spans[index % spans.length]} ${offsets[index % offsets.length]}`}
              >
                <button
                  type="button"
                  className="group block w-full text-left"
                  onClick={() => setActive(photo)}
                >
                  <Image
                    src={photo.url}
                    alt={photo.caption || album}
                    width={1600}
                    height={1200}
                    className="h-auto w-full"
                    unoptimized
                  />
                  <span className="mt-2 flex items-baseline justify-between gap-3 text-[11px] tracking-[0.16em] text-[var(--muted)]">
                    <span>{pad(index + 1)}</span>
                    <span>{photo.caption}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {active ? <Lightbox photo={active} onClose={() => setActive(null)} /> : null}
    </>
  );
}
