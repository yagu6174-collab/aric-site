import type { AboutContent } from "@/types/site";

export function Timeline({
  title,
  items,
}: {
  title: string;
  items: AboutContent["education"];
}) {
  if (!items.length) return null;

  return (
    <section className="block">
      <h2>{title}</h2>
      <ol className="records">
        {items.map((item) => (
          <li key={`${item.period}-${item.title}`}>
            <small>{item.period}</small>
            <div>
              <strong>{item.title}</strong>
              {item.detail ? <p>{item.detail}</p> : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
