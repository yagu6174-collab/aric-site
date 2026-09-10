"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Insight, InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";

export default function AdminInsightsPage() {
  const [items, setItems] = useState<Insight[]>([]);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [quote, setQuote] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<InsightCategory>("essay");
  const [message, setMessage] = useState("");
  const router = useRouter();

  async function load() {
    const res = await fetch("/api/insights", { cache: "no-store" });
    setItems(await res.json());
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

  async function save() {
    const res = await fetch("/api/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        excerpt,
        quote,
        category,
        body: body
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((text) => ({ type: "p", text })),
      }),
    });
    setMessage(res.ok ? "已保存" : "保存失败，请先在后台首页登录");
    if (res.ok) {
      setTitle("");
      setExcerpt("");
      setQuote("");
      setBody("");
      await load();
    }
  }

  async function remove(slug: string) {
    const res = await fetch(`/api/insights?slug=${slug}`, { method: "DELETE" });
    if (res.ok) await load();
    else setMessage("删除失败，请先登录");
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <h1 className="font-serif text-2xl">发布文章</h1>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as InsightCategory)}
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        >
          {INSIGHT_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="一句话摘要"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <input
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          placeholder="核心金句"
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="正文，空两行分段"
          rows={8}
          className="w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
        />
        <Button onClick={save}>保存</Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </Card>
      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.slug} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-serif text-lg">{item.title}</p>
              <p className="text-xs text-[var(--muted)]">{item.slug}</p>
            </div>
            <Button variant="ghost" onClick={() => remove(item.slug)}>
              删除
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
