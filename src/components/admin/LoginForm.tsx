"use client";

import { FormEvent, useState } from "react";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [failed, setFailed] = useState(false);
  const [unconfigured, setUnconfigured] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFailed(false);
    setUnconfigured(false);
    const res = await fetch("/api/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.status === 503) {
      setUnconfigured(true);
      return;
    }
    if (!res.ok) {
      setFailed(true);
      return;
    }
    setPassword("");
    window.location.href = "/admin";
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center bg-[#f6f3ec] px-5 text-[#2a241e]">
      <div className="border border-[rgba(42,36,30,0.16)] bg-[#fffdf8] px-6 py-10">
        <h1 className="text-2xl font-medium">后台</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5e574e]">改公开页上的字。简体为主，繁体跟着转。</p>
        <label className="mt-8 block text-sm" htmlFor="password">
          密码
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1 w-full border border-[rgba(42,36,30,0.16)] bg-white px-3 py-2 text-base"
          />
        </label>
        <button type="submit" className="mt-6 border border-[#2a241e] px-3 py-1 text-sm">
          进入
        </button>
        {failed ? <p className="mt-4 text-sm">密码不对。</p> : null}
        {unconfigured ? <p className="mt-4 text-sm">服务器还没设 EDITOR_PASSWORD 和 SESSION_SECRET。</p> : null}
      </div>
    </form>
  );
}
