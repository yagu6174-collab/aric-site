"use client";

import Link from "next/link";
import type { SiteProfile } from "@/types/site";
import { Mark } from "@/components/layout/Mark";
import { useI18n } from "@/i18n/provider";
import { forLocale } from "@/lib/localize";

export function Footer({
  site,
  siteTraditional,
}: {
  site: SiteProfile;
  siteTraditional: SiteProfile;
}) {
  const { dict, locale } = useI18n();
  const profile = forLocale(locale, site, siteTraditional);
  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/insights", label: dict.nav.insights },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="footer-brand">
            <Mark />
            <p className="brand-name">
              {dict.name}
              <span className="brand-en"> {dict.nameEn}</span>
            </p>
            <p className="footer-lead">{dict.home.heroSubtitle}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {items.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="footer-facts">
            <p>{profile.city}</p>
            <p>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>{profile.wechat}</p>
          </div>
        </div>
        <div className="disclaimer">
          <strong>{dict.footer.label}</strong>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
