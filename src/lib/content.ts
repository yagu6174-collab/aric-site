import { readdirSync, readFileSync } from "fs";
import path from "path";
import { insightToZhTW } from "@/lib/locale-sync";
import type { Insight, InsightCopy } from "@/types/insight";
import type { AboutContent, SiteProfile } from "@/types/site";

const root = process.cwd();

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(file, "utf8")) as T;
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

function normalizeAbout(raw: unknown): AboutContent {
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

function normalizeSite(raw: unknown): SiteProfile {
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

export function getSite(): SiteProfile {
  return normalizeSite(readJson(path.join(root, "content", "site.json")));
}

export function getAbout(): AboutContent {
  return normalizeAbout(readJson(path.join(root, "content", "about.json")));
}

export function getInsights(): Insight[] {
  const dir = path.join(root, "content", "insights");
  const files = readdirSync(dir)
    .filter((file) => file.endsWith(".json"))
    .sort();
  return files
    .map((file) => readJson<Insight>(path.join(dir, file)))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getInsightCopies(): InsightCopy[] {
  return getInsights().map((item) => ({
    simplified: item,
    traditional: insightToZhTW(item),
  }));
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

export function getInsightCopy(slug: string): InsightCopy | null {
  const target = normalizeInsightSlug(slug);
  return (
    getInsightCopies().find((item) => normalizeInsightSlug(item.simplified.slug) === target) ??
    null
  );
}
