"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AdminHomePage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function login() {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setStatus(res.ok ? "已登录" : "密码不正确或未配置 ADMIN_PASSWORD");
  }

  async function logout() {
    await fetch("/api/auth", { method: "DELETE" });
    setStatus("已退出");
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="font-serif text-2xl">登录</h1>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-4 w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2"
          placeholder="ADMIN_PASSWORD"
        />
        <div className="mt-4 flex gap-3">
          <Button onClick={login}>登录</Button>
          <Button variant="ghost" onClick={logout}>
            退出
          </Button>
        </div>
        {status ? <p className="mt-3 text-sm text-[var(--muted)]">{status}</p> : null}
      </Card>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/insights">
          <Card>编辑理财文章 →</Card>
        </Link>
        <Link href="/admin/photography">
          <Card>上传摄影作品 →</Card>
        </Link>
      </div>
    </div>
  );
}
