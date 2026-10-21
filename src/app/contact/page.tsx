import type { Metadata } from "next";
import { ContactArchive } from "@/components/contact/ContactArchive";
import { getSite } from "@/lib/content";
import { mapStringsDeep, toZhTW } from "@/lib/locale-sync";

export const metadata: Metadata = {
  title: "联系方式",
};

export default function ContactPage() {
  const site = getSite();
  return <ContactArchive site={site} siteTraditional={mapStringsDeep(site, toZhTW)} />;
}
