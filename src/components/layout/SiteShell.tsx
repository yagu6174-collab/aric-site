"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { VisitBeacon } from "@/components/VisitBeacon";
import type { SiteProfile } from "@/types/site";

export function SiteShell({
  profile,
  profileTraditional,
  children,
}: {
  profile: SiteProfile;
  profileTraditional: SiteProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return children;
  return (
    <>
      <Header />
      <main id="content" className="site-main">
        {children}
      </main>
      <Footer site={profile} siteTraditional={profileTraditional} />
      {pathname === "/" ? <VisitBeacon /> : null}
    </>
  );
}
