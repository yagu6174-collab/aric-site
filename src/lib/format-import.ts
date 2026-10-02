import type { ArticleBlock } from "@/types/insight";

export type ImportedArticle = {
  title: string;
  excerpt: string;
  quote: string;
  blocks: ArticleBlock[];
};

const SENTENCE_END = /[。！？!?…：:」』”"]$/;
const CITE = /^(?:——|--|—)\s*(.+)$/;

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"');
}

function squeezeCjkSpaces(value: string) {
  const spaced = value.match(/[\u4e00-\u9fff] [\u4e00-\u9fff]/g);
  const cjk = value.match(/[\u4e00-\u9fff]/g);
  if (!spaced || !cjk || spaced.length <= cjk.length * 0.3) return value;
  return value.replace(/([\u4e00-\u9fff])[ \t]+(?=[\u4e00-\u9fff])/g, "$1");
}

function tidyInline(value: string) {
  return squeezeCjkSpaces(value)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/__(.+?)__/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s*/, "")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function normalizeImport(raw: string) {
  return decodeEntities(raw)
    .replace(/\uFEFF/g, "")
    .replace(/\r\n?/g, "\n")
    .replace(/\u3000/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function paragraphChunks(text: string) {
  const chunks: string[][] = [];
  let current: string[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed === "---") {
      if (current.length) chunks.push(current);
      current = [];
      continue;
    }
    current.push(trimmed);
  }
  if (current.length) chunks.push(current);
  return chunks;
}

function isTableLine(line: string) {
  return (line.match(/\|/g) ?? []).length >= 2;
}

function isTableRule(line: string) {
  return /^[\s|:-]+$/.test(line);
}

function tableFromLines(lines: string[]): ArticleBlock | null {
  const data = lines.filter((line) => !isTableRule(line));
  if (data.length < 2 || !data.every(isTableLine)) return null;
  const cells = (line: string) =>
    line
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  const headers = cells(data[0]).filter(Boolean);
  if (headers.length < 2) return null;
  const rows = data.slice(1).map((line) => {
    const row = cells(line);
    return Array.from({ length: headers.length }, (_, index) => row[index] ?? "");
  });
  if (!rows.some((row) => row.some(Boolean))) return null;
  return { type: "table", headers, rows };
}

function mergeWrappedLines(lines: string[]) {
  const paragraphs: string[] = [];
  let buffer = "";
  for (const line of lines) {
    if (!buffer) {
      buffer = line;
      continue;
    }
    if (SENTENCE_END.test(buffer) || buffer.length < 18 || isTableLine(line) || isTableLine(buffer)) {
      paragraphs.push(buffer);
      buffer = line;
      continue;
    }
    const needsSpace = /[A-Za-z0-9]$/.test(buffer) && /^[A-Za-z0-9]/.test(line);
    buffer += `${needsSpace ? " " : ""}${line}`;
  }
  if (buffer) paragraphs.push(buffer);
  return paragraphs;
}

function asQuote(text: string) {
  const wrapped = text.match(/^(?:「|"|“)(.+?)(?:」|"|”)$/);
  const body = (wrapped?.[1] ?? (text.startsWith(">") ? text.replace(/^>\s*/, "") : "")).trim();
  if (!body || body.length > 80) return null;
  if (!wrapped && !text.startsWith(">")) return null;
  return body;
}

function firstSentence(text: string) {
  if (text.length <= 48) return text;
  const cut = text.slice(0, 48);
  const mark = Math.max(cut.lastIndexOf("。"), cut.lastIndexOf("！"), cut.lastIndexOf("？"));
  if (mark >= 8) return cut.slice(0, mark + 1);
  return cut;
}

export function formatImportedArticle(raw: string): ImportedArticle {
  const lines = normalizeImport(raw).split("\n");
  let title = "";
  const firstIndex = lines.findIndex((line) => line.trim());
  if (firstIndex >= 0) {
    const first = tidyInline(lines[firstIndex]);
    if (first.length >= 4 && first.length <= 22 && !SENTENCE_END.test(first)) {
      title = first;
      lines.splice(firstIndex, 1);
    }
  }

  const chunks = paragraphChunks(lines.join("\n"));
  const blocks: ArticleBlock[] = [];

  for (const chunk of chunks) {
    const table = tableFromLines(chunk);
    if (table) {
      blocks.push(table);
      continue;
    }
    for (const paragraph of mergeWrappedLines(chunk)) {
      const text = tidyInline(paragraph);
      if (!text) continue;
      const quote = asQuote(text);
      if (quote) {
        blocks.push({ type: "quote", text: quote });
        continue;
      }
      blocks.push({ type: "p", text });
    }
  }

  for (let index = 0; index < blocks.length - 1; index += 1) {
    const block = blocks[index];
    const next = blocks[index + 1];
    if (block?.type !== "quote" || next?.type !== "p") continue;
    const cite = next.text.match(CITE);
    if (!cite) continue;
    block.cite = cite[1].trim();
    blocks.splice(index + 1, 1);
  }

  const quoteBlock = blocks.find((block) => block.type === "quote");
  const firstParagraph = blocks.find((block) => block.type === "p");

  return {
    title,
    excerpt: firstParagraph?.type === "p" ? firstSentence(firstParagraph.text) : "",
    quote: quoteBlock?.type === "quote" ? quoteBlock.text : "",
    blocks: blocks.length ? blocks : [{ type: "p", text: "" }],
  };
}
