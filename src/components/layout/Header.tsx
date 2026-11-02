"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EditAnchor, editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Mark } from "@/components/layout/Mark";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { dict } = useI18n();
  const edit = useEditMode();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/", label: dict.nav.home, page: "home" },
    { href: "/insights", label: dict.nav.insights, page: "insights" },
    { href: "/about", label: dict.nav.about, page: "about" },
    { href: "/contact", label: dict.nav.contact, page: "contact" },
  ];

  useEffect(() => {
    setOpen(false);
  }, [pathname, edit?.page]);

  useEffect(() => {
    if (edit) return;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, edit]);

  function active(href: string, page: string) {
    if (edit?.page) {
      if (page === "insights") return edit.page === "insights" || edit.page === "reading";
      return edit.page === page;
    }
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <>
      <a href="#content" {...editHit(edit?.selected, "nav", "skip", edit?.onSelect)}>
        {dict.nav.skip}
      </a>
      <header className="site-header">
        <div className="shell header-bar">
          <EditAnchor href="/" id="brand" className="brand">
            <Mark />
            <span>
              <span className="brand-name">{dict.name}</span>
              <span className="brand-en">{dict.nameEn}</span>
            </span>
          </EditAnchor>
          <nav className="nav-desktop" aria-label="Primary">
            {items.map((item) => (
              <EditAnchor
                key={item.href}
                href={item.href}
                id="nav"
                className={cn("nav-link", active(item.href, item.page) && "is-active")}
              >
                {item.label}
              </EditAnchor>
            ))}
          </nav>
          <div className="header-tools">
            <LanguageSwitcher />
            <EditAnchor href="/contact" id="studio-contact" className="btn-line header-cta">
              {dict.studio.contact.title}
              <span aria-hidden>→</span>
            </EditAnchor>
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
                <EditAnchor
                  key={item.href}
                  href={item.href}
                  id="nav"
                  className={cn(active(item.href, item.page) && "is-active")}
                >
                  {item.label}
                </EditAnchor>
              ))}
            </div>
          </div>
        ) : null}
      </header>
      <div className="site-header-spacer" aria-hidden />
    </>
  );
}
