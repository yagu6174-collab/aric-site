"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { SiteProfile } from "@/types/site";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useI18n } from "@/i18n/provider";

export function WeChatCard({ site }: { site: SiteProfile }) {
  const { dict } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(site.wechat);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <Card className="mx-auto max-w-xl text-center">
      <p className="text-xs tracking-[0.24em] uppercase text-[var(--muted)]">
        {dict.contact.wechat}
      </p>
      <p className="mt-3 font-serif text-3xl">{site.wechat}</p>
      <div className="mt-5 flex justify-center">
        <Button onClick={copy} variant="ghost">
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? dict.contact.copied : dict.contact.copy}
        </Button>
      </div>
      <div className="relative mx-auto mt-8 h-48 w-48 overflow-hidden rounded-xl border border-[var(--line)]">
        <Image
          src="/placeholders/wechat-qr.svg"
          alt={dict.contact.qrAlt}
          fill
          className="object-contain p-3"
        />
      </div>
      <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
        {dict.contact.hint}
      </p>
    </Card>
  );
}
