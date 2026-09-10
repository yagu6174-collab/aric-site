import { MasonryGrid } from "@/components/photography/MasonryGrid";
import { Container } from "@/components/ui/Container";
import { getPhotos } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function PhotographyPage() {
  const photos = await getPhotos();

  return (
    <Container className="py-16">
      <h1 className="mb-10 font-serif text-4xl sm:text-5xl">摄影自留地</h1>
      <MasonryGrid photos={photos} />
    </Container>
  );
}
