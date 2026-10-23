import type { Metadata } from "next";
import { InsightsBoard } from "@/components/insights/InsightsBoard";
import { getInsightCopies } from "@/lib/content";

export const metadata: Metadata = {
  title: "理财见解",
};

export default function InsightsPage() {
  return <InsightsBoard items={getInsightCopies()} />;
}
