import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--line)] bg-[var(--card)] p-6",
        className,
      )}
    >
      {children}
    </div>
  );
}
