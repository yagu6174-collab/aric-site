export const INSIGHT_CATEGORIES = [
  "allocation",
  "market",
  "risk",
  "family",
  "essay",
] as const;

export type InsightCategory = (typeof INSIGHT_CATEGORIES)[number];

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type Insight = {
  slug: string;
  title: string;
  date: string;
  readingMinutes: number;
  category: InsightCategory;
  excerpt: string;
  quote: string;
  body: ArticleBlock[];
};
