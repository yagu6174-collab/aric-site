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
const retiredInsightSlugs = new Set([
  "long-horizon",
  "risk-before-return",
  "family-cashflow",
]);
const localHomeCopy = path.join(dataDir, "home-copy.json");
const localAbout = path.join(dataDir, "about.json");
const localSite = path.join(dataDir, "site.json");

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
  let files: string[] = [];
  try {
    files = await readdir(insightsSeedDir);
  } catch {
    return [];
  }
  const items: Insight[] = [];
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    items.push(await readJson<Insight>(path.join(insightsSeedDir, file)));
  }
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

function asText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asTimeline(value: unknown): AboutContent["education"] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row =
        item && typeof item === "object" ? (item as Record<string, unknown>) : {};
      return {
        period: asText(row.period),
        title: asText(row.title),
        detail: asText(row.detail),
      };
    })
    .filter((item) => item.period || item.title || item.detail);
}

export function normalizeAbout(raw: unknown): AboutContent {
  const source =
    raw && typeof raw === "object" ? (raw as Partial<AboutContent>) : {};
  return {
    story: Array.isArray(source.story)
      ? source.story.map((item) => asText(item)).filter(Boolean)
      : [],
    education: asTimeline(source.education),
    career: asTimeline(source.career),
    skills: Array.isArray(source.skills)
      ? source.skills.map((item) => asText(item)).filter(Boolean)
      : [],
  };
}

export function normalizeSite(raw: unknown): SiteProfile {
  const source =
    raw && typeof raw === "object" ? (raw as Partial<SiteProfile>) : {};
  const socials = Array.isArray(source.socials)
    ? source.socials
        .map((item) => {
          const row =
            item && typeof item === "object"
              ? (item as Record<string, unknown>)
              : {};
          return { label: asText(row.label), href: asText(row.href) };
        })
        .filter((item) => item.href)
    : [];
  return {
    name: asText(source.name) || "陆恩惠",
    nameEn: asText(source.nameEn) || "Aric",
    wechat: asText(source.wechat),
    email: asText(source.email),
    city: asText(source.city),
    socials,
  };
}

async function readStored<T>(
  blobPath: string,
  localPath: string,
  fallbackPath: string,
  normalize: (raw: unknown) => T,
): Promise<T> {
  noStore();
  try {
    const fromBlob = await readBlobJson<unknown>(blobPath);
    if (fromBlob) return normalize(fromBlob);
  } catch {
    // Blob may be missing; fall through.
  }
  try {
    return normalize(await readJson<unknown>(localPath));
  } catch {
    // Local override may be missing.
  }
  return normalize(await readJson<unknown>(fallbackPath));
}

async function writeStored(blobPath: string, localPath: string, data: unknown) {
  if (hasBlobToken()) {
    await writeBlobJson(blobPath, data);
    return;
  }
  await ensureDataDir();
  await writeFile(localPath, JSON.stringify(data, null, 2), "utf8");
}

export async function getSite(): Promise<SiteProfile> {
  return readStored(
    "content/site.json",
    localSite,
    path.join(root, "content", "site.json"),
    normalizeSite,
  );
}

export async function saveSite(raw: unknown) {
  const next = normalizeSite(raw);
  await writeStored("content/site.json", localSite, next);
  return next;
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
  return readStored(
    "content/about.json",
    localAbout,
    path.join(root, "content", "about.json"),
    normalizeAbout,
  );
}

export async function saveAbout(raw: unknown) {
  const next = normalizeAbout(raw);
  await writeStored("content/about.json", localAbout, next);
  return next;
}

function withoutRetiredInsights(items: Insight[]) {
  return items
    .filter((item) => !retiredInsightSlugs.has(normalizeInsightSlug(item.slug)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getInsights(): Promise<Insight[]> {
  const fromBlob = await readBlobJson<Insight[]>("content/insights.json");
  if (fromBlob) return withoutRetiredInsights(fromBlob);
  try {
    const local = await readJson<Insight[]>(localInsights);
    return withoutRetiredInsights(local);
  } catch {
    return withoutRetiredInsights(await seedInsights());
  }
}

export async function getInsight(slug: string) {
  const all = await getInsights();
  const target = normalizeInsightSlug(slug);
  return all.find((item) => normalizeInsightSlug(item.slug) === target) ?? null;
}

export function normalizeInsightSlug(value: string) {
  let next = value.trim();
  try {
    next = decodeURIComponent(next);
  } catch {
    // already decoded or malformed
  }
  return next.normalize("NFC");
}

export async function saveInsights(items: Insight[]) {
  const sorted = withoutRetiredInsights(items);
  if (hasBlobToken()) {
    await writeBlobJson("content/insights.json", sorted);
    return sorted;
  }
  await ensureDataDir();
  await writeFile(localInsights, JSON.stringify(sorted, null, 2), "utf8");
  return sorted;
}
