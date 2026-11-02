import { HomeView } from "@/components/home/HomeView";
import { loadPublic } from "@/lib/site-io";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const model = await loadPublic();
  return <HomeView insights={model.insights} traditional={model.traditionalInsights} />;
}
