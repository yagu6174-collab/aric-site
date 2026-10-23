"use client";

import Image from "next/image";
import type { AboutContent } from "@/types/site";
import { SkillTags } from "@/components/about/SkillTags";
import { Timeline } from "@/components/about/Timeline";
import { useI18n } from "@/i18n/provider";
import { forLocale } from "@/lib/localize";

export function AboutArchive({
  about,
  aboutTraditional,
}: {
  about: AboutContent;
  aboutTraditional: AboutContent;
}) {
  const { dict, locale } = useI18n();
  const localized = forLocale(locale, about, aboutTraditional);

  return (
    <div className="page">
      <div className="shell">
        <header className="page-head">
          <p className="kicker">{dict.about.title}</p>
          <h1>{dict.about.storyTitle}</h1>
          {localized.story.map((paragraph) => (
            <p className="lede" key={paragraph}>
              {paragraph}
            </p>
          ))}
        </header>
        <div className="about-grid">
          <figure className="portrait">
            <Image
              src="/placeholders/portrait.png"
              alt={dict.about.portraitAlt}
              width={831}
              height={619}
            />
            <figcaption>
              {dict.name}
              <span className="brand-en"> {dict.nameEn}</span>
            </figcaption>
          </figure>
          <div>
            <Timeline title={dict.about.education} items={localized.education} />
            <Timeline title={dict.about.career} items={localized.career} />
            <SkillTags skills={localized.skills} />
          </div>
        </div>
      </div>
    </div>
  );
}
