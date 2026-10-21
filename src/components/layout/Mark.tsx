export function Mark({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 36 36" aria-hidden>
      <rect
        x="2.5"
        y="2.5"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="13.5"
        y="13.5"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
