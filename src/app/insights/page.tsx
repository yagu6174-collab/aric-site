import type { Metadata } from "next";
import { InsightsBoard } from "@/components/insights/InsightsBoard";
import { loadPublic } from "@/lib/site-io";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await loadPublic();
  return { title: copy.insights.title };
}

export default async function InsightsPage() {
  const model = await loadPublic();
  return <InsightsBoard items={model.insights} traditional={model.traditionalInsights} />;
}
