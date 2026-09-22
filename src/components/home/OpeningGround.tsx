"use client";

import { useEffect, useRef } from "react";

export function OpeningGround() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const line = ref.current;
    const hero = document.querySelector(".essay-hero");
    if (!line || !hero) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;

    const update = () => {
      const header = document.querySelector(".site-header");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 56.8;
      const rect = hero.getBoundingClientRect();
      const traveled = headerBottom - rect.top;
      const progress = Math.min(1, Math.max(0, traveled / Math.max(rect.height, 1)));
      line.style.opacity = reduce ? (progress > 0.02 ? "0" : "1") : String(1 - progress);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return <div ref={ref} className="essay-queue-ground" aria-hidden />;
}
