import { Disclaimer } from "@/components/insights/Disclaimer";
import { InsightsBoard } from "@/components/insights/InsightsBoard";
import { Container } from "@/components/ui/Container";
import { getInsights } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const items = await getInsights();

  return (
    <Container className="py-16">
      <h1 className="font-serif text-4xl sm:text-5xl">理财见解</h1>
      <div className="mt-6">
        <Disclaimer />
      </div>
      <InsightsBoard items={items} />
    </Container>
  );
}
