import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { hasBlobToken } from "@/lib/blob";
import { getPhotos, saveLocalUpload, savePhotoRecord, deletePhotos } from "@/lib/content";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const MAX_BYTES = 4.5 * 1024 * 1024;

function asFile(value: FormDataEntryValue | null) {
  if (!value || typeof value === "string") return null;
  if (!("arrayBuffer" in value)) return null;
  return value as File;
}

function safeName(file: File) {
  const raw = file.name || "photo.jpg";
  const cleaned = raw.replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-");
  return cleaned || "photo.jpg";
}

export async function GET() {
  const photos = await getPhotos();
  return NextResponse.json(photos, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    if (!(await isAuthed())) {
      return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
    }

    const form = await request.formData();
    const file = asFile(form.get("file"));
    const album = String(form.get("album") || "未命名影集").trim() || "未命名影集";
    const caption = String(form.get("caption") || "").trim();

    if (!file) {
      return NextResponse.json({ error: "请先选择照片" }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "照片超过 4MB，请压缩后再上传" },
        { status: 413 },
      );
    }

    const pathname = `photos/${Date.now()}-${safeName(file)}`;
    const url = hasBlobToken()
      ? (await put(pathname, file, { access: "public", addRandomSuffix: true })).url
      : await saveLocalUpload(file);

    const next = {
      id: crypto.randomUUID(),
      url,
      album,
      caption,
    };
    await savePhotoRecord(next);
    return NextResponse.json(next);
  } catch (error) {
    const message = error instanceof Error ? error.message : "上传失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "请先登录后台" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    let ids: string[] = [];
    let album = "";
    const queryId = searchParams.get("id");
    if (queryId) ids = [queryId.trim()];
    else {
      try {
        const body = (await request.json()) as {
          id?: string;
          ids?: string[];
          album?: string;
        };
        if (Array.isArray(body.ids)) {
          ids = body.ids.map((id) => String(id).trim()).filter(Boolean);
        } else if (body.id) {
          ids = [String(body.id).trim()].filter(Boolean);
        }
        album = String(body.album || "").trim();
      } catch {
        ids = [];
      }
    }
    if (album) {
      const photos = await getPhotos();
      const key = album;
      ids = photos
        .filter((photo) => (photo.album.trim() || "未命名影集") === key)
        .map((photo) => photo.id);
    }
    if (!ids.length) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await deletePhotos(ids);
    return NextResponse.json(
      { ok: true, deleted: ids.length },
      { headers: { "Cache-Control": "no-store, max-age=0" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "删除失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
