import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { list, put } from "@vercel/blob";
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

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  if (!hasBlobToken()) return null;
  const { blobs } = await list({ prefix: pathname });
  const hit = blobs.find((item) => item.pathname === pathname);
  if (!hit) return null;
  const res = await fetch(hit.url, { cache: "no-store" });
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
  const fromBlob = await readBlobJson<Photo[]>("content/photos.json");
  if (fromBlob) return fromBlob;
  try {
    return await readJson<Photo[]>(localPhotos);
  } catch {
    return readJson<Photo[]>(path.join(root, "content", "photos.json"));
  }
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

export async function saveLocalUpload(file: File) {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name.replace(/[^\w.\-]+/g, "-");
  const name = `${Date.now()}-${safe}`;
  const dir = path.join(root, "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), bytes);
  return `/uploads/${name}`;
}
