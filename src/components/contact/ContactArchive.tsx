"use client";

import { Check, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { SiteProfile } from "@/types/site";
import { useI18n } from "@/i18n/provider";
import { forLocale } from "@/lib/localize";

export function ContactArchive({
  site: profile,
  siteTraditional,
}: {
  site: SiteProfile;
  siteTraditional: SiteProfile;
}) {
  const { dict, locale } = useI18n();
  const site = forLocale(locale, profile, siteTraditional);
  const [copied, setCopied] = useState(false);

  async function copy() {
    const value = site.wechat;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      field.remove();
      setCopied(ok);
    }
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="page">
      <div className="shell contact-grid">
        <header className="page-head">
          <p className="kicker">{dict.nameEn}</p>
          <h1>{dict.contact.title}</h1>
          <p className="lede">{dict.contact.hint}</p>
        </header>
        <div className="contact-panel">
          <p className="contact-label">{dict.contact.wechat}</p>
          <p className="wechat-id">{site.wechat}</p>
          <button type="button" className="btn-line" onClick={copy}>
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? dict.contact.copied : dict.contact.copy}
          </button>
          <figure className="qr">
            <Image
              src="/placeholders/wechat-qr.jpg"
              alt={dict.contact.qrAlt}
              width={800}
              height={1000}
            />
          </figure>
          <dl className="facts">
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
                <dt>{item.label || dict.contact.social}</dt>
                <dd>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    {item.label || item.href}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
