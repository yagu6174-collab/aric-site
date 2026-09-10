"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function HomeCursor() {
  const pathname = usePathname();
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("home-cursor");
    const el = dot.current;
    if (!el) return;

    let x = -40;
    let y = -40;
    let tx = x;
    let ty = y;
    let hovering = false;
    let raf = 0;

    const move = (event: PointerEvent) => {
      tx = event.clientX;
      ty = event.clientY;
    };
    const over = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      hovering = Boolean(target?.closest("a, button"));
    };
    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${hovering ? 2.4 : 1})`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      document.documentElement.classList.remove("home-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  if (pathname !== "/") return null;
  return <div ref={dot} className="home-cursor-dot" aria-hidden />;
}
