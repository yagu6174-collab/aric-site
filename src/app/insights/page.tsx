import { InsightsBoard } from "@/components/insights/InsightsBoard";
import { getInsights } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const items = await getInsights();

  return (
    <div className="essay-page">
      <InsightsBoard items={items} />
    </div>
  );
}
