import "server-only";
import { cache } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { normalizeSiteDraft, presentDraft, type PublicModel, type SiteDraft } from "@/lib/draft";
import { insightToZhTW, mapStringsDeep, toZhTW } from "@/lib/locale-sync";
import { seedDraft } from "@/lib/seed";
import { readStored, writeStored } from "@/lib/store";

const KEY = "site";

export const readSiteDraft = cache(async (): Promise<SiteDraft> => {
  const seed = seedDraft();
  try {
    const stored = await readStored(KEY);
    if (!stored) return seed;
    return normalizeSiteDraft(stored, seed);
  } catch {
    return seed;
  }
});

export async function saveSiteDraft(input: unknown): Promise<SiteDraft> {
  const draft = normalizeSiteDraft(input, seedDraft());
  await writeStored(KEY, draft);
  return draft;
}

export type PublicBundle = PublicModel & {
  traditionalCopy: Dictionary;
  traditionalProfile: PublicModel["profile"];
  traditionalAbout: PublicModel["about"];
  traditionalInsights: PublicModel["insights"];
};

export const loadPublic = cache(async (): Promise<PublicBundle> => {
  const model = presentDraft(await readSiteDraft());
  return {
    ...model,
    traditionalCopy: mapStringsDeep(model.copy, toZhTW) as unknown as Dictionary,
    traditionalProfile: mapStringsDeep(model.profile, toZhTW),
    traditionalAbout: mapStringsDeep(model.about, toZhTW),
    traditionalInsights: model.insights.map((item) => insightToZhTW(item)),
  };
});
