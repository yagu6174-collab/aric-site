import { PhotographyArchive } from "@/components/photography/PhotographyArchive";
import { getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PhotographyPage() {
  const photos = await getPhotos();
  return <PhotographyArchive photos={photos} />;
}
