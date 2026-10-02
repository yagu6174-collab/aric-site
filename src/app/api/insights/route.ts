import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getInsights, normalizeInsightSlug, saveInsights } from "@/lib/content";
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
  if (!body.title?.trim() || !body.excerpt?.trim()) {
    return NextResponse.json({ error: "标题和摘要都要填" }, { status: 400 });
  }
  const items = await getInsights();
  const slug = normalizeInsightSlug(body.slug?.trim() || slugify(body.title));
  if (!slug) {
    return NextResponse.json({ error: "这个标题没法生成链接" }, { status: 400 });
  }
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
  const merged = [
    next,
    ...items.filter((item) => normalizeInsightSlug(item.slug) !== slug),
  ];
  await saveInsights(merged);
  return NextResponse.json(next);
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  if (!slug?.trim()) {
    return NextResponse.json({ error: "没有要删除的文章" }, { status: 400 });
  }
  const target = normalizeInsightSlug(slug);
  const items = await getInsights();
  const next = items.filter((item) => normalizeInsightSlug(item.slug) !== target);
  if (next.length === items.length) {
    return NextResponse.json({ error: "没有找到这篇文章" }, { status: 404 });
  }
  await saveInsights(next);
  return NextResponse.json({ ok: true });
}
