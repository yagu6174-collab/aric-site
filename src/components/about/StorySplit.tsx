"use client";

import Image from "next/image";
import type { AboutContent } from "@/types/site";
import { useI18n } from "@/i18n/provider";

export function StorySplit({ story }: { story: AboutContent["story"] }) {
  const { dict } = useI18n();

  return (
    <div className="essay-story">
      <h2>{dict.about.storyTitle}</h2>
      {story.map((para) => (
        <p key={para}>{para}</p>
      ))}
      <div className="essay-portrait">
        <Image
          src="/placeholders/portrait.svg"
          alt={dict.about.portraitAlt}
          width={720}
          height={900}
        />
      </div>
    </div>
  );
}
