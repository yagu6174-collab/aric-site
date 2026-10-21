"use client";

import { useI18n } from "@/i18n/provider";

function lines(title: string, body: string) {
  return [title, ...body.split(/\n+/)].map((item) => item.trim()).filter(Boolean);
}

export function PhilosophyBento() {
  const { dict } = useI18n();

  return (
    <section className="chapter" id="chapter">
      <div className="shell chapter-grid">
        <div className="chapter-heading">
          <p className="chapter-num" aria-hidden>
            01
          </p>
          <h2>{dict.home.philosophyTitle}</h2>
        </div>
        <div className="prose">
          {dict.philosophies.flatMap((item) =>
            lines(item.title, item.body).map((paragraph) => <p key={paragraph}>{paragraph}</p>),
          )}
        </div>
      </div>
    </section>
  );
}
