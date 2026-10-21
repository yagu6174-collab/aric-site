import type { Metadata } from "next";
import { AboutArchive } from "@/components/about/AboutArchive";
import { getAbout } from "@/lib/content";
import { mapStringsDeep, toZhTW } from "@/lib/locale-sync";

export const metadata: Metadata = {
  title: "个人介绍",
};

export default function AboutPage() {
  const about = getAbout();
  return <AboutArchive about={about} aboutTraditional={mapStringsDeep(about, toZhTW)} />;
}
