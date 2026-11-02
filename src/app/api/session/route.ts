import { NextResponse } from "next/server";
import { authConfigured, passwordsMatch, sessionCookie, sessionCookieValue, COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!authConfigured()) return NextResponse.json({ error: "config" }, { status: 503 });
  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!passwordsMatch(password)) return NextResponse.json({ ok: false }, { status: 401 });
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, sessionCookieValue(), sessionCookie);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, "", { ...sessionCookie, maxAge: 0 });
  return response;
}
