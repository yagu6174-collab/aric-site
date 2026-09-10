"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/provider";

export function Hero() {
  const { dict } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setReduce(motionMq.matches);
    const wait = motionMq.matches || coarse ? 0 : 1100;
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(
          Math.max(-el.getBoundingClientRect().top, 0),
          Math.max(total, 0),
        );
        const next = total > 0 ? scrolled / total : 0;
        setProgress((current) =>
          Math.abs(current - next) > 0.003 ? next : current,
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = window.setTimeout(() => setReady(true), wait);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  const overlay = reduce ? 0 : Math.min(Math.max((progress - 0.08) / 0.72, 0), 1);
  const scale = reduce ? 1 : 1 + progress * 0.08;
  const showCopy = reduce || hovered || ready;

  return (
    <section ref={ref} className="home-pin">
      <div
        className="home-landing"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div className="home-still-wrap" style={{ scale }}>
          <div className="home-still" />
          <div className="home-grain" />
        </motion.div>
        <div className="home-overlay" style={{ opacity: overlay }} />
        <h1 className="sr-only">{dict.home.heroTitle}</h1>
        <div
          className={`home-secret${showCopy ? " is-on" : ""}`}
          style={{ opacity: showCopy ? 1 - overlay : 0 }}
        >
          {dict.home.heroLines.map((line, index) => (
            <span
              key={line}
              className={index === dict.home.heroLines.length - 1 ? "is-last" : undefined}
            >
              {line}
            </span>
          ))}
          <em>{dict.home.heroSubtitle}</em>
          <div className="home-secret-actions">
            <Button href="/insights">{dict.home.ctaInsights}</Button>
            <Button href="/about" variant="ghost">
              {dict.home.ctaAbout}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
