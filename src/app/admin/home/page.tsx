"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LOCALES, type Locale } from "@/i18n/config";
import { defaultHomeCopyBundle } from "@/lib/home-copy";
import { cn } from "@/lib/utils";
import type { HomeCopy, HomeCopyBundle, HomeStudioKey } from "@/types/home-copy";

const localeLabels: Record<Locale, string> = {
  "zh-CN": "简体",
  "zh-TW": "繁體",
  en: "English",
};

const studioLabels: { key: HomeStudioKey; label: string }[] = [
  { key: "about", label: "关于与履历" },
  { key: "contact", label: "联系" },
];

const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2";

function Field({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  placeholder,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs tracking-wide text-[var(--muted)]">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={rows}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          className={cn(fieldClass, readOnly && "opacity-70")}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={(event) => onChange?.(event.target.value)}
          className={cn(fieldClass, readOnly && "opacity-70")}
        />
      )}
    </label>
  );
}

export default function AdminHomeCopyPage() {
  const router = useRouter();
  const [bundle, setBundle] = useState<HomeCopyBundle | null>(null);
  const [locale, setLocale] = useState<Locale>("zh-CN");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const readOnly = locale !== "zh-CN";

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/auth", { cache: "no-store" });
      const data = (await res.json()) as { authed?: boolean };
      if (!data.authed) {
        router.replace("/admin");
        return;
      }
      const copyRes = await fetch("/api/home", { cache: "no-store" });
      if (!copyRes.ok) {
        router.replace("/admin");
        return;
      }
      setBundle(await copyRes.json());
    })();
  }, [router]);

  function update(patch: Partial<HomeCopy>) {
    if (!bundle || readOnly) return;
    setBundle({
      ...bundle,
      "zh-CN": { ...bundle["zh-CN"], ...patch },
    });
  }

  function updateStudio(key: HomeStudioKey, patch: Partial<HomeCopy["studio"][HomeStudioKey]>) {
    if (!bundle || readOnly) return;
    const current = bundle["zh-CN"];
    update({
      studio: {
        ...current.studio,
        [key]: { ...current.studio[key], ...patch },
      },
    });
  }

  function updatePhilosophy(index: number, patch: Partial<HomeCopy["philosophies"][number]>) {
    if (!bundle || readOnly) return;
    update({
      philosophies: bundle["zh-CN"].philosophies.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  async function save() {
    if (!bundle) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/home", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bundle),
    });
    setBusy(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setMessage(data?.error || "保存失败，请先在后台首页登录");
      return;
    }
    setBundle(await res.json());
    router.refresh();
    setMessage("已保存：繁体已自动转换，英文已同步翻译");
  }

  function restoreZhCN() {
    if (!bundle) return;
    const defaults = defaultHomeCopyBundle();
    setBundle({ ...bundle, "zh-CN": defaults["zh-CN"] });
    setLocale("zh-CN");
    setMessage("已恢复简体默认文案，保存后会同步繁体与英文");
  }

  if (!bundle) {
    return <p className="text-sm text-[var(--muted)]">正在载入主页文案…</p>;
  }

  const copy = bundle[locale];

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl">主页文案</h1>
            <p className="mt-1 text-sm text-[var(--muted)]">
              只改简体。保存后，繁体会自动转换，英文会自动翻译更新。
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {LOCALES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLocale(item)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm",
                  locale === item
                    ? "bg-[var(--fg)] text-[var(--bg)]"
                    : "border border-[var(--line)] text-[var(--muted)]",
                )}
              >
                {localeLabels[item]}
              </button>
            ))}
          </div>
        </div>
        {readOnly ? (
          <p className="text-sm text-[var(--muted)]">
            当前是{localeLabels[locale]}预览，不能在这里改字。回到简体编辑后保存即可同步。
          </p>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-xl">封面</h2>
        <Field
          label="大标题第一行"
          value={copy.heroLines[0] ?? ""}
          readOnly={readOnly}
          onChange={(value) => update({ heroLines: [value, copy.heroLines[1] ?? ""] })}
        />
        <Field
          label="大标题第二行（可留空）"
          value={copy.heroLines[1] ?? ""}
          readOnly={readOnly}
          onChange={(value) => update({ heroLines: [copy.heroLines[0] ?? "", value] })}
        />
        <Field
          label="封面导语"
          value={copy.heroSubtitle}
          readOnly={readOnly}
          onChange={(heroSubtitle) => update({ heroSubtitle })}
        />
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-xl">章节 01</h2>
        <Field
          label="章节标题"
          value={copy.philosophyTitle}
          readOnly={readOnly}
          onChange={(philosophyTitle) => update({ philosophyTitle })}
        />
        {copy.philosophies.map((item, index) => (
          <div key={index} className="space-y-3 border-t border-[var(--line)] pt-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-[var(--muted)]">条目 {index + 1}</p>
              {!readOnly && copy.philosophies.length > 1 ? (
                <button
                  type="button"
                  className="text-sm text-[var(--muted)]"
                  onClick={() =>
                    update({
                      philosophies: copy.philosophies.filter((_, itemIndex) => itemIndex !== index),
                    })
                  }
                >
                  删除
                </button>
              ) : null}
            </div>
            <Field
              label="条目标题"
              value={item.title}
              readOnly={readOnly}
              onChange={(title) => updatePhilosophy(index, { title })}
            />
            <Field
              label="条目正文"
              value={item.body}
              multiline
              readOnly={readOnly}
              onChange={(body) => updatePhilosophy(index, { body })}
            />
          </div>
        ))}
        {!readOnly && copy.philosophies.length < 8 ? (
          <Button
            variant="ghost"
            onClick={() =>
              update({
                philosophies: [...copy.philosophies, { title: "", body: "" }],
              })
            }
          >
            添加一条
          </Button>
        ) : null}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-xl">工作室目录</h2>
        <Field
          label="目录标题"
          value={copy.studioLabel}
          readOnly={readOnly}
          onChange={(studioLabel) => update({ studioLabel })}
        />
        <Field
          label="目录说明"
          value={copy.studioHint}
          multiline
          rows={2}
          readOnly={readOnly}
          onChange={(studioHint) => update({ studioHint })}
        />
        {studioLabels.map(({ key, label }) => (
          <div key={key} className="space-y-3 border-t border-[var(--line)] pt-4">
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <Field
              label="显示标题"
              value={copy.studio[key].title}
              readOnly={readOnly}
              onChange={(title) => updateStudio(key, { title })}
            />
            <Field
              label="一句简介"
              value={copy.studio[key].desc}
              readOnly={readOnly}
              onChange={(desc) => updateStudio(key, { desc })}
            />
          </div>
        ))}
      </Card>

      <Card className="space-y-4">
        <h2 className="font-serif text-xl">章节 02 与摄影入口</h2>
        <Field
          label="最新见解标题"
          value={copy.latestTitle}
          readOnly={readOnly}
          onChange={(latestTitle) => update({ latestTitle })}
        />
        <Field
          label="摄影入口那句"
          value={copy.photoBanner}
          readOnly={readOnly}
          onChange={(photoBanner) => update({ photoBanner })}
        />
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={save} disabled={busy || readOnly}>
          {busy ? "同步中…" : "保存并同步繁体 / 英文"}
        </Button>
        <Button variant="ghost" onClick={restoreZhCN} disabled={busy}>
          恢复简体默认
        </Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </div>
  );
}
