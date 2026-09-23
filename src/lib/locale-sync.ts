import { Converter } from "opencc-js";
import type { HomeCopy, HomeCopyBundle } from "@/types/home-copy";
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

export function homeCopyToZhTW(copy: HomeCopy): HomeCopy {
  return mapStringsDeep(copy, toZhTW);
}

async function translateTextToEn(text: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return text;

  const openaiKey = process.env.OPENAI_API_KEY?.trim();
  if (openaiKey) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_TRANSLATE_MODEL?.trim() || "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "Translate Simplified Chinese into natural English for a wealth advisor's personal site. Keep the tone calm and direct. Return only the translation.",
          },
          { role: "user", content: trimmed },
        ],
      }),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const out = data.choices?.[0]?.message?.content?.trim();
      if (out) return out;
    }
  }

  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-CN&tl=en&dt=t&q=" +
    encodeURIComponent(trimmed);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`English translation failed (${res.status})`);
  }
  const data = (await res.json()) as unknown;
  if (!Array.isArray(data) || !Array.isArray(data[0])) {
    throw new Error("English translation returned an unexpected payload");
  }
  return data[0]
    .map((part: unknown) => (Array.isArray(part) ? String(part[0] ?? "") : ""))
    .join("")
    .trim();
}

async function mapStringsAsync<T>(
  value: T,
  map: (text: string) => Promise<string>,
): Promise<T> {
  if (typeof value === "string") return (await map(value)) as T;
  if (Array.isArray(value)) {
    return (await Promise.all(value.map((item) => mapStringsAsync(item, map)))) as T;
  }
  if (value && typeof value === "object") {
    const entries = await Promise.all(
      Object.entries(value).map(async ([key, item]) => [
        key,
        await mapStringsAsync(item, map),
      ]),
    );
    return Object.fromEntries(entries) as T;
  }
  return value;
}

export async function homeCopyToEn(copy: HomeCopy): Promise<HomeCopy> {
  return mapStringsAsync(copy, translateTextToEn);
}

export async function syncHomeCopyFromZhCN(zhCN: HomeCopy): Promise<HomeCopyBundle> {
  const [zhTW, en] = await Promise.all([
    Promise.resolve(homeCopyToZhTW(zhCN)),
    homeCopyToEn(zhCN),
  ]);
  return { "zh-CN": zhCN, "zh-TW": zhTW, en };
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
