import { Converter } from "opencc-js";
import type { ArticleBlock, Insight } from "@/types/insight";

const toTraditional = Converter({ from: "cn", to: "tw" });

export function toZhTW(text: string): string {
  if (!text) return text;
  return toTraditional(text);
}

export function mapStringsDeep<T>(value: T, map: (text: string) => string): T {
  if (typeof value === "string") return map(value) as T;
  if (Array.isArray(value)) {
    return value.map((item) => mapStringsDeep(item, map)) as T;
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, mapStringsDeep(item, map)]),
    ) as T;
  }
  return value;
}

export function insightToZhTW(item: Insight): Insight {
  return {
    ...item,
    title: toZhTW(item.title),
    excerpt: toZhTW(item.excerpt),
    quote: toZhTW(item.quote),
    body: item.body.map((block) => blockToZhTW(block)),
  };
}

function blockToZhTW(block: ArticleBlock): ArticleBlock {
  if (block.type === "p") return { type: "p", text: toZhTW(block.text) };
  if (block.type === "quote") {
    return {
      type: "quote",
      text: toZhTW(block.text),
      cite: block.cite ? toZhTW(block.cite) : block.cite,
    };
  }
  return {
    type: "table",
    headers: block.headers.map(toZhTW),
    rows: block.rows.map((row) => row.map(toZhTW)),
  };
}
