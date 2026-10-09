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
      <ol className="essay-records">
        {items.map((item) => (
          <li key={`${item.period}-${item.title}`}>
            <small>{item.period}</small>
            <strong>{item.title}</strong>
            {item.detail ? <span>{item.detail}</span> : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
