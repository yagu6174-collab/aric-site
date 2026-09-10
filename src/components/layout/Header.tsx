"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

export function Header() {
  const { dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [clear, setClear] = useState(pathname === "/");

  const items = [
    { href: "/", label: dict.nav.home },
    { href: "/insights", label: dict.nav.insights },
    { href: "/about", label: dict.nav.about },
    { href: "/photography", label: dict.nav.photography },
    { href: "/contact", label: dict.nav.contact },
  ];

  useEffect(() => {
    if (pathname !== "/") {
      setClear(false);
      return;
    }
    const onScroll = () => {
      setClear(window.scrollY < window.innerHeight * 0.78);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={cn(
          "site-header border-b border-[var(--line)]",
          clear && "is-clear",
        )}
      >
        <Container className="relative flex items-center justify-between gap-4 py-3">
          <Link
            href="/"
            className={cn(
              "shrink-0 font-serif text-lg tracking-wide transition",
              clear && "pointer-events-none opacity-0",
            )}
          >
            {dict.name}
            <span className="ml-2 text-xs text-[var(--muted)]">{dict.nameEn}</span>
          </Link>
          {clear ? (
            <p className="home-wordmark">
              {dict.name}
              <span>{dict.nameEn}</span>
            </p>
          ) : null}
          <nav
            className={cn(
              "hidden items-center gap-5 text-sm md:flex",
              clear && "pointer-events-none opacity-0",
            )}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition hover:text-[var(--fg)]",
                  pathname === item.href
                    ? "text-[var(--fg)]"
                    : "text-[var(--muted)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              type="button"
              className="md:hidden"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
        {open ? (
          <div className="border-t border-[var(--line)] md:hidden">
            <Container className="flex flex-col gap-3 py-4 text-sm">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="text-[var(--fg)]"
                >
                  {item.label}
                </Link>
              ))}
            </Container>
          </div>
        ) : null}
      </header>
      {pathname !== "/" ? (
        <div className="site-header-spacer" aria-hidden />
      ) : null}
    </>
  );
}
