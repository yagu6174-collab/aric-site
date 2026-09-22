import type { ArticleBlock } from "@/types/insight";

export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="essay-article-body">
      {body.map((block, index) => {
        if (block.type === "quote") {
          return (
            <blockquote key={index}>
              {block.text}
              {block.cite ? <cite>— {block.cite}</cite> : null}
            </blockquote>
          );
        }
        if (block.type === "table") {
          return (
            <div key={index} className="essay-table">
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell) => (
                        <td key={cell}>{cell}</td>
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
