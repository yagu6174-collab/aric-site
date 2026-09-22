import { notFound } from "next/navigation";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { getInsight } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getInsight(slug);
  if (!item) notFound();

  return (
    <div className="essay-page">
      <InsightArticle item={item} />
    </div>
  );
}
