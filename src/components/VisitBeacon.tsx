"use client";

import { useEffect } from "react";

export function VisitBeacon() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch("/api/visits", { method: "POST", keepalive: true }).catch(() => {});
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return null;
}
