import type { CSSProperties } from "react";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import type { Dictionary } from "@/i18n/dictionaries";
import { INSIGHT_CATEGORIES, type ArticleBlock, type InsightCategory } from "@/types/insight";
import type { AboutContent, SiteProfile } from "@/types/site";

/**
 * Single simplified-Chinese draft for the public site.
 * Field paths are documented in ADMIN_MAP.md.
 * Traditional Chinese is OpenCC at render time. English chrome stays in en.ts.
 */

export const DRAFT_REVISION = 1;

export const defaultColors = {
  bg: "#f6f3ec",
  bgRaised: "#fffdf8",
  fg: "#2a241e",
  muted: "#5e574e",
  faint: "#6f675e",
  gold: "#6a4e3c",
  goldBright: "#3e3228",
} as const;

export type SiteColors = { [Key in keyof typeof defaultColors]: string };

export type TimelineDraft = {
  id: string;
  period: string;
  title: string;
  detail: string;
};

export type SkillDraft = {
  id: string;
  text: string;
};

export type SocialDraft = {
  id: string;
  label: string;
  href: string;
};

export type InsightDraft = {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: InsightCategory;
  excerpt: string;
  quote: string;
  body: ArticleBlock[];
  order: number;
};

export type SiteDraft = {
  revision: number;
  brand: { name: string; nameEn: string };
  nav: { home: string; insights: string; about: string; contact: string; skip: string };
  hero: { line1: string; line2: string; subtitle: string };
  philosophy: { title: string; paragraphs: string[] };
  latest: { title: string };
  studio: {
    aboutTitle: string;
    aboutDesc: string;
    contactTitle: string;
    contactDesc: string;
  };
  insightsPage: {
    title: string;
    disclaimer: string;
    all: string;
    empty: string;
    charCount: string;
    back: string;
    categories: Record<InsightCategory, string>;
  };
  aboutPage: {
    title: string;
    storyTitle: string;
    portraitAlt: string;
    education: string;
    career: string;
    skills: string;
    story: string[];
  };
  contactPage: {
    title: string;
    wechat: string;
    copy: string;
    copied: string;
    hint: string;
    email: string;
    city: string;
    social: string;
    qrAlt: string;
  };
  footer: { label: string; rights: string };
  notFound: { title: string };
  profile: { wechat: string; email: string; city: string; socials: SocialDraft[] };
  about: { education: TimelineDraft[]; career: TimelineDraft[]; skills: SkillDraft[] };
  insights: InsightDraft[];
  images: { portraitUrl: string; qrUrl: string };
  colors: SiteColors;
};

export type PublicModel = {
  copy: Dictionary;
  profile: SiteProfile;
  about: AboutContent;
  insights: InsightDraft[];
  images: { portraitUrl: string; qrUrl: string };
  colors: SiteColors;
};

const HEX = /^#[0-9a-fA-F]{6}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function reindexInsights(items: InsightDraft[]): InsightDraft[] {
  return items.map((item, order) => ({ ...item, order }));
}

export function moveIndex<T>(items: T[], index: number, delta: -1 | 1): T[] {
  const next = index + delta;
  if (index < 0 || next < 0 || next >= items.length) return items;
  const copy = items.slice();
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function text(value: unknown, fallback: string) {
  return typeof value === "string" ? value.trim() : fallback;
}

function rawText(value: unknown, fallback: string) {
  return typeof value === "string" ? value.replace(/\r\n/g, "\n") : fallback;
}

function lines(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback;
  return value.map((item) => (typeof item === "string" ? item.trim() : "")).filter(Boolean);
}

function color(value: unknown, fallback: string) {
  return typeof value === "string" && HEX.test(value.trim()) ? value.trim() : fallback;
}

export function cssColor(value: string, fallback: string) {
  return HEX.test(value.trim()) ? value.trim() : fallback;
}

function safeUrl(value: unknown) {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!raw) return "";
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:" || url.protocol === "tel:") {
      return raw;
    }
  } catch {
    return "";
  }
  return "";
}

function categoryOf(value: unknown, fallback: InsightCategory): InsightCategory {
  return INSIGHT_CATEGORIES.includes(value as InsightCategory) ? (value as InsightCategory) : fallback;
}

function claimId(value: unknown, used: Set<string>, prefix: string) {
  const raw = typeof value === "string" ? value.trim().replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) : "";
  let next = raw || uid(prefix);
  while (used.has(next)) next = uid(prefix);
  used.add(next);
  return next;
}

function slugOf(value: unknown, fallback: string, used: Set<string>) {
  let next = (typeof value === "string" ? value.trim() : "").replace(/[\\/#?]/g, "").slice(0, 80);
  if (!next) next = fallback || "未命名";
  const base = next;
  let n = 2;
  while (used.has(next)) {
    next = `${base}-${n}`;
    n += 1;
  }
  used.add(next);
  return next;
}

function blockOf(value: unknown): ArticleBlock | null {
  const raw = asRecord(value);
  if (raw.type === "quote") {
    const cite = text(raw.cite, "");
    return cite
      ? { type: "quote", text: rawText(raw.text, "").trim(), cite }
      : { type: "quote", text: rawText(raw.text, "").trim() };
  }
  if (raw.type === "table") {
    const headers = Array.isArray(raw.headers) ? raw.headers.map((cell) => text(cell, "")) : [];
    const rows = Array.isArray(raw.rows)
      ? raw.rows.map((row) => (Array.isArray(row) ? row.map((cell) => text(cell, "")) : []))
      : [];
    return { type: "table", headers, rows };
  }
  if (raw.type === "p") return { type: "p", text: rawText(raw.text, "").trim() };
  return null;
}

function timelineOf(value: unknown, fallback: TimelineDraft[]): TimelineDraft[] {
  if (!Array.isArray(value)) return fallback;
  const used = new Set<string>();
  return value.map((item) => {
    const raw = asRecord(item);
    return {
      id: claimId(raw.id, used, "row"),
      period: text(raw.period, ""),
      title: text(raw.title, ""),
      detail: rawText(raw.detail, "").trim(),
    };
  });
}

function skillsOf(value: unknown, fallback: SkillDraft[]): SkillDraft[] {
  if (!Array.isArray(value)) return fallback;
  const used = new Set<string>();
  return value
    .map((item) => {
      if (typeof item === "string") return { id: claimId("", used, "skill"), text: item.trim() };
      const raw = asRecord(item);
      return { id: claimId(raw.id, used, "skill"), text: text(raw.text, "") };
    })
    .filter((item) => item.text);
}

function socialsOf(value: unknown, fallback: SocialDraft[]): SocialDraft[] {
  if (!Array.isArray(value)) return fallback;
  const used = new Set<string>();
  return value
    .map((item) => {
      const raw = asRecord(item);
      return {
        id: claimId(raw.id, used, "social"),
        label: text(raw.label, ""),
        href: safeUrl(raw.href),
      };
    })
    .filter((item) => item.href);
}

function insightsOf(value: unknown, fallback: InsightDraft[]): InsightDraft[] {
  if (!Array.isArray(value)) return fallback;
  const ids = new Set<string>();
  const slugs = new Set<string>();
  const items = value.map((item, index) => {
    const raw = asRecord(item);
    const body = Array.isArray(raw.body) ? raw.body.map(blockOf).filter((block): block is ArticleBlock => Boolean(block)) : [];
    const order = typeof raw.order === "number" && Number.isFinite(raw.order) ? raw.order : index;
    return {
      id: claimId(raw.id, ids, "post"),
      slug: slugOf(raw.slug, text(raw.title, "未命名"), slugs),
      title: text(raw.title, "未命名"),
      date: DATE.test(text(raw.date, "")) ? text(raw.date, "") : fallback[index]?.date || "2026-01-01",
      category: categoryOf(raw.category, "essay"),
      excerpt: text(raw.excerpt, ""),
      quote: text(raw.quote, ""),
      body,
      order,
    };
  });
  return items.sort((a, b) => a.order - b.order).map((item, order) => ({ ...item, order }));
}

export function normalizeSiteDraft(input: unknown, seed: SiteDraft): SiteDraft {
  const raw = asRecord(input);
  const brand = asRecord(raw.brand);
  const nav = asRecord(raw.nav);
  const hero = asRecord(raw.hero);
  const philosophy = asRecord(raw.philosophy);
  const latest = asRecord(raw.latest);
  const studio = asRecord(raw.studio);
  const insightsPage = asRecord(raw.insightsPage);
  const categories = asRecord(insightsPage.categories);
  const aboutPage = asRecord(raw.aboutPage);
  const contactPage = asRecord(raw.contactPage);
  const footer = asRecord(raw.footer);
  const notFound = asRecord(raw.notFound);
  const profile = asRecord(raw.profile);
  const about = asRecord(raw.about);
  const images = asRecord(raw.images);
  const colors = asRecord(raw.colors);

  const categoryLabels = {} as Record<InsightCategory, string>;
  for (const key of INSIGHT_CATEGORIES) {
    categoryLabels[key] = text(categories[key], seed.insightsPage.categories[key]);
  }

  return {
    revision: DRAFT_REVISION,
    brand: {
      name: text(brand.name, seed.brand.name),
      nameEn: text(brand.nameEn, seed.brand.nameEn),
    },
    nav: {
      home: text(nav.home, seed.nav.home),
      insights: text(nav.insights, seed.nav.insights),
      about: text(nav.about, seed.nav.about),
      contact: text(nav.contact, seed.nav.contact),
      skip: text(nav.skip, seed.nav.skip),
    },
    hero: {
      line1: text(hero.line1, seed.hero.line1),
      line2: text(hero.line2, seed.hero.line2),
      subtitle: text(hero.subtitle, seed.hero.subtitle),
    },
    philosophy: {
      title: text(philosophy.title, seed.philosophy.title),
      paragraphs: lines(philosophy.paragraphs, seed.philosophy.paragraphs),
    },
    latest: { title: text(latest.title, seed.latest.title) },
    studio: {
      aboutTitle: text(studio.aboutTitle, seed.studio.aboutTitle),
      aboutDesc: text(studio.aboutDesc, seed.studio.aboutDesc),
      contactTitle: text(studio.contactTitle, seed.studio.contactTitle),
      contactDesc: text(studio.contactDesc, seed.studio.contactDesc),
    },
    insightsPage: {
      title: text(insightsPage.title, seed.insightsPage.title),
      disclaimer: text(insightsPage.disclaimer, seed.insightsPage.disclaimer),
      all: text(insightsPage.all, seed.insightsPage.all),
      empty: text(insightsPage.empty, seed.insightsPage.empty),
      charCount: text(insightsPage.charCount, seed.insightsPage.charCount),
      back: text(insightsPage.back, seed.insightsPage.back),
      categories: categoryLabels,
    },
    aboutPage: {
      title: text(aboutPage.title, seed.aboutPage.title),
      storyTitle: text(aboutPage.storyTitle, seed.aboutPage.storyTitle),
      portraitAlt: text(aboutPage.portraitAlt, seed.aboutPage.portraitAlt),
      education: text(aboutPage.education, seed.aboutPage.education),
      career: text(aboutPage.career, seed.aboutPage.career),
      skills: text(aboutPage.skills, seed.aboutPage.skills),
      story: lines(aboutPage.story, seed.aboutPage.story),
    },
    contactPage: {
      title: text(contactPage.title, seed.contactPage.title),
      wechat: text(contactPage.wechat, seed.contactPage.wechat),
      copy: text(contactPage.copy, seed.contactPage.copy),
      copied: text(contactPage.copied, seed.contactPage.copied),
      hint: text(contactPage.hint, seed.contactPage.hint),
      email: text(contactPage.email, seed.contactPage.email),
      city: text(contactPage.city, seed.contactPage.city),
      social: text(contactPage.social, seed.contactPage.social),
      qrAlt: text(contactPage.qrAlt, seed.contactPage.qrAlt),
    },
    footer: {
      label: text(footer.label, seed.footer.label),
      rights: text(footer.rights, seed.footer.rights),
    },
    notFound: { title: text(notFound.title, seed.notFound.title) },
    profile: {
      wechat: text(profile.wechat, seed.profile.wechat),
      email: text(profile.email, seed.profile.email),
      city: text(profile.city, seed.profile.city),
      socials: socialsOf(profile.socials, seed.profile.socials),
    },
    about: {
      education: timelineOf(about.education, seed.about.education),
      career: timelineOf(about.career, seed.about.career),
      skills: skillsOf(about.skills, seed.about.skills),
    },
    insights: insightsOf(raw.insights, seed.insights),
    images: {
      portraitUrl: safeUrl(images.portraitUrl),
      qrUrl: safeUrl(images.qrUrl),
    },
    colors: {
      bg: color(colors.bg, seed.colors.bg),
      bgRaised: color(colors.bgRaised, seed.colors.bgRaised),
      fg: color(colors.fg, seed.colors.fg),
      muted: color(colors.muted, seed.colors.muted),
      faint: color(colors.faint, seed.colors.faint),
      gold: color(colors.gold, seed.colors.gold),
      goldBright: color(colors.goldBright, seed.colors.goldBright),
    },
  };
}

export function copyFromDraft(draft: SiteDraft): Dictionary {
  const categories = { ...draft.insightsPage.categories };
  return {
    ...zhCN,
    name: draft.brand.name,
    nameEn: draft.brand.nameEn,
    nav: {
      home: draft.nav.home,
      insights: draft.nav.insights,
      about: draft.nav.about,
      contact: draft.nav.contact,
      skip: draft.nav.skip,
    },
    home: {
      ...zhCN.home,
      heroTitle: [draft.hero.line1, draft.hero.line2].filter(Boolean).join("，"),
      heroLines: [draft.hero.line1, draft.hero.line2],
      heroSubtitle: draft.hero.subtitle,
      philosophyTitle: draft.philosophy.title,
      latestTitle: draft.latest.title,
    },
    studio: {
      ...zhCN.studio,
      about: { title: draft.studio.aboutTitle, desc: draft.studio.aboutDesc },
      contact: { title: draft.studio.contactTitle, desc: draft.studio.contactDesc },
    },
    philosophies: draft.philosophy.paragraphs.map((title) => ({ title, body: "" })),
    insights: {
      ...zhCN.insights,
      title: draft.insightsPage.title,
      disclaimer: draft.insightsPage.disclaimer,
      all: draft.insightsPage.all,
      empty: draft.insightsPage.empty,
      charCount: draft.insightsPage.charCount,
      back: draft.insightsPage.back,
      categories,
    },
    about: {
      title: draft.aboutPage.title,
      storyTitle: draft.aboutPage.storyTitle,
      portraitAlt: draft.aboutPage.portraitAlt,
      education: draft.aboutPage.education,
      career: draft.aboutPage.career,
      skills: draft.aboutPage.skills,
    },
    contact: {
      title: draft.contactPage.title,
      wechat: draft.contactPage.wechat,
      copy: draft.contactPage.copy,
      copied: draft.contactPage.copied,
      hint: draft.contactPage.hint,
      email: draft.contactPage.email,
      city: draft.contactPage.city,
      social: draft.contactPage.social,
      qrAlt: draft.contactPage.qrAlt,
    },
    footer: {
      label: draft.footer.label,
      rights: draft.footer.rights,
    },
    notFound: { title: draft.notFound.title },
  } as unknown as Dictionary;
}

export function presentDraft(draft: SiteDraft): PublicModel {
  const insights = [...draft.insights].sort((a, b) => a.order - b.order || b.date.localeCompare(a.date));
  return {
    copy: copyFromDraft(draft),
    profile: {
      name: draft.brand.name,
      nameEn: draft.brand.nameEn,
      wechat: draft.profile.wechat,
      email: draft.profile.email,
      city: draft.profile.city,
      socials: draft.profile.socials,
    },
    about: {
      story: draft.aboutPage.story,
      education: draft.about.education,
      career: draft.about.career,
      skills: draft.about.skills,
    },
    insights,
    images: {
      portraitUrl: draft.images.portraitUrl || "/placeholders/portrait.png",
      qrUrl: draft.images.qrUrl || "/placeholders/wechat-qr.jpg",
    },
    colors: draft.colors,
  };
}

export function colorVars(colors: SiteColors): CSSProperties {
  const fg = cssColor(colors.fg, defaultColors.fg);
  const hex = fg.replace("#", "");
  const rgb = `${parseInt(hex.slice(0, 2), 16)}, ${parseInt(hex.slice(2, 4), 16)}, ${parseInt(hex.slice(4, 6), 16)}`;
  return {
    "--bg": cssColor(colors.bg, defaultColors.bg),
    "--bg-raised": cssColor(colors.bgRaised, defaultColors.bgRaised),
    "--fg": fg,
    "--muted": cssColor(colors.muted, defaultColors.muted),
    "--faint": cssColor(colors.faint, defaultColors.faint),
    "--gold": cssColor(colors.gold, defaultColors.gold),
    "--gold-bright": cssColor(colors.goldBright, defaultColors.goldBright),
    "--line": `rgba(${rgb}, 0.16)`,
    "--hair": `rgba(${rgb}, 0.1)`,
  } as CSSProperties;
}

export const PORTRAIT_FALLBACK = "/placeholders/portrait.png";
export const QR_FALLBACK = "/placeholders/wechat-qr.jpg";
