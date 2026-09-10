import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { hasBlobToken } from "@/lib/blob";
import { getPhotos, saveLocalUpload, savePhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getPhotos());
}

export async function POST(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  const album = String(form.get("album") || "未命名影集");
  const caption = String(form.get("caption") || "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const url = hasBlobToken()
    ? (await put(`photos/${Date.now()}-${file.name}`, file, { access: "public" })).url
    : await saveLocalUpload(file);

  const photos = await getPhotos();
  const next = {
    id: crypto.randomUUID(),
    url,
    album,
    caption,
  };
  await savePhotos([next, ...photos]);
  return NextResponse.json(next);
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const photos = await getPhotos();
  await savePhotos(photos.filter((item) => item.id !== id));
  return NextResponse.json({ ok: true });
}
