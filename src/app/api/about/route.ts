import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getAbout, saveAbout } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getAbout());
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await saveAbout(await request.json());
  return NextResponse.json(saved);
}
