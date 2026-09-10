"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

export function Hero() {
  const { dict } = useI18n();

  return (
    <section className="pt-16 pb-10 sm:pt-24">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 text-xs tracking-[0.28em] uppercase text-[var(--muted)]"
      >
        {dict.name} · {dict.nameEn}
      </motion.p>
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="max-w-3xl font-serif text-4xl leading-tight text-[var(--fg)] sm:text-6xl"
      >
        {dict.home.heroTitle}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.12 }}
        className="mt-5 max-w-xl text-[var(--muted)]"
      >
        {dict.home.heroSubtitle}
      </motion.p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/insights">{dict.home.ctaInsights}</Button>
        <Button href="/about" variant="ghost">
          {dict.home.ctaAbout}
        </Button>
      </div>
    </section>
  );
}
