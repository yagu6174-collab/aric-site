"use client";

import { EditAdd } from "@/components/edit/EditAdd";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

export function SkillTags({ skills }: { skills: { id: string; text: string }[] }) {
  const { dict } = useI18n();
  const edit = useEditMode();
  if (!edit && !skills.length) return null;

  return (
    <section className="block">
      <h2 {...editHit(edit?.selected, "about-copy", undefined, edit?.onSelect)}>{dict.about.skills}</h2>
      <ul className="chips">
        {skills.map((skill, index) => (
          <li key={skill.id} {...editHit(edit?.selected, `skill:${skill.id}`, undefined, edit?.onSelect)}>
            <em>{String(index + 1).padStart(2, "0")}</em>
            <span>{skill.text}</span>
          </li>
        ))}
      </ul>
      <EditAdd kind="skill" label="加一项" />
    </section>
  );
}
