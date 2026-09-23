import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { dictionaries } from "@/i18n/dictionaries";
import { getHomeCopy, saveHomeCopy } from "@/lib/content";
import {
  homeCopyFromDictionary,
  normalizeHomeCopy,
  normalizeHomeCopyBundle,
} from "@/lib/home-copy";
import { syncHomeCopyFromZhCN } from "@/lib/locale-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getHomeCopy());
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const incoming = normalizeHomeCopyBundle(body);
  const zhCN = normalizeHomeCopy(
    incoming["zh-CN"],
    homeCopyFromDictionary(dictionaries["zh-CN"]),
  );
  try {
    const synced = await syncHomeCopyFromZhCN(zhCN);
    const saved = await saveHomeCopy(synced);
    return NextResponse.json(saved);
  } catch (error) {
    console.error("[home-copy-sync]", error);
    return NextResponse.json(
      { error: "简体已读到，但英文同步失败，请稍后重试" },
      { status: 502 },
    );
  }
}
