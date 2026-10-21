"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export function StudioDirectory() {
  const { dict } = useI18n();
  const items = [
    { href: "/about", ...dict.studio.about },
    { href: "/contact", ...dict.studio.contact },
  ];

  return (
    <div className="doors">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="door">
          <span className="door-title">{item.title}</span>
          {item.desc ? <span className="door-desc">{item.desc}</span> : null}
          <span className="door-arrow" aria-hidden>
            →
          </span>
        </Link>
      ))}
    </div>
  );
}
