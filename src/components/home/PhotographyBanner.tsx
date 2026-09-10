"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export function PhotographyBanner() {
  const { dict } = useI18n();

  return (
    <Link
      href="/photography"
      className="my-8 block overflow-hidden rounded-2xl border border-[var(--line)]"
    >
      <div className="relative min-h-28 bg-[linear-gradient(120deg,rgba(80,70,60,0.35),transparent),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_40%),#2a2724] px-6 py-8">
        <p className="font-serif text-xl text-[#f4f1ea] sm:text-2xl">
          {dict.home.photoBanner}
        </p>
      </div>
    </Link>
  );
}
