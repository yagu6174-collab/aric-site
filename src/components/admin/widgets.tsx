"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cssColor, type SiteColors } from "@/lib/draft";

export const fieldClass =
  "mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm";

export const quietClass =
  "inline-flex items-center justify-center rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 disabled:cursor-not-allowed disabled:opacity-40";

export function FormShell({ title, hint, scrollKey, children }: { title: string; hint?: string; scrollKey: string; children: ReactNode }) {
  const head = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = head.current?.closest("aside");
    if (scroller instanceof HTMLElement) scroller.scrollTop = 0;
  }, [scrollKey]);

  return (
    <div ref={head} className="px-4 pb-8 sm:px-5">
      <header className="sticky top-0 z-10 -mx-4 border-b border-stone-200/80 bg-stone-50/95 px-4 pt-5 pb-4 backdrop-blur-sm sm:-mx-5 sm:px-5">
        <h2 className="text-lg font-semibold tracking-tight text-stone-950">
          <span className="mb-1 block text-[11px] font-medium text-indigo-600">当前编辑</span>
          {title}
        </h2>
        {hint ? <p className="mt-1.5 text-xs leading-relaxed text-stone-500">{hint}</p> : null}
      </header>
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function FormGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-3.5">
      <h3 className="text-xs font-medium text-stone-500">{title}</h3>
      {children}
    </section>
  );
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mt-3 block text-sm font-medium text-stone-800">
      {label}
      {children}
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <Field label={label}>
      {multiline ? (
        <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className={fieldClass} />
      ) : (
        <input value={value} onChange={(event) => onChange(event.target.value)} className={fieldClass} />
      )}
    </Field>
  );
}

export function JumpList({ items, onSelect }: { items: readonly (readonly [string, string])[]; onSelect: (id: string) => void }) {
  return (
    <div className="mt-3 grid grid-cols-2 gap-2">
      {items.map(([id, label]) => (
        <button key={id} type="button" className={`${quietClass} min-h-10`} onClick={() => onSelect(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function MiniNav({
  items,
  selected,
  onSelect,
}: {
  items: readonly (readonly [string, string])[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={`rounded-full px-3 py-1 text-xs ${selected === id ? "bg-indigo-600 text-white" : "bg-stone-100 text-stone-700"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function MoveRow({
  index,
  total,
  onMove,
  onDelete,
  deleteLabel,
}: {
  index: number;
  total: number;
  onMove: (delta: -1 | 1) => void;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" className={quietClass} disabled={index <= 0} onClick={() => onMove(-1)}>
        上移
      </button>
      <button type="button" className={quietClass} disabled={index < 0 || index >= total - 1} onClick={() => onMove(1)}>
        下移
      </button>
      {onDelete ? (
        <button type="button" className={quietClass} onClick={onDelete}>
          {deleteLabel ?? "删除"}
        </button>
      ) : null}
    </div>
  );
}

const colorMeta: { key: keyof SiteColors; label: string; hint: string }[] = [
  { key: "bg", label: "纸色", hint: "整页背景" },
  { key: "bgRaised", label: "抬起的纸", hint: "卡片和输入底" },
  { key: "fg", label: "墨色", hint: "标题和正文" },
  { key: "muted", label: "次要文字", hint: "导语、摘要" },
  { key: "faint", label: "更淡的字", hint: "日期、辅助" },
  { key: "gold", label: "棕", hint: "名字、链接、细线强调" },
  { key: "goldBright", label: "深棕", hint: "少量更深的强调" },
];

export function ColorFields({ colors, onChange }: { colors: SiteColors; onChange: (next: SiteColors) => void }) {
  return (
    <>
      {colorMeta.map((item) => (
        <div key={item.key} className="mt-3">
          <label className="block text-sm font-medium text-stone-800">
            {item.label}
            <span className="mt-0.5 block text-xs font-normal text-stone-500">{item.hint}</span>
            <span className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={cssColor(colors[item.key], "#000000")}
                onChange={(event) => onChange({ ...colors, [item.key]: event.target.value })}
                className="h-11 w-14 shrink-0 cursor-pointer rounded-xl border border-stone-200 bg-white p-1"
                aria-label={item.label}
              />
              <input
                value={colors[item.key]}
                onChange={(event) => onChange({ ...colors, [item.key]: event.target.value })}
                spellCheck={false}
                className={`${fieldClass} mt-0 font-mono`}
              />
            </span>
          </label>
        </div>
      ))}
      <p className="mt-3 text-xs leading-relaxed text-stone-500">用 #RRGGBB。不是这种格式的值，保存时会退回原来的颜色。分割线跟着墨色走。</p>
    </>
  );
}

export function ImageField({ label, value, onChange, emptyHint }: { label: string; value: string; onChange: (url: string) => void; emptyHint?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    const body = new FormData();
    body.set("file", file);
    const res = await fetch("/api/site/image", { method: "POST", body });
    setBusy(false);
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(json?.error === "size" ? "图片超过 5MB。" : json?.error === "type" ? "请选图片文件。" : "照片没有传上去，请再选一次。");
      return;
    }
    const json = (await res.json()) as { url?: string };
    if (json.url) onChange(json.url);
  }

  return (
    <div className="mt-3">
      <p className="text-sm font-medium text-stone-800">{label}</p>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="也可以直接填写图片地址" className={fieldClass} />
      <button type="button" onClick={() => fileRef.current?.click()} className={`${quietClass} mt-2 min-h-11 w-full`}>
        上传图片
      </button>
      <input ref={fileRef} type="file" accept="image/*" onChange={(event) => void upload(event.target.files?.[0])} className="sr-only" />
      {busy ? <p className="mt-2 text-xs text-stone-500">上传中…</p> : null}
      {error ? <p className="mt-2 text-xs font-medium text-red-700">{error}</p> : null}
      {value ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="mt-2 h-28 w-full rounded-xl object-cover" />
          <button type="button" className={`${quietClass} mt-2`} onClick={() => onChange("")}>
            去掉图片
          </button>
        </>
      ) : emptyHint ? (
        <p className="mt-2 text-xs leading-relaxed text-stone-500">{emptyHint}</p>
      ) : null}
    </div>
  );
}

export function OrderList({
  items,
  onReorder,
  onSelect,
  label,
}: {
  items: { id: string; title: string }[];
  onReorder: (from: number, to: number) => void;
  onSelect: (id: string) => void;
  label: string;
}) {
  const [dragging, setDragging] = useState<number | null>(null);
  const [over, setOver] = useState<number | null>(null);

  function place(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || to >= items.length) return;
    onReorder(from, to);
  }

  if (!items.length) return <p className="mt-3 text-sm text-stone-600">还没有内容。</p>;

  return (
    <ol className="mt-3 space-y-2" aria-label={label}>
      {items.map((item, index) => (
        <li
          key={item.id}
          onDragOver={(event) => {
            event.preventDefault();
            setOver(index);
          }}
          onDrop={(event) => {
            event.preventDefault();
            const from = Number(event.dataTransfer.getData("text/plain"));
            place(Number.isInteger(from) ? from : (dragging ?? -1), index);
            setDragging(null);
            setOver(null);
          }}
          className={`flex items-center gap-2 rounded-xl border bg-stone-50 p-2 ${over === index ? "border-indigo-400" : "border-stone-200"}`}
        >
          <button
            type="button"
            draggable
            aria-label={`拖动「${item.title}」`}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", String(index));
              setDragging(index);
            }}
            onDragEnd={() => {
              setDragging(null);
              setOver(null);
            }}
            className="cursor-grab px-1 text-stone-400"
          >
            ::
          </button>
          <button type="button" onClick={() => onSelect(item.id)} className="min-w-0 flex-1 truncate text-left text-sm font-medium">
            <span className="mr-2 text-xs text-stone-400 tabular-nums">{index + 1}</span>
            {item.title || "未命名"}
          </button>
          <button type="button" className={quietClass} disabled={index === 0} onClick={() => place(index, index - 1)}>
            上移
          </button>
          <button type="button" className={quietClass} disabled={index === items.length - 1} onClick={() => place(index, index + 1)}>
            下移
          </button>
        </li>
      ))}
    </ol>
  );
}
