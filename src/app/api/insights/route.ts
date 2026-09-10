import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getInsights, saveInsights } from "@/lib/content";
import type { Insight } from "@/types/insight";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getInsights());
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json()) as Partial<Insight>;
  if (!body.title || !body.excerpt) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const items = await getInsights();
  const slug = body.slug?.trim() || slugify(body.title);
  const next: Insight = {
    slug,
    title: body.title,
    date: body.date || new Date().toISOString().slice(0, 10),
    readingMinutes: Number(body.readingMinutes || 5),
    category: body.category ?? "essay",
    excerpt: body.excerpt,
    quote: body.quote || body.excerpt,
    body: body.body?.length ? body.body : [{ type: "p", text: body.excerpt }],
  };
  const merged = [next, ...items.filter((item) => item.slug !== slug)];
  await saveInsights(merged);
  return NextResponse.json(next);
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  const items = await getInsights();
  await saveInsights(items.filter((item) => item.slug !== slug));
  return NextResponse.json({ ok: true });
}
