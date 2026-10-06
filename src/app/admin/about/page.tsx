"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { AboutContent } from "@/types/site";

const fieldClass =
  "w-full rounded-xl border border-[var(--line)] bg-transparent px-3 py-2";

type TimelineItem = AboutContent["education"][number];

function blankItem(): TimelineItem {
  return { period: "", title: "", detail: "" };
}

export default function AdminAboutPage() {
  const router = useRouter();
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const auth = await fetch("/api/auth", { cache: "no-store" });
      const session = (await auth.json()) as { authed?: boolean };
      if (!session.authed) {
        router.replace("/admin");
        return;
      }
      const res = await fetch("/api/about", { cache: "no-store" });
      if (!res.ok) {
        router.replace("/admin");
        return;
      }
      const data = (await res.json()) as AboutContent;
      setAbout({
        story: data.story.length ? data.story : [""],
        education: data.education.length ? data.education : [blankItem()],
        career: data.career.length ? data.career : [blankItem()],
        skills: data.skills.length ? data.skills : [""],
      });
    })();
  }, [router]);

  async function save() {
    if (!about) return;
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/about", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(about),
    });
    setBusy(false);
    if (!res.ok) {
      setMessage("保存失败，请先在后台首页登录");
      return;
    }
    router.refresh();
    setMessage("已保存。繁体页面会自动转换。");
  }

  if (!about) {
    return <p className="text-sm text-[var(--muted)]">正在载入个人介绍…</p>;
  }

  function setStory(index: number, value: string) {
    setAbout({
      ...about!,
      story: about!.story.map((item, itemIndex) => (itemIndex === index ? value : item)),
    });
  }

  function setTimeline(
    key: "education" | "career",
    index: number,
    patch: Partial<TimelineItem>,
  ) {
    setAbout({
      ...about!,
      [key]: about![key].map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    });
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl">个人介绍</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            改服务理念、教育、履历和技能。保存后前台会更新。
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-xs tracking-wide text-[var(--muted)]">服务理念</p>
          {about.story.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <textarea
                value={paragraph}
                rows={4}
                onChange={(event) => setStory(index, event.target.value)}
                className={fieldClass}
              />
              <Button
                variant="ghost"
                onClick={() =>
                  setAbout({
                    ...about,
                    story: about.story.filter((_, itemIndex) => itemIndex !== index),
                  })
                }
              >
                去掉这段
              </Button>
            </div>
          ))}
          <Button
            variant="ghost"
            onClick={() => setAbout({ ...about, story: [...about.story, ""] })}
          >
            加一段
          </Button>
        </div>
      </Card>

      <TimelineEditor
        title="教育背景"
        items={about.education}
        onChange={(index, patch) => setTimeline("education", index, patch)}
        onAdd={() =>
          setAbout({ ...about, education: [...about.education, blankItem()] })
        }
        onRemove={(index) =>
          setAbout({
            ...about,
            education: about.education.filter((_, itemIndex) => itemIndex !== index),
          })
        }
      />
      <TimelineEditor
        title="职业履历"
        items={about.career}
        onChange={(index, patch) => setTimeline("career", index, patch)}
        onAdd={() => setAbout({ ...about, career: [...about.career, blankItem()] })}
        onRemove={(index) =>
          setAbout({
            ...about,
            career: about.career.filter((_, itemIndex) => itemIndex !== index),
          })
        }
      />

      <Card className="space-y-3">
        <p className="font-serif text-xl">专业技能</p>
        {about.skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              value={skill}
              onChange={(event) =>
                setAbout({
                  ...about,
                  skills: about.skills.map((item, itemIndex) =>
                    itemIndex === index ? event.target.value : item,
                  ),
                })
              }
              className={fieldClass}
            />
            <Button
              variant="ghost"
              onClick={() =>
                setAbout({
                  ...about,
                  skills: about.skills.filter((_, itemIndex) => itemIndex !== index),
                })
              }
            >
              去掉
            </Button>
          </div>
        ))}
        <Button
          variant="ghost"
          onClick={() => setAbout({ ...about, skills: [...about.skills, ""] })}
        >
          加一项
        </Button>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={save} className={busy ? "opacity-60" : undefined}>
          {busy ? "保存中…" : "保存"}
        </Button>
        {message ? <p className="text-sm text-[var(--muted)]">{message}</p> : null}
      </div>
    </div>
  );
}

function TimelineEditor({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
}: {
  title: string;
  items: TimelineItem[];
  onChange: (index: number, patch: Partial<TimelineItem>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <Card className="space-y-4">
      <p className="font-serif text-xl">{title}</p>
      {items.map((item, index) => (
        <div key={index} className="space-y-2 border-t border-[var(--line)] pt-4">
          <input
            value={item.period}
            placeholder="时间"
            onChange={(event) => onChange(index, { period: event.target.value })}
            className={fieldClass}
          />
          <input
            value={item.title}
            placeholder="名称"
            onChange={(event) => onChange(index, { title: event.target.value })}
            className={fieldClass}
          />
          <textarea
            value={item.detail}
            rows={3}
            placeholder="说明"
            onChange={(event) => onChange(index, { detail: event.target.value })}
            className={fieldClass}
          />
          <Button variant="ghost" onClick={() => onRemove(index)}>
            去掉这条
          </Button>
        </div>
      ))}
      <Button variant="ghost" onClick={onAdd}>
        加一条
      </Button>
    </Card>
  );
}
