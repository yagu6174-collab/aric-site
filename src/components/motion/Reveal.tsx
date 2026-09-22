"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div className={cn("essay-reveal", className)}>
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.45,
          delay,
          ease: [0.19, 1, 0.22, 1],
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
