import { mkdir, readdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { unstable_noStore as noStore } from "next/cache";
import { list, put } from "@vercel/blob";
import {
  HOME_COPY_REVISION,
  isCurrentHomeCopy,
  normalizeHomeCopyBundle,
} from "@/lib/home-copy";
import { homeCopyToZhTW } from "@/lib/locale-sync";
import type { AboutContent, HomeContent, SiteProfile } from "@/types/site";
import type { HomeCopyBundle } from "@/types/home-copy";
import type { Insight } from "@/types/insight";
import { hasBlobToken } from "@/lib/blob";

const root = process.cwd();
const dataDir = path.join(root, ".data");
const insightsSeedDir = path.join(root, "content", "insights");
const localInsights = path.join(dataDir, "insights.json");
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

type StoredHomeCopy = HomeCopyBundle & { revision?: number };

function withLiveTraditional(bundle: HomeCopyBundle): HomeCopyBundle {
  return {
    ...bundle,
    "zh-TW": homeCopyToZhTW(bundle["zh-CN"]),
  };
}

export async function getHomeCopy(): Promise<HomeCopyBundle> {
  noStore();
  try {
    const fromBlob = await readBlobJson<StoredHomeCopy>("content/home-copy.json");
    if (fromBlob && isCurrentHomeCopy(fromBlob)) {
      return withLiveTraditional(normalizeHomeCopyBundle(fromBlob));
    }
  } catch {
    // Blob may be missing or unreachable; fall back to local defaults.
  }
  try {
    const fromLocal = await readJson<StoredHomeCopy>(localHomeCopy);
    if (isCurrentHomeCopy(fromLocal)) {
      return withLiveTraditional(normalizeHomeCopyBundle(fromLocal));
    }
  } catch {
    // Local file may be missing or still the previous draft.
  }
  return withLiveTraditional(normalizeHomeCopyBundle(null));
}

export async function saveHomeCopy(bundle: HomeCopyBundle) {
  const next = normalizeHomeCopyBundle(bundle);
  const stored: StoredHomeCopy = { ...next, revision: HOME_COPY_REVISION };
  if (hasBlobToken()) {
    await writeBlobJson("content/home-copy.json", stored);
    return next;
  }
  await ensureDataDir();
  await writeFile(localHomeCopy, JSON.stringify(stored, null, 2), "utf8");
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
  const target = normalizeInsightSlug(slug);
  return all.find((item) => normalizeInsightSlug(item.slug) === target) ?? null;
}

function normalizeInsightSlug(value: string) {
  let next = value.trim();
  try {
    next = decodeURIComponent(next);
  } catch {
    // already decoded or malformed
  }
  return next.normalize("NFC");
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
