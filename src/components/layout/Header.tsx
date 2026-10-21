"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Mark } from "@/components/layout/Mark";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/insights", label: dict.nav.insights },
    { href: "/about", label: dict.nav.about },
    { href: "/contact", label: dict.nav.contact },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function active(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <a className="skip" href="#content">
        {dict.nav.skip}
      </a>
      <header className="site-header">
        <div className="shell header-bar">
          <Link href="/" className="brand">
            <Mark />
            <span>
              <span className="brand-name">{dict.name}</span>
              <span className="brand-en">{dict.nameEn}</span>
            </span>
          </Link>
          <nav className="nav-desktop" aria-label="Primary">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn("nav-link", active(item.href) && "is-active")}
                aria-current={active(item.href) ? "page" : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="header-tools">
            <LanguageSwitcher />
            <Link href="/contact" className="btn-line header-cta">
              {dict.studio.contact.title}
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              className="menu-btn"
              aria-expanded={open}
              aria-label={open ? "Close" : "Menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="nav-panel">
            <div className="shell">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(active(item.href) && "is-active")}
                  aria-current={active(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <div className="site-header-spacer" aria-hidden />
    </>
  );
}
