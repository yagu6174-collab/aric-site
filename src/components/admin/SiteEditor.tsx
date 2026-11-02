"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { EditorForm } from "@/components/admin/EditorForm";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SitePreview } from "@/components/admin/SitePreview";
import { VisitPanel } from "@/components/admin/VisitPanel";
import type { AddKind, PreviewPage } from "@/components/edit/mode";
import { reindexInsights, uid, type InsightDraft, type SiteDraft } from "@/lib/draft";
import type { VisitSummary } from "@/lib/visit-math";

const pages: { id: PreviewPage; label: string }[] = [
  { id: "home", label: "首页" },
  { id: "insights", label: "见解" },
  { id: "about", label: "关于" },
  { id: "contact", label: "联系" },
  { id: "reading", label: "阅读" },
];

function sorted(insights: InsightDraft[]) {
  return [...insights].sort((a, b) => a.order - b.order);
}

function pageFor(id: string | null, page: PreviewPage, insights: InsightDraft[]): PreviewPage | null {
  if (!id) return null;
  if (id.startsWith("insight:")) {
    const insightId = id.slice("insight:".length);
    const index = sorted(insights).findIndex((item) => item.id === insightId);
    if (page === "reading") return "reading";
    if (page === "home" && index >= 0 && index < 3) return "home";
    return "insights";
  }
  if (id.startsWith("edu:") || id.startsWith("job:") || id.startsWith("skill:") || id === "about-copy" || id === "portrait") return "about";
  if (id.startsWith("social:") || id === "contact-copy" || id === "profile" || id === "qr") return "contact";
  if (id === "philosophy" || id === "hero" || id === "hero-lead" || id === "latest" || id.startsWith("studio-")) return "home";
  if (id === "insights-copy" || id === "categories" || id === "insights-order") return "insights";
  return null;
}

export function SiteEditor({ initial, visits }: { initial: SiteDraft; visits: VisitSummary }) {
  const [draft, setDraft] = useState(initial);
  const [selected, setSelected] = useState<string | null>(null);
  const [page, setPage] = useState<PreviewPage>("home");
  const [pane, setPane] = useState<"preview" | "edit">("preview");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<null | { message: string; run: () => void }>(null);

  function ask(message: string, run: () => void) {
    setPending({ message, run });
  }

  function choose(id: string | null) {
    setSelected(id);
    if (id) setPane("edit");
    const next = pageFor(id, page, draft.insights);
    if (next) setPage(next);
  }

  function onAdd(kind: AddKind) {
    if (kind === "insight") {
      ask("要在草稿里加一篇吗？", () => {
        const id = uid("post");
        const now = new Date();
        const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
        setDraft((current) => ({
          ...current,
          insights: reindexInsights([
            { id, slug: "新的一篇", title: "新的一篇", date, category: "essay", excerpt: "", quote: "", body: [{ type: "p", text: "" }], order: 0 },
            ...sorted(current.insights),
          ]),
        }));
        setSelected(`insight:${id}`);
        setPage("insights");
        setPane("edit");
      });
      return;
    }
    if (kind === "paragraph") {
      ask("要再加一段吗？", () => {
        setDraft((current) => ({ ...current, philosophy: { ...current.philosophy, paragraphs: [...current.philosophy.paragraphs, "再写一段。"] } }));
        setSelected("philosophy");
        setPage("home");
        setPane("edit");
      });
      return;
    }
    if (kind === "story") {
      ask("要加一段介绍吗？", () => {
        setDraft((current) => ({ ...current, aboutPage: { ...current.aboutPage, story: [...current.aboutPage.story, "再写一句。"] } }));
        setSelected("about-copy");
        setPage("about");
        setPane("edit");
      });
      return;
    }
    if (kind === "edu" || kind === "job") {
      const label = kind === "edu" ? "要加一条教育经历吗？" : "要加一条履历吗？";
      ask(label, () => {
        const id = uid(kind);
        const row = { id, period: "", title: kind === "edu" ? "新的教育" : "新的履历", detail: "" };
        const field = kind === "edu" ? "education" : "career";
        setDraft((current) => ({ ...current, about: { ...current.about, [field]: [...current.about[field], row] } }));
        setSelected(`${kind}:${id}`);
        setPage("about");
        setPane("edit");
      });
      return;
    }
    if (kind === "skill") {
      ask("要加一项技能吗？", () => {
        const id = uid("skill");
        setDraft((current) => ({ ...current, about: { ...current.about, skills: [...current.about.skills, { id, text: "新的一项" }] } }));
        setSelected(`skill:${id}`);
        setPage("about");
        setPane("edit");
      });
      return;
    }
    ask("要加一个链接吗？", () => {
      const id = uid("social");
      setDraft((current) => ({
        ...current,
        profile: { ...current.profile, socials: [...current.profile.socials, { id, label: "新的链接", href: "https://example.com" }] },
      }));
      setSelected(`social:${id}`);
      setPage("contact");
      setPane("edit");
    });
  }

  useEffect(() => {
    const root = document.documentElement;
    const previous = root.lang;
    root.lang = "zh-CN";
    return () => {
      root.lang = previous;
    };
  }, []);

  useEffect(() => {
    if (!selected) return;
    const node = document.querySelector(`[data-edit-id="${CSS.escape(selected)}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [selected, page]);

  async function save() {
    setSaving(true);
    setStatus("");
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    setSaving(false);
    if (!res.ok) {
      setStatus("没有保存。");
      return;
    }
    setDraft((await res.json()) as SiteDraft);
    setStatus("已保存。公开页现在用这份内容。");
  }

  return (
    <div className="admin-shell h-dvh overflow-y-auto bg-stone-100 text-stone-900">
      <header className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border-b border-stone-200 bg-white px-3 py-1.5 sm:px-4">
        <p className="text-sm font-semibold tracking-tight">后台</p>
        <Link href="/" className="rounded-full border border-stone-300 px-2.5 py-0.5 text-sm text-stone-800">
          回到主页
        </Link>
        <div className="flex rounded-full bg-stone-100 p-0.5 lg:hidden">
          <button type="button" onClick={() => setPane("preview")} className={`rounded-full px-2.5 py-0.5 text-xs ${pane === "preview" ? "bg-white shadow" : ""}`}>
            预览
          </button>
          <button type="button" onClick={() => setPane("edit")} className={`rounded-full px-2.5 py-0.5 text-xs ${pane === "edit" ? "bg-white shadow" : ""}`}>
            表单
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2.5">
          <span className="text-xs text-stone-500">{status}</span>
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-full bg-indigo-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-60">
            {saving ? "保存中…" : "保存"}
          </button>
          <LogoutButton />
        </div>
      </header>
      <div className="border-b border-stone-200 bg-stone-100 px-3 py-1.5 sm:px-4">
        <VisitPanel visits={visits} />
      </div>
      <div className="flex items-start">
        <div className={`flex min-h-dvh min-w-0 flex-1 flex-col ${pane === "edit" ? "max-lg:hidden" : ""}`}>
          <div className="sticky top-0 z-30 flex h-9 shrink-0 items-center gap-2 overflow-x-auto border-b border-stone-200 bg-white px-3">
            {pages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs ${page === item.id ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-700"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <SitePreview draft={draft} page={page} selected={selected} onSelect={choose} onAdd={onAdd} />
        </div>
        <aside className={`sticky top-0 z-20 h-dvh w-full shrink-0 self-start overflow-y-auto border-l border-stone-200 bg-stone-50 lg:w-96 ${pane === "preview" ? "max-lg:hidden" : ""}`}>
          {selected ? (
            <div className="sticky top-0 z-20 flex justify-end border-b border-stone-200 bg-stone-50 px-4 py-2">
              <button type="button" className="text-xs text-stone-500 underline-offset-2 hover:underline" onClick={() => setSelected(null)}>
                目录
              </button>
            </div>
          ) : null}
          <EditorForm draft={draft} selected={selected} onChange={setDraft} onSelect={choose} onPreview={setPage} ask={ask} />
        </aside>
      </div>
      {pending ? (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-slate-950/50 p-4">
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-3xl bg-white p-6 text-stone-900 shadow-xl">
            <p className="text-base font-medium leading-relaxed">{pending.message}</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="rounded-full border border-stone-300 px-4 py-2 text-sm" onClick={() => setPending(null)}>
                取消
              </button>
              <button
                type="button"
                className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
                onClick={() => {
                  pending.run();
                  setPending(null);
                }}
              >
                确定
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
