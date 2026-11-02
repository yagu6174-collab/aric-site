"use client";

import { EditAdd } from "@/components/edit/EditAdd";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

export function PhilosophyBento() {
  const { dict } = useI18n();
  const edit = useEditMode();
  const paragraphs = dict.philosophies.flatMap((item) =>
    [item.title, ...item.body.split(/\n+/)].map((line) => line.trim()).filter(Boolean),
  );

  return (
    <section className="chapter" id="chapter">
      <div className="shell chapter-grid">
        <div className="chapter-heading">
          <p className="chapter-num" aria-hidden>
            01
          </p>
          <h2 {...editHit(edit?.selected, "philosophy", undefined, edit?.onSelect)}>{dict.home.philosophyTitle}</h2>
        </div>
        <div className="prose">
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 12)}`} {...editHit(edit?.selected, "philosophy", undefined, edit?.onSelect)}>
              {paragraph}
            </p>
          ))}
          <EditAdd kind="paragraph" label="加一段" />
        </div>
      </div>
    </section>
  );
}
