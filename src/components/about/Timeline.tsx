import type { AboutContent } from "@/types/site";

export function Timeline({
  title,
  items,
}: {
  title: string;
  items: AboutContent["education"];
}) {
  return (
    <section className="py-8">
      <h2 className="font-serif text-3xl">{title}</h2>
      <ol className="mt-6 space-y-6 border-l border-[var(--line)] pl-6">
        {items.map((item) => (
          <li key={`${item.period}-${item.title}`}>
            <p className="text-xs tracking-wide text-[var(--muted)]">
              {item.period}
            </p>
            <h3 className="mt-1 font-serif text-xl">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {item.detail}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
