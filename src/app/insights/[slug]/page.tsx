import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { normalizeInsightSlug } from "@/lib/content";
import { loadPublic } from "@/lib/site-io";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const model = await loadPublic();
  const item = model.insights.find((entry) => normalizeInsightSlug(entry.slug) === normalizeInsightSlug(slug));
  return { title: item?.title ?? "见解" };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const model = await loadPublic();
  const item = model.insights.find((entry) => normalizeInsightSlug(entry.slug) === normalizeInsightSlug(slug));
  if (!item) notFound();
  const traditional = model.traditionalInsights.find((entry) => entry.id === item.id);
  return <InsightArticle item={item} traditional={traditional} />;
}
