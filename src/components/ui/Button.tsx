import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary:
    "bg-[var(--accent)] text-[var(--accent-fg)] hover:opacity-90",
  ghost:
    "border border-[var(--line)] bg-transparent text-[var(--fg)] hover:bg-[color-mix(in_srgb,var(--fg)_6%,transparent)]",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  type = "button",
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: keyof typeof styles;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}) {
  const cls = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm tracking-wide transition",
    styles[variant],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}
