"use client";

import { EditAnchor } from "@/components/edit/EditAnchor";
import { useI18n } from "@/i18n/provider";

export function StudioDirectory() {
  const { dict } = useI18n();
  const items = [
    { href: "/about", id: "studio-about", ...dict.studio.about },
    { href: "/contact", id: "studio-contact", ...dict.studio.contact },
  ];

  return (
    <div className="doors">
      {items.map((item) => (
        <EditAnchor key={item.href} href={item.href} id={item.id} className="door">
          <span className="door-title">{item.title}</span>
          {item.desc ? <span className="door-desc">{item.desc}</span> : null}
          <span className="door-arrow" aria-hidden>
            →
          </span>
        </EditAnchor>
      ))}
    </div>
  );
}
