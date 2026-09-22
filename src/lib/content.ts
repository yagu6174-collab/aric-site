import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { del, list, put } from "@vercel/blob";
import { normalizeHomeCopyBundle } from "@/lib/home-copy";
import type { AboutContent, HomeContent, SiteProfile } from "@/types/site";
import type { HomeCopyBundle } from "@/types/home-copy";
import type { Insight } from "@/types/insight";
import type { Photo } from "@/types/photo";
import { hasBlobToken } from "@/lib/blob";

const root = process.cwd();
const dataDir = path.join(root, ".data");
const insightsSeedDir = path.join(root, "content", "insights");
const localInsights = path.join(dataDir, "insights.json");
const localPhotos = path.join(dataDir, "photos.json");
const localHomeCopy = path.join(dataDir, "home-copy.json");

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
    headers: blobAuthHeaders(),
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

function blobAuthHeaders(): HeadersInit | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN
    ? { Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}` }
    : undefined;
}

function pathnameFromUrl(url: string) {
  try {
    return new URL(url).pathname.replace(/^\//, "");
  } catch {
    return "";
  }
}

async function readPhotoFromBlob(url: string): Promise<Photo | null> {
  const res = await fetch(url, {
    cache: "no-store",
    headers: blobAuthHeaders(),
  });
  if (!res.ok) return null;
  const photo = (await res.json()) as Photo;
  return photo?.id && photo?.url ? photo : null;
}

async function getGalleryRecords() {
  const records = await listAll("gallery/");
  const photos: Photo[] = [];
  const seen = new Set<string>();
  for (const blob of records.filter((item) => item.pathname.endsWith(".json"))) {
    try {
      const photo = await readPhotoFromBlob(blob.url);
      if (!photo || seen.has(photo.id)) continue;
      seen.add(photo.id);
      photos.push(photo);
    } catch {
      continue;
    }
  }
  return photos;
}

async function deleteBlobUrls(urls: string[]) {
  const unique = [...new Set(urls.filter(Boolean))];
  for (const url of unique) {
    try {
      await del(url);
    } catch {
      // already gone, or this value is not a blob URL/pathname
    }
  }
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

export async function getHomeCopy(): Promise<HomeCopyBundle> {
  noStore();
  try {
    const fromBlob = await readBlobJson<HomeCopyBundle>("content/home-copy.json");
    if (fromBlob) return normalizeHomeCopyBundle(fromBlob);
  } catch {
    // Blob may be missing or unreachable; fall back to local defaults.
  }
  try {
    return normalizeHomeCopyBundle(await readJson<HomeCopyBundle>(localHomeCopy));
  } catch {
    return normalizeHomeCopyBundle(null);
  }
}

export async function saveHomeCopy(bundle: HomeCopyBundle) {
  const next = normalizeHomeCopyBundle(bundle);
  if (hasBlobToken()) {
    await writeBlobJson("content/home-copy.json", next);
    return next;
  }
  await ensureDataDir();
  await writeFile(localHomeCopy, JSON.stringify(next, null, 2), "utf8");
  return next;
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
    return getGalleryRecords();
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
  await deletePhotos([id]);
}

export async function deletePhotos(ids: string[]) {
  const unique = [...new Set(ids.map((id) => id.trim()).filter(Boolean))];
  if (!unique.length) return;
  const idSet = new Set(unique);

  if (!hasBlobToken()) {
    const photos = await getPhotos();
    await savePhotos(photos.filter((item) => !idSet.has(item.id)));
    return;
  }

  const urls = new Set<string>();
  const galleryBlobs = await listAll("gallery/");

  for (const blob of galleryBlobs) {
    const isRecord = blob.pathname.endsWith(".json");
    const matchesPath = unique.some(
      (id) =>
        blob.pathname === `gallery/${id}.json` ||
        blob.pathname.startsWith(`gallery/${id}`) ||
        blob.pathname === id,
    );
    let record: Photo | null = null;
    if (isRecord) {
      try {
        record = await readPhotoFromBlob(blob.url);
      } catch {
        record = null;
      }
    }
    if (matchesPath || (record && idSet.has(record.id))) {
      urls.add(blob.url);
      if (record?.url) urls.add(record.url);
      const imagePath = record?.url ? pathnameFromUrl(record.url) : "";
      if (imagePath) urls.add(imagePath);
    }
  }

  const imageBlobs = await listAll("photos/");
  for (const blob of imageBlobs) {
    if (
      idSet.has(blob.pathname) ||
      idSet.has(blob.url) ||
      urls.has(blob.url) ||
      urls.has(blob.pathname)
    ) {
      urls.add(blob.url);
      urls.add(blob.pathname);
    }
  }

  for (const id of unique) {
    urls.add(`gallery/${id}.json`);
    if (id.startsWith("photos/")) urls.add(id);
  }

  try {
    const staleIndex = await readBlobJson<Photo[]>("content/photos.json");
    for (const stale of staleIndex ?? []) {
      if (!idSet.has(stale.id) || !stale.url) continue;
      urls.add(stale.url);
      const imagePath = pathnameFromUrl(stale.url);
      if (imagePath) urls.add(imagePath);
    }
    await writeBlobJson("content/photos.json", []);
  } catch {
    // ignore a missing legacy index
  }

  await deleteBlobUrls([...urls]);
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
