"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEditMode } from "@/components/edit/mode";

export function EditAnchor({
  href,
  id,
  className,
  children,
}: {
  href: string;
  id: string;
  className?: string;
  children: React.ReactNode;
}) {
  const edit = useEditMode();
  if (!edit) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={href}
      data-edit-id={id}
      className={cn(className, "edit-hit", edit.selected === id && "is-selected")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        edit.onSelect(id);
      }}
    >
      {children}
    </a>
  );
}

export function editHit(selected: string | null | undefined, id: string, className?: string, onSelect?: (id: string) => void) {
  if (!onSelect) return { className };
  return {
    className: cn(className, "edit-hit", selected === id && "is-selected"),
    "data-edit-id": id,
    onClick: (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      onSelect(id);
    },
  };
}
