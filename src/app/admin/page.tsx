import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { SiteEditor } from "@/components/admin/SiteEditor";
import { isAuthed } from "@/lib/auth";
import { readSiteDraft } from "@/lib/site-io";
import { readVisitStats } from "@/lib/visits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "后台" },
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAuthed())) return <LoginForm />;
  const [draft, visits] = await Promise.all([readSiteDraft(), readVisitStats()]);
  return <SiteEditor initial={draft} visits={visits} />;
}
