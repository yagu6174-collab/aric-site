import type { AboutContent } from "@/types/site";

export function Timeline({
  title,
  items,
}: {
  title: string;
  items: AboutContent["education"];
}) {
  return (
    <section className="essay-timeline">
      <h2>{title}</h2>
      <ol className="essay-article-list">
        {items.map((item) => (
          <li key={`${item.period}-${item.title}`}>
            <small>{item.period}</small>
            <strong>{item.title}</strong>
            <span>{item.detail}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
