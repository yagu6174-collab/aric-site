"use client";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/session", { method: "DELETE" });
    window.location.href = "/admin";
  }

  return (
    <button type="button" onClick={() => void logout()} className="text-sm font-medium text-stone-600 underline-offset-2 hover:underline">
      退出
    </button>
  );
}
