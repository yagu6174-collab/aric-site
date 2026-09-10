"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Lightbox } from "@/components/photography/Lightbox";
import { useI18n } from "@/i18n/provider";
import type { Photo } from "@/types/photo";

function albumKey(photo: Photo, untitled: string) {
  return photo.album.trim() || untitled;
}

function wallColumns(count: number, width: number, height: number) {
  if (count <= 1) return 1;
  const gap = 1;
  const maxCols = Math.min(23, count, Math.max(1, Math.floor(width / 68)));
  for (let cols = maxCols; cols >= 1; cols -= 1) {
    const colW = (width - (cols - 1) * gap) / cols;
    const rowH = colW * (9 / 16);
    const rows = Math.ceil(count / cols);
    const totalH = rows * rowH + Math.max(0, rows - 1) * gap;
    if (totalH >= height || cols === 1) return cols;
  }
  return 1;
}

export function PhotographyArchive({ photos }: { photos: Photo[] }) {
  const { dict } = useI18n();
  const untitled = dict.photography.untitled;
  const wallRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [cols, setCols] = useState(6);
  const [album, setAlbum] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<number | null>(null);

  const albums = useMemo(() => {
    const counts = new Map<string, number>();
    for (const photo of photos) {
      const key = albumKey(photo, untitled);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()];
  }, [photos, untitled]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return photos.filter((photo) => {
      const key = albumKey(photo, untitled);
      if (album !== "all" && key !== album) return false;
      if (!needle) return true;
      return (
        key.toLowerCase().includes(needle) ||
        photo.caption.toLowerCase().includes(needle)
      );
    });
  }, [photos, album, query, untitled]);

  useLayoutEffect(() => {
    const node = wallRef.current;
    if (!node) return;
    const sync = () => {
      const width = node.clientWidth || window.innerWidth;
      const height = Math.max(240, window.innerHeight - 96);
      setCols(wallColumns(visible.length, width, height));
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(node);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [visible.length]);

  useEffect(() => {
    if (!searchOpen) return;
    const id = window.setTimeout(() => searchRef.current?.focus(), 40);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("keydown", onKey);
    };
  }, [searchOpen]);

  const openAt = (photo: Photo) => {
    const index = visible.findIndex((item) => item.id === photo.id);
    setActive(index >= 0 ? index : 0);
  };

  return (
    <div className="photo-page">
      <h1 className="sr-only">{dict.photography.title}</h1>
      <header className="photo-toolbar">
        <p className="photo-toolbar-lead">
          {dict.photography.intro}
          {photos.length ? (
            <span>
              {" "}
              {visible.length} {dict.photography.count}
            </span>
          ) : null}
        </p>
        <div className="photo-toolbar-center">
          <button
            type="button"
            className={`photo-bracket ${filterOpen ? "is-on" : ""}`}
            onClick={() => {
              setSearchOpen(false);
              setFilterOpen((open) => !open);
            }}
          >
            {dict.photography.filter}
          </button>
        </div>
        <div className="photo-toolbar-end">
          <button
            type="button"
            className={`photo-bracket photo-bracket-search ${searchOpen ? "is-on" : ""}`}
            onClick={() => {
              setFilterOpen(false);
              setSearchOpen((open) => !open);
            }}
          >
            {dict.photography.search}
          </button>
        </div>
      </header>

      {filterOpen ? (
        <div className="photo-filter-panel">
          <button
            type="button"
            className={`photo-bracket ${album === "all" ? "is-on" : ""}`}
            onClick={() => {
              setAlbum("all");
              setFilterOpen(false);
            }}
          >
            {dict.photography.all}
          </button>
          {albums.map(([name, count]) => (
            <button
              key={name}
              type="button"
              className={`photo-bracket ${album === name ? "is-on" : ""}`}
              onClick={() => {
                setAlbum(name);
                setFilterOpen(false);
              }}
            >
              {name}
              <i>{count}</i>
            </button>
          ))}
        </div>
      ) : null}

      {searchOpen ? (
        <div className="photo-search-bar">
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.photography.searchHint}
            aria-label={dict.photography.search}
          />
          <button
            type="button"
            className="photo-bracket"
            onClick={() => {
              setQuery("");
              setSearchOpen(false);
            }}
          >
            {dict.photography.close}
          </button>
        </div>
      ) : null}

      {!photos.length ? (
        <p className="photo-empty">{dict.photography.empty}</p>
      ) : !visible.length ? (
        <p className="photo-empty">{dict.photography.noResults}</p>
      ) : (
        <div
          ref={wallRef}
          className="photo-wall"
          style={{ "--photo-cols": String(cols) } as CSSProperties}
        >
          {visible.map((photo) => (
            <button
              key={photo.id}
              type="button"
              className="photo-wall-cell"
              onClick={() => openAt(photo)}
              title={photo.caption || albumKey(photo, untitled)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || albumKey(photo, untitled)}
                fill
                sizes={`${Math.ceil(100 / Math.max(cols, 1))}vw`}
                className="photo-wall-img"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {active !== null ? (
        <Lightbox
          photos={visible}
          index={active}
          onClose={() => setActive(null)}
          onIndex={setActive}
        />
      ) : null}
    </div>
  );
}
