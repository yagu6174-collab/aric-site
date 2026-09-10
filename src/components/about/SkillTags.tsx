"use client";

import { useI18n } from "@/i18n/provider";

export function SkillTags({ skills }: { skills: string[] }) {
  const { dict } = useI18n();

  return (
    <section className="py-8">
      <h2 className="font-serif text-3xl">{dict.about.skills}</h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[var(--line)] px-3 py-1 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
