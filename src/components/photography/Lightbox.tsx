"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import type { Photo } from "@/types/photo";
import { useI18n } from "@/i18n/provider";

export function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (next: number) => void;
}) {
  const { dict } = useI18n();
  const photo = photos[index];
  const total = photos.length;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (!total) return;
      if (event.key === "ArrowLeft") onIndex((index - 1 + total) % total);
      if (event.key === "ArrowRight") onIndex((index + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [index, total, onClose, onIndex]);

  if (!mounted || !photo) return null;

  const go = (delta: number) => {
    if (!total) return;
    onIndex((index + delta + total) % total);
  };

  return createPortal(
    <div className="photo-lightbox" onClick={onClose}>
      <header className="photo-lightbox-bar" onClick={(event) => event.stopPropagation()}>
        <p>
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="photo-lightbox-actions">
          {total > 1 ? (
            <>
              <button type="button" className="photo-bracket" onClick={() => go(-1)}>
                {dict.photography.prev}
              </button>
              <button type="button" className="photo-bracket" onClick={() => go(1)}>
                {dict.photography.next}
              </button>
            </>
          ) : null}
          <button type="button" className="photo-bracket" onClick={onClose}>
            {dict.photography.close}
          </button>
        </div>
      </header>
      <figure
        className="photo-lightbox-figure"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="photo-lightbox-frame">
          <Image
            src={photo.url}
            alt={photo.caption || photo.album}
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <figcaption>
          <span>{photo.album}</span>
          {photo.caption ? <p>{photo.caption}</p> : null}
        </figcaption>
      </figure>
    </div>,
    document.body,
  );
}
