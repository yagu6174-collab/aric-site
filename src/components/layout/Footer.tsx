"use client";

import { usePathname } from "next/navigation";
import { useI18n } from "@/i18n/provider";

export function Footer() {
  const { dict } = useI18n();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-[var(--line)]">
      <div className="essay-disclaimer">
        <p>{dict.footer.label}</p>
        <p>{dict.footer.rights}</p>
      </div>
    </footer>
  );
}
