"use client";

import { QueueStrip } from "@/components/home/QueueStrip";
import { editHit } from "@/components/edit/EditAnchor";
import { useEditMode } from "@/components/edit/mode";
import { useI18n } from "@/i18n/provider";

function Arc() {
  return (
    <svg className="hero-arc" viewBox="0 0 820 900" fill="none" aria-hidden>
      <path
        d="M80 920C250 880 390 700 450 470C510 230 560 40 610 -40"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="M170 960C340 900 500 680 560 420C620 170 690 -20 780 -80"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      <path
        d="M260 990C430 910 600 660 670 380C740 120 820 -40 920 -110"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.32"
      />
      <path
        d="M10 860C190 830 340 690 400 500C460 300 490 120 510 0"
        stroke="currentColor"
        strokeWidth="0.75"
        opacity="0.45"
      />
      <path
        d="M0 800C150 730 300 770 460 735C620 700 720 785 820 730"
        stroke="currentColor"
        strokeWidth="1.15"
        opacity="0.8"
      />
    </svg>
  );
}

export function Hero() {
  const { dict } = useI18n();
  const edit = useEditMode();

  return (
    <section className="hero">
      <div className="shell hero-inner">
        <div className="hero-copy">
          <span className="rule" aria-hidden />
          <h1 {...editHit(edit?.selected, "hero", "hero-title", edit?.onSelect)}>
            {dict.home.heroLines.map((line, index) => (
              <span key={`${index}-${line}`}>{line}</span>
            ))}
          </h1>
          <p {...editHit(edit?.selected, "hero-lead", "hero-lead", edit?.onSelect)}>
            {dict.home.heroSubtitle}
          </p>
          <a href="#chapter" {...editHit(edit?.selected, "philosophy", "text-link", edit?.onSelect)}>
            {dict.home.philosophyTitle}
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
      <Arc />
      <QueueStrip />
    </section>
  );
}
