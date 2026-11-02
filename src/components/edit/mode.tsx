"use client";

import { createContext, useContext } from "react";

export type PreviewPage = "home" | "insights" | "about" | "contact" | "reading";

export type AddKind = "insight" | "edu" | "job" | "skill" | "social" | "paragraph" | "story";

export type EditMode = {
  selected: string | null;
  onSelect: (id: string) => void;
  onAdd?: (kind: AddKind) => void;
  page?: PreviewPage;
};

const EditContext = createContext<EditMode | null>(null);

export function EditModeProvider({ value, children }: { value: EditMode; children: React.ReactNode }) {
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>;
}

export function useEditMode() {
  return useContext(EditContext);
}
