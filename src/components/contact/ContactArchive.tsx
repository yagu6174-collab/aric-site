"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { SiteProfile } from "@/types/site";
import { useI18n } from "@/i18n/provider";

export function ContactArchive({ site }: { site: SiteProfile }) {
  const { dict } = useI18n();
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(site.wechat);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="essay-chapter">
      <div className="essay-prose">
        <h1>{dict.contact.title}</h1>
        <p className="essay-kicker">{dict.contact.wechat}</p>
        <p className="essay-wechat">{site.wechat}</p>
        <button type="button" className="essay-text-btn" onClick={copy}>
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? dict.contact.copied : dict.contact.copy}
        </button>
        <div className="essay-qr">
          <Image
            src="/placeholders/wechat-qr.jpg"
            alt={dict.contact.qrAlt}
            width={800}
            height={1000}
          />
        </div>
        <p className="essay-note">{dict.contact.hint}</p>
        <dl className="essay-facts">
          <div>
            <dt>{dict.contact.email}</dt>
            <dd>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </dd>
          </div>
          <div>
            <dt>{dict.contact.city}</dt>
            <dd>{site.city}</dd>
          </div>
          {site.socials.map((item) => (
            <div key={item.href}>
              <dt>{item.label}</dt>
              <dd>
                <a href={item.href} target="_blank" rel="noreferrer">
                  {item.href}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
