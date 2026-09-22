import type { Locale } from "@/i18n/config";

export type HomeStudioKey = "insights" | "about" | "photography" | "contact";

export type HomeStudioItem = {
  title: string;
  desc: string;
};

export type HomeCopy = {
  heroLines: string[];
  heroSubtitle: string;
  philosophyTitle: string;
  philosophies: { title: string; body: string }[];
  studioLabel: string;
  studioHint: string;
  studio: Record<HomeStudioKey, HomeStudioItem>;
  latestTitle: string;
  photoBanner: string;
};

export type HomeCopyBundle = Record<Locale, HomeCopy>;
