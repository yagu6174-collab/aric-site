"use client";

import type { AboutContent } from "@/types/site";
import { SkillTags } from "@/components/about/SkillTags";
import { Timeline } from "@/components/about/Timeline";
import { EditAdd } from "@/components/edit/EditAdd";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

export function AboutArchive({
  about,
  aboutTraditional,
  portraitUrl,
}: {
  about: AboutContent;
  aboutTraditional?: AboutContent;
  portraitUrl: string;
}) {
  const { dict, locale } = useI18n();
  const edit = useEditMode();
  const localized = locale === "zh-TW" && aboutTraditional ? aboutTraditional : about;

  return (
    <div className="page">
      <div className="shell">
        <header className="page-head">
          <p {...editHit(edit?.selected, "about-copy", "kicker", edit?.onSelect)}>
            {dict.about.title}
          </p>
          <h1 {...editHit(edit?.selected, "about-copy", undefined, edit?.onSelect)}>{dict.about.storyTitle}</h1>
          {localized.story.map((paragraph, index) => (
            <p
              key={`${index}-${paragraph.slice(0, 16)}`}
              {...editHit(edit?.selected, "about-copy", "lede", edit?.onSelect)}
            >
              {paragraph}
            </p>
          ))}
          <EditAdd kind="story" label="加一段介绍" />
        </header>
        <div className="about-grid">
          <figure {...editHit(edit?.selected, "portrait", "portrait", edit?.onSelect)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={portraitUrl} alt={dict.about.portraitAlt} width={831} height={619} />
            <figcaption {...editHit(edit?.selected, "brand", undefined, edit?.onSelect)}>
              {dict.name}
              <span className="brand-en"> {dict.nameEn}</span>
            </figcaption>
          </figure>
          <div>
            <Timeline
              title={dict.about.education}
              items={localized.education}
              titleId="about-copy"
              itemPrefix="edu"
              addKind="edu"
              addLabel="加一条教育"
            />
            <Timeline
              title={dict.about.career}
              items={localized.career}
              titleId="about-copy"
              itemPrefix="job"
              addKind="job"
              addLabel="加一条履历"
            />
            <SkillTags skills={localized.skills} />
          </div>
        </div>
      </div>
    </div>
  );
}
