import { Hero } from "@/components/home/Hero";
import { LatestInsights } from "@/components/home/LatestInsights";
import { PhilosophyBento } from "@/components/home/PhilosophyBento";
import { PhotographyBanner } from "@/components/home/PhotographyBanner";
import { QueueStrip } from "@/components/home/QueueStrip";
import { StudioDirectory } from "@/components/home/StudioDirectory";
import { getInsights } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const insights = await getInsights();

  return (
    <div className="essay-page">
      <Hero />
      <div className="essay-body">
        <QueueStrip />
        <PhilosophyBento />
        <StudioDirectory />
        <LatestInsights items={insights} />
        <PhotographyBanner />
      </div>
    </div>
  );
}
