import { LOCALES, type Locale } from "@/i18n/config";
import { dictionaries, type Dictionary } from "@/i18n/dictionaries";
import type {
  HomeCopy,
  HomeCopyBundle,
  HomeStudioItem,
  HomeStudioKey,
} from "@/types/home-copy";

const STUDIO_KEYS: HomeStudioKey[] = [
  "insights",
  "about",
  "photography",
  "contact",
];

function text(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function studioItem(value: unknown, fallback: HomeStudioItem): HomeStudioItem {
  const raw = value && typeof value === "object" ? (value as HomeStudioItem) : fallback;
  return {
    title: text(raw.title, fallback.title),
    desc: text(raw.desc, fallback.desc),
  };
}

type CopySource = {
  home: {
    heroLines: readonly string[];
    heroSubtitle: string;
    philosophyTitle: string;
    studioLabel: string;
    studioHint: string;
    latestTitle: string;
    photoBanner: string;
  };
  studio: HomeCopy["studio"];
  philosophies: readonly { title: string; body: string }[];
};

export function homeCopyFromDictionary(dict: CopySource): HomeCopy {
  return {
    heroLines: dict.home.heroLines.map((line) => line),
    heroSubtitle: dict.home.heroSubtitle,
    philosophyTitle: dict.home.philosophyTitle,
    philosophies: dict.philosophies.map((item) => ({ ...item })),
    studioLabel: dict.home.studioLabel,
    studioHint: dict.home.studioHint,
    studio: {
      insights: { ...dict.studio.insights },
      about: { ...dict.studio.about },
      photography: { ...dict.studio.photography },
      contact: { ...dict.studio.contact },
    },
    latestTitle: dict.home.latestTitle,
    photoBanner: dict.home.photoBanner,
  };
}

export function defaultHomeCopyBundle(): HomeCopyBundle {
  return {
    "zh-CN": homeCopyFromDictionary(dictionaries["zh-CN"]),
    "zh-TW": homeCopyFromDictionary(dictionaries["zh-TW"]),
    en: homeCopyFromDictionary(dictionaries.en),
  };
}

export function normalizeHomeCopy(raw: unknown, fallback: HomeCopy): HomeCopy {
  const input = raw && typeof raw === "object" ? (raw as Partial<HomeCopy>) : {};
  const lines = Array.isArray(input.heroLines)
    ? input.heroLines.map((line) => text(line).trim()).filter(Boolean).slice(0, 3)
    : fallback.heroLines;
  const philosophies = Array.isArray(input.philosophies)
    ? input.philosophies
        .map((item) => ({
          title: text(item?.title).trim(),
          body: text(item?.body).trim(),
        }))
        .filter((item) => item.title || item.body)
        .slice(0, 8)
    : fallback.philosophies;

  return {
    heroLines: lines.length ? lines : fallback.heroLines,
    heroSubtitle: text(input.heroSubtitle, fallback.heroSubtitle),
    philosophyTitle: text(input.philosophyTitle, fallback.philosophyTitle),
    philosophies: philosophies.length ? philosophies : fallback.philosophies,
    studioLabel: text(input.studioLabel, fallback.studioLabel),
    studioHint: text(input.studioHint, fallback.studioHint),
    studio: Object.fromEntries(
      STUDIO_KEYS.map((key) => [
        key,
        studioItem(input.studio?.[key], fallback.studio[key]),
      ]),
    ) as HomeCopy["studio"],
    latestTitle: text(input.latestTitle, fallback.latestTitle),
    photoBanner: text(input.photoBanner, fallback.photoBanner),
  };
}

export function normalizeHomeCopyBundle(raw: unknown): HomeCopyBundle {
  const defaults = defaultHomeCopyBundle();
  const input = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return Object.fromEntries(
    LOCALES.map((locale) => [
      locale,
      normalizeHomeCopy(input[locale], defaults[locale]),
    ]),
  ) as HomeCopyBundle;
}

export function applyHomeCopy(
  dict: Dictionary,
  copy: HomeCopy,
  locale: Locale,
): Dictionary {
  const heroLines = copy.heroLines.length ? copy.heroLines : dict.home.heroLines;
  return {
    ...dict,
    home: {
      ...dict.home,
      heroLines,
      heroTitle: heroLines.join(locale === "en" ? " " : ""),
      heroSubtitle: copy.heroSubtitle,
      philosophyTitle: copy.philosophyTitle,
      studioLabel: copy.studioLabel,
      studioHint: copy.studioHint,
      latestTitle: copy.latestTitle,
      photoBanner: copy.photoBanner,
    },
    studio: copy.studio,
    philosophies: copy.philosophies.length ? copy.philosophies : dict.philosophies,
  } as Dictionary;
}
