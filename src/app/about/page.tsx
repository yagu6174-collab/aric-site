import { AboutArchive } from "@/components/about/AboutArchive";
import { getAbout } from "@/lib/content";

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <div className="essay-page">
      <AboutArchive about={about} />
    </div>
  );
}
