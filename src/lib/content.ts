import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { del, list, put } from "@vercel/blob";
import type { AboutContent, HomeContent, SiteProfile } from "@/types/site";
import type { Insight } from "@/types/insight";
import type { Photo } from "@/types/photo";
import { hasBlobToken } from "@/lib/blob";

const root = process.cwd();
const dataDir = path.join(root, ".data");
const insightsSeedDir = path.join(root, "content", "insights");
const localInsights = path.join(dataDir, "insights.json");
const localPhotos = path.join(dataDir, "photos.json");

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(file, "utf8")) as T;
}

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function listAll(prefix: string) {
  const blobs: Awaited<ReturnType<typeof list>>["blobs"] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix, cursor, limit: 1000 });
    blobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);
  return blobs;
}

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobToken()) return null;
  const blobs = await listAll(pathname);
  const hit = blobs
    .filter(
      (item) =>
        item.pathname === pathname || item.pathname.startsWith(`${pathname}-`),
    )
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )[0];
  if (!hit) return null;
  const res = await fetch(hit.url, {
    cache: "no-store",
    headers: process.env.BLOB_READ_WRITE_TOKEN
      ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
      : undefined,
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

async function writeBlobJson(pathname: string, data: unknown) {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

async function seedInsights(): Promise<Insight[]> {
  const files = await readdir(insightsSeedDir);
  const items: Insight[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    items.push(await readJson<Insight>(path.join(insightsSeedDir, file)));
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getSite(): Promise<SiteProfile> {
  return readJson<SiteProfile>(path.join(root, "content", "site.json"));
}

export async function getHome(): Promise<HomeContent> {
  return readJson<HomeContent>(path.join(root, "content", "home.json"));
}

export async function getAbout(): Promise<AboutContent> {
  return readJson<AboutContent>(path.join(root, "content", "about.json"));
}

export async function getInsights(): Promise<Insight[]> {
  const fromBlob = await readBlobJson<Insight[]>("content/insights.json");
  if (fromBlob) return fromBlob.sort((a, b) => b.date.localeCompare(a.date));
  try {
    const local = await readJson<Insight[]>(localInsights);
    return local.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return seedInsights();
  }
}

export async function getInsight(slug: string) {
  const all = await getInsights();
  return all.find((item) => item.slug === slug) ?? null;
}

export async function saveInsights(items: Insight[]) {
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date));
  if (hasBlobToken()) {
    await writeBlobJson("content/insights.json", sorted);
    return sorted;
  }
  await ensureDataDir();
  await writeFile(localInsights, JSON.stringify(sorted, null, 2), "utf8");
  return sorted;
}

export async function getPhotos(): Promise<Photo[]> {
  if (hasBlobToken()) {
    const records = await listAll("gallery/");
    const jsonBlobs = records.filter((item) => item.pathname.endsWith(".json"));
    if (jsonBlobs.length) {
      const photos: Photo[] = [];
      for (const blob of jsonBlobs) {
        try {
          const res = await fetch(blob.url, {
            cache: "no-store",
            headers: process.env.BLOB_READ_WRITE_TOKEN
              ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
              : undefined,
          });
          if (!res.ok) continue;
          photos.push((await res.json()) as Photo);
        } catch {
          continue;
        }
      }
      if (photos.length) return photos;
    }

    const fromIndex = await readBlobJson<Photo[]>("content/photos.json");
    if (fromIndex?.length) return fromIndex;

    const uploaded = await listAll("photos/");
    return uploaded
      .filter((item) => !item.pathname.endsWith(".json"))
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .map((item) => ({
        id: item.pathname,
        url: item.url,
        album: "未分组",
        caption: "",
      }));
  }

  try {
    return await readJson<Photo[]>(localPhotos);
  } catch {
    return readJson<Photo[]>(path.join(root, "content", "photos.json"));
  }
}

export async function savePhotoRecord(photo: Photo) {
  if (hasBlobToken()) {
    await put(`gallery/${photo.id}.json`, JSON.stringify(photo), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return;
  }
  const items = await getPhotos();
  await savePhotos([photo, ...items.filter((item) => item.id !== photo.id)]);
}

export async function savePhotos(items: Photo[]) {
  if (hasBlobToken()) {
    await writeBlobJson("content/photos.json", items);
    return items;
  }
  await ensureDataDir();
  await writeFile(localPhotos, JSON.stringify(items, null, 2), "utf8");
  return items;
}

export async function deletePhoto(id: string) {
  const photos = await getPhotos();
  const target = photos.find((item) => item.id === id);
  if (hasBlobToken()) {
    if (target?.url) {
      try {
        await del(target.url);
      } catch {
        // keep going even if the image blob is already gone
      }
    }
    try {
      await del(`gallery/${id}.json`);
    } catch {
      // recovered photos use the image pathname as id
    }
    if (id.startsWith("photos/")) {
      try {
        await del(id);
      } catch {
        // ignore
      }
    }
    return;
  }
  await savePhotos(photos.filter((item) => item.id !== id));
}

export async function saveLocalUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^\w.\-]+/g, "-");
  const name = `${Date.now()}-${safe}`;
  const dir = path.join(root, "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
