"use client";

import { useI18n } from "@/i18n/provider";

export function SkillTags({ skills }: { skills: string[] }) {
  const { dict } = useI18n();

  return (
    <section className="essay-timeline">
      <h2>{dict.about.skills}</h2>
      <ul className="essay-skills">
        {skills.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>
    </section>
  );
}
