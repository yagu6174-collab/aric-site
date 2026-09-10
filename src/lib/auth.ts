import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "aric_admin";

function secret() {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function signSession() {
  const key = secret();
  if (!key) return "";
  return createHmac("sha256", key).update("aric-admin").digest("hex");
}

export function verifySession(token?: string | null) {
  const expected = signSession();
  if (!expected || !token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAuthed() {
  const jar = await cookies();
  return verifySession(jar.get(COOKIE)?.value);
}

export function sessionCookieOptions() {
  return {
    name: COOKIE,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  };
}
