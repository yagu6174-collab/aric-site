import type { ArticleBlock } from "@/types/insight";

function isSubhead(text: string) {
  const trimmed = text.trim();
  return trimmed.length <= 40 && /^\d+\.\s*\S/.test(trimmed);
}

export function ArticleBody({ body }: { body: ArticleBlock[] }) {
  return (
    <div className="reading-body">
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
            <div key={index} className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {block.headers.map((header) => (
                      <th key={header} scope="col">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <td key={`${rowIndex}-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return (
          <p key={index} className={isSubhead(block.text) ? "is-subhead" : undefined}>
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
