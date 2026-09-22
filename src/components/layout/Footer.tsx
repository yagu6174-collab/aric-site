"use client";

import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { useI18n } from "@/i18n/provider";

export function Footer() {
  const { dict } = useI18n();
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="mt-24 border-t border-[var(--line)]">
      <Container className="py-10 text-center text-sm text-[var(--muted)]">
        <p>{dict.footer.rights}</p>
      </Container>
    </footer>
  );
}
