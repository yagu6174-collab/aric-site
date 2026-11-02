"use client";

import { useEditMode } from "@/components/edit/mode";

export function EditAdd({ kind, label }: { kind: "insight" | "edu" | "job" | "skill" | "social" | "paragraph" | "story"; label: string }) {
  const edit = useEditMode();
  if (!edit?.onAdd) return null;
  return (
    <button
      type="button"
      className="edit-add"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        edit.onAdd?.(kind);
      }}
    >
      {label}
    </button>
  );
}
