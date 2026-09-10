import type { ArticleBlock } from "@/types/insight";

export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="mt-10 space-y-6 text-[17px] leading-8">
      {body.map((block, index) => {
        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-l-2 border-[var(--fg)] pl-5 font-serif text-2xl leading-snug"
            >
              {block.text}
              {block.cite ? (
                <cite className="mt-3 block text-sm not-italic text-[var(--muted)]">
                  — {block.cite}
                </cite>
              ) : null}
            </blockquote>
          );
        }
        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto">
              <table className="w-full min-w-md border-collapse text-sm">
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th
                        key={header}
                        className="border-b border-[var(--line)] px-3 py-2 text-left font-medium"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell) => (
                        <td
                          key={cell}
                          className="border-b border-[var(--line)] px-3 py-2 text-[var(--muted)]"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}
