"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import type { ArticleBlock, Insight, InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";
import { slugify } from "@/lib/utils";

const categoryLabel = zhCN.insights.categories;

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function emptyParagraph(): ArticleBlock {
  return { type: "p", text: "" };
}

function cleanBlocks(blocks: ArticleBlock[]): ArticleBlock[] {
  const next: ArticleBlock[] = [];
  for (const block of blocks) {
    if (block.type === "p") {
      const text = block.text.trim();
      if (text) next.push({ type: "p", text });
      continue;
    }
    if (block.type === "quote") {
      const text = block.text.trim();
      if (!text) continue;
      const cite = block.cite?.trim();
      next.push(cite ? { type: "quote", text, cite } : { type: "quote", text });
      continue;
    }
    const headers = block.headers.map((cell) => cell.trim()).filter(Boolean);
    const rows = block.rows
      .map((row) => row.map((cell) => cell.trim()))
      .filter((row) => row.some(Boolean));
    if (!headers.length || !rows.length) continue;
    next.push({
      type: "table",
      headers,
      rows: rows.map((row) => Array.from({ length: headers.length }, (_, index) => row[index] ?? "")),
    });
  }
  return next;
}

function failureMessage(status: number, error?: string) {
  if (status === 401) return "请先登录";
  if (error) return error;
  return "没写成，请再试一次";
}

export default function AdminInsightsPage() {
  const [items, setItems] = useState<Insight[]>([]);
  const [editing, setEditing] = useState<Insight | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [quote, setQuote] = useState("");
  const [date, setDate] = useState(today);
  const [blocks, setBlocks] = useState<ArticleBlock[]>([emptyParagraph()]);
  const [category, setCategory] = useState<InsightCategory>("essay");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/insights", { cache: "no-store" });
    const data = (await res.json()) as Insight[];
    setItems(Array.isArray(data) ? data : []);
  }

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = (await res.json()) as { authed?: boolean };
      if (!data.authed) {
        router.replace("/admin");
        return;
      }
      await load();
    })();
  }, [router]);

  function resetForm() {
    setEditing(null);
    setTitle("");
    setExcerpt("");
    setQuote("");
    setDate(today());
    setBlocks([emptyParagraph()]);
    setCategory("essay");
  }

  function beginEdit(item: Insight) {
    setEditing(item);
    setTitle(item.title);
    setExcerpt(item.excerpt);
    setQuote(item.quote);
    setDate(item.date.slice(0, 10));
    setCategory(item.category);
    setBlocks(item.body.length ? item.body : [emptyParagraph()]);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateBlock(index: number, block: ArticleBlock) {
    setBlocks((current) => current.map((item, itemIndex) => (itemIndex === index ? block : item)));
  }

  function removeBlock(index: number) {
    setBlocks((current) => {
      const next = current.filter((_, itemIndex) => itemIndex !== index);
      return next.length ? next : [emptyParagraph()];
    });
  }

  async function save() {
    if (!title.trim() || !excerpt.trim()) {
      setMessage("标题和摘要都要填");
      return;
    }
    const slug = editing?.slug?.trim() || slugify(title);
    const clash = items.find((item) => item.slug === slug);
    if (clash && clash.slug !== editing?.slug) {
      const overwrite = window.confirm(`已经有一篇「${clash.title}」。保存会盖掉它，确定吗？`);
      if (!overwrite) return;
    }

    setPending(true);
    const res = await fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: editing?.slug,
        date,
        readingMinutes: editing?.readingMinutes,
        title: title.trim(),
        excerpt: excerpt.trim(),
        quote: quote.trim(),
        category,
        body: cleanBlocks(blocks),
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (res.ok) {
      setMessage(editing ? "已更新" : "已保存");
      resetForm();
      await load();
    } else {
      setMessage(failureMessage(res.status, data.error));
    }
    setPending(false);
  }

  async function remove(item: Insight) {
    const confirmed = window.confirm(`确定删除「${item.title}」吗？删掉之后前台也不会再显示。`);
    if (!confirmed) return;
    setPending(true);
    const res = await fetch(`/api/insights?slug=${encodeURIComponent(item.slug)}`, {
      method: "DELETE",
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (res.ok) {
      setMessage("已删除");
      if (editing?.slug === item.slug) resetForm();
      await load();
    } else {
      setMessage(failureMessage(res.status, data.error));
    }
    setPending(false);
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-serif text-2xl">{editing ? "编辑文章" : "发布文章"}</h1>
          {editing ? (
            <Button variant="ghost" onClick={resetForm} disabled={pending}>
              取消
            </Button>
          ) : null}
        </div>
        {editing ? (
          <p className="text-sm text-[var(--muted)]">正在改「{editing.title}」。保存后仍是原来的文章。</p>
        ) : null}
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="标题"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as InsightCategory)}
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
          >
            {INSIGHT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {categoryLabel[item]}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
          />
        </div>
        <input
          value={excerpt}
          onChange={(event) => setExcerpt(event.target.value)}
          placeholder="一句话摘要"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <input
          value={quote}
          onChange={(event) => setQuote(event.target.value)}
          placeholder="核心金句"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <div key={index} className="space-y-2 rounded-xl border border-[var(--line)] p-3">
              <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
                <span>{block.type === "p" ? "段落" : block.type === "quote" ? "引文" : "表格"}</span>
                <button type="button" onClick={() => removeBlock(index)} className="underline">
                  删除这段
                </button>
              </div>
              {block.type === "p" ? (
                <textarea
                  value={block.text}
                  onChange={(event) => updateBlock(index, { type: "p", text: event.target.value })}
                  placeholder="这一段写在这里"
                  rows={5}
                  className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
                />
              ) : null}
              {block.type === "quote" ? (
                <>
                  <textarea
                    value={block.text}
                    onChange={(event) =>
                      updateBlock(index, { type: "quote", text: event.target.value, cite: block.cite })
                    }
                    placeholder="引文"
                    rows={3}
                    className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
                  />
                  <input
                    value={block.cite ?? ""}
                    onChange={(event) =>
                      updateBlock(index, { type: "quote", text: block.text, cite: event.target.value })
                    }
                    placeholder="出处，可以空着"
                    className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
                  />
                </>
              ) : null}
              {block.type === "table" ? (
                <>
                  <input
                    value={block.headers.join(" | ")}
                    onChange={(event) =>
                      updateBlock(index, {
                        type: "table",
                        headers: event.target.value.split("|").map((cell) => cell.trim()),
                        rows: block.rows,
                      })
                    }
                    placeholder="列名，用 | 分开"
                    className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
                  />
                  <textarea
                    value={block.rows.map((row) => row.join(" | ")).join("\n")}
                    onChange={(event) =>
                      updateBlock(index, {
                        type: "table",
                        headers: block.headers,
                        rows: event.target.value.split("\n").map((row) => row.split("|").map((cell) => cell.trim())),
                      })
                    }
                    placeholder={"每行一条，单元格用 | 分开"}
                    rows={4}
                    className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
                  />
                </>
              ) : null}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" onClick={() => setBlocks((current) => [...current, emptyParagraph()])}>
            加一段
          </Button>
          <Button
            variant="ghost"
            onClick={() => setBlocks((current) => [...current, { type: "quote", text: "" }])}
          >
            加一句引文
          </Button>
          <Button
            variant="ghost"
            onClick={() =>
              setBlocks((current) => [...current, { type: "table", headers: ["", ""], rows: [["", ""]] }])
            }
          >
            加一张表
          </Button>
        </div>
        <Button onClick={save} disabled={pending}>
          {editing ? "更新" : "保存"}
        </Button>
      </Card>
      {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.slug} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-lg">{item.title}</p>
              <p className="text-xs text-[var(--muted)]">
                {item.date.slice(0, 10)} · {categoryLabel[item.category]}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => beginEdit(item)} disabled={pending}>
                编辑
              </Button>
              <Button variant="ghost" onClick={() => remove(item)} disabled={pending}>
                删除
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
