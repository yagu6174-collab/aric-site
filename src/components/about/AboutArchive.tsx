"use client";

import type { AboutContent } from "@/types/site";
import { SkillTags } from "@/components/about/SkillTags";
import { StorySplit } from "@/components/about/StorySplit";
import { Timeline } from "@/components/about/Timeline";
import { useI18n } from "@/i18n/provider";

export function AboutArchive({ about }: { about: AboutContent }) {
  const { dict } = useI18n();

  return (
    <section className="essay-chapter">
      <div className="essay-prose">
        <h1>{dict.about.title}</h1>
        <StorySplit story={about.story} />
        <Timeline title={dict.about.education} items={about.education} />
        <Timeline title={dict.about.career} items={about.career} />
        <SkillTags skills={about.skills} />
      </div>
    </section>
  );
}
