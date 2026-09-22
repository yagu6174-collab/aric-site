import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getHomeCopy, saveHomeCopy } from "@/lib/content";
import { normalizeHomeCopyBundle } from "@/lib/home-copy";

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
  const saved = await saveHomeCopy(normalizeHomeCopyBundle(body));
  return NextResponse.json(saved);
}
