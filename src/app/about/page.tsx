import type { Metadata } from "next";
import { AboutArchive } from "@/components/about/AboutArchive";
import { loadPublic } from "@/lib/site-io";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await loadPublic();
  return { title: copy.about.title };
}

export default async function AboutPage() {
  const model = await loadPublic();
  return (
    <AboutArchive
      about={model.about}
      aboutTraditional={model.traditionalAbout}
      portraitUrl={model.images.portraitUrl}
    />
  );
}
