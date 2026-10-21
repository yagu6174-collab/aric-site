"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/provider";

export default function NotFound() {
  const { dict } = useI18n();

  return (
    <div className="page">
      <div className="shell page-head">
        <p className="kicker">404</p>
        <h1>{dict.notFound.title}</h1>
        <Link href="/" className="text-link">
          {dict.nav.home}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
