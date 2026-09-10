import { AdminPhotographyClient } from "@/app/admin/photography/AdminPhotographyClient";
import { getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminPhotographyPage() {
  const photos = await getPhotos();
  return <AdminPhotographyClient initialPhotos={photos} />;
}
