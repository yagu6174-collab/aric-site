import { Hero } from "@/components/home/Hero";
import { LatestInsights } from "@/components/home/LatestInsights";
import { PhilosophyBento } from "@/components/home/PhilosophyBento";
import { PhotographyBanner } from "@/components/home/PhotographyBanner";
import { StudioDirectory } from "@/components/home/StudioDirectory";
import { Container } from "@/components/ui/Container";
import { getInsights } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const insights = await getInsights();

  return (
    <>
      <Hero />
      <div className="home-rest">
        <Container>
          <StudioDirectory />
          <PhilosophyBento />
          <LatestInsights items={insights} />
          <PhotographyBanner />
        </Container>
      </div>
    </>
  );
}
