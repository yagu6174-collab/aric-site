"use client";

import type { SiteProfile } from "@/types/site";
import { EditAnchor } from "@/components/edit/EditAnchor";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { Mark } from "@/components/layout/Mark";
import { useI18n } from "@/i18n/provider";

export function Footer({ site, siteTraditional }: { site: SiteProfile; siteTraditional?: SiteProfile }) {
  const { dict, locale } = useI18n();
  const edit = useEditMode();
  const profile = locale === "zh-TW" && siteTraditional ? siteTraditional : site;
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
            <div {...editHit(edit?.selected, "brand", undefined, edit?.onSelect)}>
              <Mark />
              <p className="brand-name">
                {dict.name}
                <span className="brand-en"> {dict.nameEn}</span>
              </p>
            </div>
            <p {...editHit(edit?.selected, "hero-lead", "footer-lead", edit?.onSelect)}>{dict.home.heroSubtitle}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            {items.map((item) => (
              <EditAnchor key={item.href} href={item.href} id="nav">
                {item.label}
              </EditAnchor>
            ))}
          </nav>
          <div {...editHit(edit?.selected, "profile", "footer-facts", edit?.onSelect)}>
            <p>{profile.city}</p>
            <p>
              {edit ? profile.email : <a href={`mailto:${profile.email}`}>{profile.email}</a>}
            </p>
            <p>{profile.wechat}</p>
          </div>
        </div>
        <div {...editHit(edit?.selected, "footer", "disclaimer", edit?.onSelect)}>
          <strong>{dict.footer.label}</strong>
          <p>{dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
