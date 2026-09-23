"use client";

import type { AboutContent } from "@/types/site";
import { SkillTags } from "@/components/about/SkillTags";
import { StorySplit } from "@/components/about/StorySplit";
import { Timeline } from "@/components/about/Timeline";
import { useI18n } from "@/i18n/provider";
import { localizeAbout } from "@/lib/localize";

export function AboutArchive({ about }: { about: AboutContent }) {
  const { dict, locale } = useI18n();
  const localized = localizeAbout(about, locale);

  return (
    <section className="essay-chapter">
      <div className="essay-prose">
        <h1>{dict.about.title}</h1>
        <StorySplit story={localized.story} />
        <Timeline title={dict.about.education} items={localized.education} />
        <Timeline title={dict.about.career} items={localized.career} />
        <SkillTags skills={localized.skills} />
      </div>
    </section>
  );
}
