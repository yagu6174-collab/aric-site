"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import type { SiteProfile } from "@/types/site";
import { EditAdd } from "@/components/edit/EditAdd";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

export function ContactArchive({
  site: profile,
  siteTraditional,
  qrUrl,
}: {
  site: SiteProfile;
  siteTraditional?: SiteProfile;
  qrUrl: string;
}) {
  const { dict, locale } = useI18n();
  const edit = useEditMode();
  const site = locale === "zh-TW" && siteTraditional ? siteTraditional : profile;
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
          <p {...editHit(edit?.selected, "brand", "kicker", edit?.onSelect)}>
            {dict.nameEn}
          </p>
          <h1 {...editHit(edit?.selected, "contact-copy", undefined, edit?.onSelect)}>{dict.contact.title}</h1>
          <p {...editHit(edit?.selected, "contact-copy", "lede", edit?.onSelect)}>
            {dict.contact.hint}
          </p>
        </header>
        <div className="contact-panel">
          <p {...editHit(edit?.selected, "contact-copy", "contact-label", edit?.onSelect)}>
            {dict.contact.wechat}
          </p>
          <p {...editHit(edit?.selected, "profile", "wechat-id", edit?.onSelect)}>
            {site.wechat}
          </p>
          <button
            type="button"
            className="btn-line"
            onClick={(event) => {
              if (edit) {
                event.preventDefault();
                edit.onSelect("contact-copy");
                return;
              }
              void copy();
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? dict.contact.copied : dict.contact.copy}
          </button>
          <figure {...editHit(edit?.selected, "qr", "qr", edit?.onSelect)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt={dict.contact.qrAlt} width={800} height={1000} />
          </figure>
          <dl className="facts">
            <div {...editHit(edit?.selected, "profile", undefined, edit?.onSelect)}>
              <dt>{dict.contact.email}</dt>
              <dd>
                {edit ? site.email : <a href={`mailto:${site.email}`}>{site.email}</a>}
              </dd>
            </div>
            <div {...editHit(edit?.selected, "profile", undefined, edit?.onSelect)}>
              <dt>{dict.contact.city}</dt>
              <dd>{site.city}</dd>
            </div>
            {site.socials.map((item) => (
              <div key={item.id} {...editHit(edit?.selected, `social:${item.id}`, undefined, edit?.onSelect)}>
                <dt>{item.label || dict.contact.social}</dt>
                <dd>
                  {edit ? (
                    item.label || item.href
                  ) : (
                    <a href={item.href} target="_blank" rel="noreferrer">
                      {item.label || item.href}
                    </a>
                  )}
                </dd>
              </div>
            ))}
          </dl>
          <EditAdd kind="social" label="加一个链接" />
        </div>
      </div>
    </div>
  );
}
