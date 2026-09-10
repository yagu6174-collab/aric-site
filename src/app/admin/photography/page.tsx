import { AdminPhotographyClient } from "@/app/admin/photography/AdminPhotographyClient";
import { getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminPhotographyPage() {
  const photos = await getPhotos();
  return <AdminPhotographyClient initialPhotos={photos} />;
}
