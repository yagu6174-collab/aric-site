import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { getInsightCopy, getInsightCopies } from "@/lib/content";

export function generateStaticParams() {
  return getInsightCopies().map((item) => ({ slug: item.simplified.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getInsightCopy(slug);
  return { title: item?.simplified.title ?? "见解" };
}

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getInsightCopy(slug);
  if (!item) notFound();
  return <InsightArticle item={item} />;
}
