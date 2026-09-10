import { NextResponse } from "next/server";
import { sessionCookieOptions, signSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return NextResponse.json({ error: "ADMIN_PASSWORD missing" }, { status: 500 });
  }
  if (body.password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const cookie = sessionCookieOptions();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, signSession(), cookie);
  return res;
}

export async function DELETE() {
  const cookie = sessionCookieOptions();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, "", { ...cookie, maxAge: 0 });
  return res;
}
