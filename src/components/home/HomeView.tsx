"use client";

import { Hero } from "@/components/home/Hero";
import { LatestInsights } from "@/components/home/LatestInsights";
import { PhilosophyBento } from "@/components/home/PhilosophyBento";
import { StudioDirectory } from "@/components/home/StudioDirectory";
import type { InsightDraft } from "@/lib/draft";

export function HomeView({
  insights,
  traditional,
}: {
  insights: InsightDraft[];
  traditional?: InsightDraft[];
}) {
  return (
    <>
      <Hero />
      <PhilosophyBento />
      <section className="band">
        <div className="shell band-grid">
          <LatestInsights items={insights} traditional={traditional} />
          <StudioDirectory />
        </div>
      </section>
    </>
  );
}
