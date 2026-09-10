"use client";

import { X } from "lucide-react";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import { useI18n } from "@/i18n/provider";

export function Lightbox({
  photo,
  onClose,
}: {
  photo: Photo;
  onClose: () => void;
}) {
  const { dict } = useI18n();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/86 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-5 right-5 text-white"
        aria-label={dict.photography.close}
        onClick={onClose}
      >
        <X />
      </button>
      <figure
        className="max-h-[88vh] max-w-5xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-[70vh] w-[min(90vw,960px)]">
          <Image
            src={photo.url}
            alt={photo.album}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <figcaption className="mt-4 text-center text-sm text-white/80">
          <span className="font-serif text-lg text-white">{photo.album}</span>
          {photo.caption ? <p className="mt-1">{photo.caption}</p> : null}
        </figcaption>
      </figure>
    </div>
  );
}
