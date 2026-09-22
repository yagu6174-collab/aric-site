import { ContactArchive } from "@/components/contact/ContactArchive";
import { getSite } from "@/lib/content";

export default async function ContactPage() {
  const site = await getSite();

  return (
    <div className="essay-page">
      <ContactArchive site={site} />
    </div>
  );
}
