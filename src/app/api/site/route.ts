import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSite, saveSite } from "@/lib/content";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await getSite());
}

export async function PUT(request: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const saved = await saveSite(await request.json());
  return NextResponse.json(saved);
}
