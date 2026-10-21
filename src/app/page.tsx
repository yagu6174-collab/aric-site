import { Hero } from "@/components/home/Hero";
import { LatestInsights } from "@/components/home/LatestInsights";
import { PhilosophyBento } from "@/components/home/PhilosophyBento";
import { QueueStrip } from "@/components/home/QueueStrip";
import { StudioDirectory } from "@/components/home/StudioDirectory";
import { getInsightCopies } from "@/lib/content";

export default function HomePage() {
  const insights = getInsightCopies();

  return (
    <>
      <Hero />
      <QueueStrip />
      <PhilosophyBento />
      <section className="band">
        <div className="shell band-grid">
          <LatestInsights items={insights} />
          <StudioDirectory />
        </div>
      </section>
    </>
  );
}
