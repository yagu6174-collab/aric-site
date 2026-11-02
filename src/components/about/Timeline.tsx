"use client";

import type { AboutContent } from "@/types/site";
import { EditAdd } from "@/components/edit/EditAdd";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";

export function Timeline({
  title,
  items,
  titleId,
  itemPrefix,
  addKind,
  addLabel,
}: {
  title: string;
  items: AboutContent["education"];
  titleId: string;
  itemPrefix: "edu" | "job";
  addKind: "edu" | "job";
  addLabel: string;
}) {
  const edit = useEditMode();
  if (!edit && !items.length) return null;

  return (
    <section className="block">
      <h2 {...editHit(edit?.selected, titleId, undefined, edit?.onSelect)}>{title}</h2>
      <ol className="records">
        {items.map((item) => (
          <li key={item.id} {...editHit(edit?.selected, `${itemPrefix}:${item.id}`, undefined, edit?.onSelect)}>
            <small>{item.period}</small>
            <div>
              <strong>{item.title}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
            </div>
          </li>
        ))}
      </ol>
      <EditAdd kind={addKind} label={addLabel} />
    </section>
  );
}
