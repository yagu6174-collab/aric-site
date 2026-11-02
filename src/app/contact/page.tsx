import type { Metadata } from "next";
import { ContactArchive } from "@/components/contact/ContactArchive";
import { loadPublic } from "@/lib/site-io";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { copy } = await loadPublic();
  return { title: copy.contact.title };
}

export default async function ContactPage() {
  const model = await loadPublic();
  return (
    <ContactArchive site={model.profile} siteTraditional={model.traditionalProfile} qrUrl={model.images.qrUrl} />
  );
}
