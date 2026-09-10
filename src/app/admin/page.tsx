"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AuthState = "checking" | "in" | "out";

export default function AdminHomePage() {
  const [auth, setAuth] = useState<AuthState>("checking");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function refreshAuth() {
    const res = await fetch("/api/auth", { cache: "no-store" });
    const data = (await res.json()) as { authed?: boolean };
    setAuth(data.authed ? "in" : "out");
  }

  useEffect(() => {
    void refreshAuth();
  }, []);

  async function login() {
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("密码不正确，请重试。");
      return;
    }
    setPassword("");
    setAuth("in");
  }

  async function logout() {
    setBusy(true);
    await fetch("/api/auth", { method: "DELETE" });
    setBusy(false);
    setAuth("out");
    setError("");
  }

  if (auth === "checking") {
    return <p className="text-sm text-[var(--muted)]">正在确认登录状态…</p>;
  }

  if (auth === "out") {
    return (
      <Card>
        <h1 className="font-serif text-2xl">登录后台</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          使用你在 Vercel 里设置的后台密码。
        </p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void login();
          }}
          className="mt-4 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
          placeholder="后台密码"
          autoComplete="current-password"
        />
        <div className="mt-4">
          <Button onClick={login} className={busy ? "opacity-60" : undefined}>
            {busy ? "登录中…" : "登录"}
          </Button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl">已登录</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            选择下面的入口更新网站内容。
          </p>
        </div>
        <Button variant="ghost" onClick={logout}>
          {busy ? "退出中…" : "退出"}
        </Button>
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/insights">
          <Card className="h-full transition hover:border-[var(--fg)]">
            <p className="font-serif text-xl">编辑理财文章</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              发布或删除见解，保存后前台会更新。
            </p>
          </Card>
        </Link>
        <Link href="/admin/photography">
          <Card className="h-full transition hover:border-[var(--fg)]">
            <p className="font-serif text-xl">上传摄影作品</p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              上传照片、填写影集名和旁白。
            </p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
