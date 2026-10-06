"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SiteProfile } from "@/types/site";

const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2";

export default function AdminContactPage() {
  const router = useRouter();
  const [site, setSite] = useState<SiteProfile | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const auth = await fetch("/api/auth", { cache: "no-store" });
      const session = (await auth.json()) as { authed?: boolean };
      if (!session.authed) {
        router.replace("/admin");
        return;
      }
      const res = await fetch("/api/site", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/admin");
        return;
      }
      const data = (await res.json()) as SiteProfile;
      setSite({ ...data, socials: data.socials.length ? data.socials : [] });
    })();
  }, [router]);

  async function save() {
    if (!site) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(site),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("保存失败，请先在后台首页登录");
      return;
    }
    setSite(await res.json());
    router.refresh();
    setMessage("已保存。前台联系方式会马上更新。");
  }

  if (!site) {
    return <p className="text-sm text-[var(--muted)]">正在载入联系方式…</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl">联系方式</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            改微信号、邮箱、城市，以及其他链接。保存后前台会更新。
          </p>
        </div>
        <label className="block space-y-1.5">
          <span className="text-xs tracking-wide text-[var(--muted)]">微信号</span>
          <input
            value={site.wechat}
            onChange={(event) => setSite({ ...site, wechat: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs tracking-wide text-[var(--muted)]">工作邮箱</span>
          <input
            value={site.email}
            onChange={(event) => setSite({ ...site, email: event.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs tracking-wide text-[var(--muted)]">所在城市</span>
          <input
            value={site.city}
            onChange={(event) => setSite({ ...site, city: event.target.value })}
            className={fieldClass}
          />
        </label>
      </Card>

      <Card className="space-y-4">
        <p className="font-serif text-xl">其他链接</p>
        {site.socials.map((item, index) => (
          <div key={index} className="space-y-2 border-t border-[var(--line)] pt-4">
            <input
              value={item.label}
              placeholder="名称"
              onChange={(event) =>
                setSite({
                  ...site,
                  socials: site.socials.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, label: event.target.value } : row,
                  ),
                })
              }
              className={fieldClass}
            />
            <input
              value={item.href}
              placeholder="https://"
              onChange={(event) =>
                setSite({
                  ...site,
                  socials: site.socials.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, href: event.target.value } : row,
                  ),
                })
              }
              className={fieldClass}
            />
            <Button
              variant="ghost"
              onClick={() =>
                setSite({
                  ...site,
                  socials: site.socials.filter((_, rowIndex) => rowIndex !== index),
                })
              }
            >
              去掉这条
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          onClick={() =>
            setSite({ ...site, socials: [...site.socials, { label: "", href: "" }] })
          }
        >
          加一条链接
        </Button>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={save} className={busy ? "opacity-60" : undefined}>
          {busy ? "保存中…" : "保存"}
        </Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </div>
  );
}
