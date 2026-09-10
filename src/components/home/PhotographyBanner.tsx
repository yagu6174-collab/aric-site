"use client";

import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { useI18n } from "@/i18n/provider";

export function PhotographyBanner() {
  const { dict } = useI18n();

  return (
    <Reveal className="overflow-hidden">
      <Link href="/photography" className="group my-8 block overflow-hidden">
        <div className="relative min-h-56 overflow-hidden sm:min-h-72">
          <div className="absolute inset-0 origin-center scale-110 bg-[linear-gradient(120deg,rgba(80,70,60,0.4),transparent),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_40%),#2a2724] transition-transform duration-[1200ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-100" />
          <p className="relative z-10 px-2 py-16 font-serif text-2xl text-[#f4f1ea] sm:text-4xl">
            {dict.home.photoBanner}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
