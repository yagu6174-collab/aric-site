"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function PhotographyBanner() {
  const { dict } = useI18n();

  return (
    <Reveal className="overflow-hidden">
      <Link href="/photography" className="essay-photo-link">
        {dict.home.photoBanner}
      </Link>
    </Reveal>
  );
}
