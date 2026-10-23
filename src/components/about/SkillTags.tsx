"use client";

import { useI18n } from "@/i18n/provider";

export function SkillTags({ skills }: { skills: string[] }) {
  const { dict } = useI18n();
  if (!skills.length) return null;

  return (
    <section className="block">
      <h2>{dict.about.skills}</h2>
      <ul className="chips">
        {skills.map((skill, index) => (
          <li key={skill}>
            <em>{String(index + 1).padStart(2, "0")}</em>
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
