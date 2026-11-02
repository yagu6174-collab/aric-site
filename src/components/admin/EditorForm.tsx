"use client";

import type { ArticleBlock, InsightCategory } from "@/types/insight";
import { INSIGHT_CATEGORIES } from "@/types/insight";
import type { PreviewPage } from "@/components/edit/mode";
import {
  ColorFields,
  Field,
  FormGroup,
  FormShell,
  ImageField,
  JumpList,
  MiniNav,
  MoveRow,
  OrderList,
  TextField,
  fieldClass,
  quietClass,
} from "@/components/admin/widgets";
import {
  moveIndex,
  reindexInsights,
  uid,
  type InsightDraft,
  type SiteDraft,
  type TimelineDraft,
} from "@/lib/draft";

type Ask = (message: string, run: () => void) => void;

const jumps = [
  ["hero", "首屏标题"],
  ["hero-lead", "导语"],
  ["philosophy", "先稳一手"],
  ["brand", "名字"],
  ["nav", "导航"],
  ["latest", "最近写下的"],
  ["studio-about", "我是谁"],
  ["studio-contact", "联系卡片"],
  ["insights-copy", "见解页文案"],
  ["categories", "分类名"],
  ["insights-order", "文章顺序"],
  ["about-copy", "关于文案"],
  ["portrait", "肖像"],
  ["contact-copy", "联系页文案"],
  ["profile", "微信邮箱城市"],
  ["qr", "微信二维码"],
  ["footer", "页脚免责声明"],
  ["colors", "颜色"],
  ["not-found", "找不到页"],
] as const;

const heroNav = [
  ["hero", "标题"],
  ["hero-lead", "导语"],
  ["philosophy", "正文"],
] as const;

function todayKey() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function reorder<T>(items: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function EditorForm({
  draft,
  selected,
  onChange,
  onSelect,
  onPreview,
  ask,
}: {
  draft: SiteDraft;
  selected: string | null;
  onChange: (next: SiteDraft) => void;
  onSelect: (id: string) => void;
  onPreview: (page: PreviewPage) => void;
  ask: Ask;
}) {
  const insightId = selected?.startsWith("insight:") ? selected.slice("insight:".length) : "";
  const insight = draft.insights.find((item) => item.id === insightId) ?? null;
  const edu = draft.about.education.find((item) => selected === `edu:${item.id}`) ?? null;
  const job = draft.about.career.find((item) => selected === `job:${item.id}`) ?? null;
  const skill = draft.about.skills.find((item) => selected === `skill:${item.id}`) ?? null;
  const social = draft.profile.socials.find((item) => selected === `social:${item.id}`) ?? null;

  if (!selected) {
    return (
      <FormShell title="先点预览里的一块" hint="这里改的是简体。繁体按简体自动转。英文界面仍用原来的英文，不在这里逐句改。" scrollKey="directory">
        <FormGroup title="跳转">
          <JumpList items={jumps} onSelect={onSelect} />
        </FormGroup>
        <FormGroup title="加内容">
          <div className="mt-3 flex flex-col gap-2">
            <button type="button" className={quietClass} onClick={() => ask("要在草稿里加一篇吗？", () => addInsight(draft, onChange, onSelect, onPreview))}>
              加一篇文章
            </button>
            <button type="button" className={quietClass} onClick={() => ask("要加一条教育经历吗？", () => addTimeline(draft, "education", "edu", onChange, onSelect, onPreview))}>
              加一条教育
            </button>
            <button type="button" className={quietClass} onClick={() => ask("要加一条履历吗？", () => addTimeline(draft, "career", "job", onChange, onSelect, onPreview))}>
              加一条履历
            </button>
            <button type="button" className={quietClass} onClick={() => ask("要加一项技能吗？", () => addSkill(draft, onChange, onSelect, onPreview))}>
              加一项技能
            </button>
            <button type="button" className={quietClass} onClick={() => ask("要加一个链接吗？", () => addSocial(draft, onChange, onSelect, onPreview))}>
              加一个链接
            </button>
          </div>
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "hero" || selected === "hero-lead" || selected === "philosophy") {
    return (
      <FormShell
        title={selected === "hero" ? "首屏标题" : selected === "hero-lead" ? "导语" : "先稳一手"}
        hint="标题两行、导语，和下面那一段，是首页开口的三块。"
        scrollKey={selected}
      >
        <MiniNav items={heroNav} selected={selected} onSelect={onSelect} />
        {selected === "hero" ? (
          <FormGroup title="文案">
            <TextField label="第一行" value={draft.hero.line1} onChange={(line1) => onChange({ ...draft, hero: { ...draft.hero, line1 } })} />
            <TextField label="第二行" value={draft.hero.line2} onChange={(line2) => onChange({ ...draft, hero: { ...draft.hero, line2 } })} />
          </FormGroup>
        ) : null}
        {selected === "hero-lead" ? (
          <FormGroup title="文案">
            <TextField
              label="导语"
              value={draft.hero.subtitle}
              multiline
              onChange={(subtitle) => onChange({ ...draft, hero: { ...draft.hero, subtitle } })}
            />
            <p className="mt-2 text-xs leading-relaxed text-stone-500">页脚名字下面那句，用的也是这句。</p>
          </FormGroup>
        ) : null}
        {selected === "philosophy" ? (
          <FormGroup title="文案">
            <TextField
              label="小标题"
              value={draft.philosophy.title}
              onChange={(title) => onChange({ ...draft, philosophy: { ...draft.philosophy, title } })}
            />
            <p className="mt-2 text-xs leading-relaxed text-stone-500">首屏标题下那条链接，用的也是这个小标题。</p>
            {draft.philosophy.paragraphs.map((paragraph, index) => (
              <div key={`para-${index}`} className="mt-3 border-t border-stone-100 pt-3">
                <TextField
                  label={`第 ${index + 1} 段`}
                  value={paragraph}
                  multiline
                  onChange={(value) => {
                    const paragraphs = draft.philosophy.paragraphs.slice();
                    paragraphs[index] = value;
                    onChange({ ...draft, philosophy: { ...draft.philosophy, paragraphs } });
                  }}
                />
                <MoveRow
                  index={index}
                  total={draft.philosophy.paragraphs.length}
                  onMove={(delta) =>
                    onChange({
                      ...draft,
                      philosophy: { ...draft.philosophy, paragraphs: moveIndex(draft.philosophy.paragraphs, index, delta) },
                    })
                  }
                  onDelete={() =>
                    ask("要拿掉这一段吗？", () =>
                      onChange({
                        ...draft,
                        philosophy: {
                          ...draft.philosophy,
                          paragraphs: draft.philosophy.paragraphs.filter((_, item) => item !== index),
                        },
                      }),
                    )
                  }
                />
              </div>
            ))}
            <button
              type="button"
              className={`${quietClass} mt-3`}
              onClick={() =>
                ask("要再加一段吗？", () =>
                  onChange({
                    ...draft,
                    philosophy: { ...draft.philosophy, paragraphs: [...draft.philosophy.paragraphs, "再写一段。"] },
                  }),
                )
              }
            >
              加一段
            </button>
          </FormGroup>
        ) : null}
      </FormShell>
    );
  }

  if (selected === "brand") {
    return (
      <FormShell title="名字" hint="页头、页脚、关于页署名、联系页眉眼，用的是同一个名字。" scrollKey="brand">
        <FormGroup title="文案">
          <TextField label="中文名" value={draft.brand.name} onChange={(name) => onChange({ ...draft, brand: { ...draft.brand, name } })} />
          <TextField label="英文名" value={draft.brand.nameEn} onChange={(nameEn) => onChange({ ...draft, brand: { ...draft.brand, nameEn } })} />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "nav") {
    return (
      <FormShell title="导航" hint="页头、页脚，以及首页「最近写下的」底下那一行，用的是同一套名字。预览里点导航不会跳走。" scrollKey="nav">
        <FormGroup title="文案">
          <TextField label="首页" value={draft.nav.home} onChange={(home) => onChange({ ...draft, nav: { ...draft.nav, home } })} />
          <TextField label="见解" value={draft.nav.insights} onChange={(insights) => onChange({ ...draft, nav: { ...draft.nav, insights } })} />
          <TextField label="关于" value={draft.nav.about} onChange={(about) => onChange({ ...draft, nav: { ...draft.nav, about } })} />
          <TextField label="联系" value={draft.nav.contact} onChange={(contact) => onChange({ ...draft, nav: { ...draft.nav, contact } })} />
          <TextField label="跳到正文" value={draft.nav.skip} onChange={(skip) => onChange({ ...draft, nav: { ...draft.nav, skip } })} />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "latest") {
    return (
      <FormShell title="最近写下的" hint="标题在这里改。文章本身到「文章顺序」或点某一篇。列表按你排的顺序，取前三篇。" scrollKey="latest">
        <FormGroup title="文案">
          <TextField label="标题" value={draft.latest.title} onChange={(title) => onChange({ ...draft, latest: { title } })} />
        </FormGroup>
        <button type="button" className={quietClass} onClick={() => onSelect("insights-order")}>
          调整文章顺序
        </button>
      </FormShell>
    );
  }

  if (selected === "studio-about" || selected === "studio-contact") {
    const about = selected === "studio-about";
    return (
      <FormShell
        title={about ? "我是谁" : "联系卡片"}
        hint={about ? "首页右侧那张门。" : "首页右侧，以及页头右边那颗按钮，用的是这个标题。"}
        scrollKey={selected}
      >
        <MiniNav
          items={[
            ["studio-about", "我是谁"],
            ["studio-contact", "联系"],
          ]}
          selected={selected}
          onSelect={onSelect}
        />
        <FormGroup title="文案">
          <TextField
            label="标题"
            value={about ? draft.studio.aboutTitle : draft.studio.contactTitle}
            onChange={(value) =>
              onChange({
                ...draft,
                studio: about ? { ...draft.studio, aboutTitle: value } : { ...draft.studio, contactTitle: value },
              })
            }
          />
          <TextField
            label="说明"
            value={about ? draft.studio.aboutDesc : draft.studio.contactDesc}
            multiline
            onChange={(value) =>
              onChange({
                ...draft,
                studio: about ? { ...draft.studio, aboutDesc: value } : { ...draft.studio, contactDesc: value },
              })
            }
          />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "insights-copy") {
    return (
      <FormShell title="见解页文案" hint="列表页的标题和免责声明，文章页的返回和文末那句，空列表时的那句，都在这里。" scrollKey="insights-copy">
        <FormGroup title="文案">
          <TextField label="标题" value={draft.insightsPage.title} onChange={(title) => onChange({ ...draft, insightsPage: { ...draft.insightsPage, title } })} />
          <TextField label="免责声明" value={draft.insightsPage.disclaimer} multiline onChange={(disclaimer) => onChange({ ...draft, insightsPage: { ...draft.insightsPage, disclaimer } })} />
          <TextField label="全部" value={draft.insightsPage.all} onChange={(all) => onChange({ ...draft, insightsPage: { ...draft.insightsPage, all } })} />
          <TextField label="空列表" value={draft.insightsPage.empty} onChange={(empty) => onChange({ ...draft, insightsPage: { ...draft.insightsPage, empty } })} />
          <TextField label="字数单位" value={draft.insightsPage.charCount} onChange={(charCount) => onChange({ ...draft, insightsPage: { ...draft.insightsPage, charCount } })} />
          <TextField label="返回" value={draft.insightsPage.back} onChange={(back) => onChange({ ...draft, insightsPage: { ...draft.insightsPage, back } })} />
        </FormGroup>
        <button type="button" className={quietClass} onClick={() => onSelect("categories")}>
          改分类名
        </button>
      </FormShell>
    );
  }

  if (selected === "categories") {
    return (
      <FormShell title="分类名" hint="分类本身是固定的五类。这里只改显示出来的名字。" scrollKey="categories">
        <FormGroup title="文案">
          {INSIGHT_CATEGORIES.map((key) => (
            <TextField
              key={key}
              label={key}
              value={draft.insightsPage.categories[key]}
              onChange={(value) =>
                onChange({
                  ...draft,
                  insightsPage: {
                    ...draft.insightsPage,
                    categories: { ...draft.insightsPage.categories, [key]: value },
                  },
                })
              }
            />
          ))}
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "insights-order") {
    const items = [...draft.insights].sort((a, b) => a.order - b.order);
    return (
      <FormShell title="文章顺序" hint="这个顺序就是首页前三篇，也是见解列表的顺序。日期仍然印在卡片上。" scrollKey="insights-order">
        <FormGroup title="顺序">
          <OrderList
            label="文章顺序"
            items={items.map((item) => ({ id: `insight:${item.id}`, title: item.title }))}
            onSelect={onSelect}
            onReorder={(from, to) => onChange({ ...draft, insights: reindexInsights(reorder(items, from, to)) })}
          />
          <button type="button" className={`${quietClass} mt-3`} onClick={() => ask("要在草稿里加一篇吗？", () => addInsight(draft, onChange, onSelect, onPreview))}>
            加一篇
          </button>
        </FormGroup>
      </FormShell>
    );
  }

  if (insight) {
    const index = draft.insights.findIndex((item) => item.id === insight.id);
    const items = [...draft.insights].sort((a, b) => a.order - b.order);
    const sortedIndex = items.findIndex((item) => item.id === insight.id);
    return (
      <FormShell title={insight.title || "文章"} hint="字数按正文算，不用填。改完要点保存，公开页才换。" scrollKey={selected}>
        <FormGroup title="文案">
          <TextField label="标题" value={insight.title} onChange={(title) => updateInsight(draft, insight.id, { title }, onChange)} />
          <TextField label="摘要" value={insight.excerpt} multiline onChange={(excerpt) => updateInsight(draft, insight.id, { excerpt }, onChange)} />
          <TextField label="引句" value={insight.quote} multiline onChange={(quote) => updateInsight(draft, insight.id, { quote }, onChange)} />
          <Field label="日期">
            <input type="date" value={insight.date} onChange={(event) => updateInsight(draft, insight.id, { date: event.target.value }, onChange)} className={fieldClass} />
          </Field>
          <Field label="分类">
            <select
              value={insight.category}
              onChange={(event) => updateInsight(draft, insight.id, { category: event.target.value as InsightCategory }, onChange)}
              className={fieldClass}
            >
              {INSIGHT_CATEGORIES.map((key) => (
                <option key={key} value={key}>
                  {draft.insightsPage.categories[key]}
                </option>
              ))}
            </select>
          </Field>
          <TextField label="链接名" value={insight.slug} onChange={(slug) => updateInsight(draft, insight.id, { slug }, onChange)} />
          <p className="mt-2 text-xs leading-relaxed text-stone-500">公开地址用这一段，中文也可以。保存之后，旧地址就不再打开。</p>
        </FormGroup>
        <FormGroup title="正文">
          {insight.body.map((block, blockIndex) => (
            <BlockEditor
              key={`${insight.id}-${blockIndex}`}
              block={block}
              onChange={(next) => {
                const body = insight.body.slice();
                body[blockIndex] = next;
                updateInsight(draft, insight.id, { body }, onChange);
              }}
              onMove={(delta) => updateInsight(draft, insight.id, { body: moveIndex(insight.body, blockIndex, delta) }, onChange)}
              onDelete={() =>
                ask("要拿掉这一段正文吗？", () =>
                  updateInsight(draft, insight.id, { body: insight.body.filter((_, item) => item !== blockIndex) }, onChange),
                )
              }
              index={blockIndex}
              total={insight.body.length}
            />
          ))}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" className={quietClass} onClick={() => ask("要加一段正文吗？", () => updateInsight(draft, insight.id, { body: [...insight.body, { type: "p", text: "" }] }, onChange))}>
              加段落
            </button>
            <button type="button" className={quietClass} onClick={() => ask("要加一段引文吗？", () => updateInsight(draft, insight.id, { body: [...insight.body, { type: "quote", text: "" }] }, onChange))}>
              加引文
            </button>
            <button
              type="button"
              className={quietClass}
              onClick={() =>
                ask("要加一张表吗？", () =>
                  updateInsight(draft, insight.id, { body: [...insight.body, { type: "table", headers: ["", ""], rows: [["", ""]] }] }, onChange),
                )
              }
            >
              加表格
            </button>
          </div>
        </FormGroup>
        <FormGroup title="顺序 · 删除">
          <MoveRow
            index={sortedIndex}
            total={items.length}
            onMove={(delta) => onChange({ ...draft, insights: reindexInsights(moveIndex(items, sortedIndex, delta)) })}
            onDelete={() =>
              ask("要从草稿里拿掉这篇文章吗？还没保存的话，公开页不变。", () => {
                onChange({ ...draft, insights: reindexInsights(draft.insights.filter((item) => item.id !== insight.id)) });
                onSelect("insights-order");
              })
            }
            deleteLabel="删除这篇文章"
          />
          <button type="button" className={`${quietClass} mt-3`} onClick={() => onPreview("reading")}>
            在阅读页看这篇
          </button>
        </FormGroup>
        <p className="text-xs text-stone-400">草稿序号 {index + 1}</p>
      </FormShell>
    );
  }

  if (selected === "about-copy") {
    return (
      <FormShell title="关于文案" hint="页标题、服务理念、经历和技能的栏名。每一条经历点进去单改。" scrollKey="about-copy">
        <FormGroup title="文案">
          <TextField label="页标题" value={draft.aboutPage.title} onChange={(title) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, title } })} />
          <TextField label="理念标题" value={draft.aboutPage.storyTitle} onChange={(storyTitle) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, storyTitle } })} />
          {draft.aboutPage.story.map((paragraph, index) => (
            <div key={`story-${index}`} className="mt-3 border-t border-stone-100 pt-3">
              <TextField
                label={`介绍 ${index + 1}`}
                value={paragraph}
                multiline
                onChange={(value) => {
                  const story = draft.aboutPage.story.slice();
                  story[index] = value;
                  onChange({ ...draft, aboutPage: { ...draft.aboutPage, story } });
                }}
              />
              <MoveRow
                index={index}
                total={draft.aboutPage.story.length}
                onMove={(delta) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, story: moveIndex(draft.aboutPage.story, index, delta) } })}
                onDelete={() =>
                  ask("要拿掉这段介绍吗？", () =>
                    onChange({
                      ...draft,
                      aboutPage: { ...draft.aboutPage, story: draft.aboutPage.story.filter((_, item) => item !== index) },
                    }),
                  )
                }
              />
            </div>
          ))}
          <button
            type="button"
            className={`${quietClass} mt-3`}
            onClick={() => ask("要加一段介绍吗？", () => onChange({ ...draft, aboutPage: { ...draft.aboutPage, story: [...draft.aboutPage.story, "再写一句。"] } }))}
          >
            加一段介绍
          </button>
          <TextField label="教育栏" value={draft.aboutPage.education} onChange={(education) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, education } })} />
          <TextField label="履历栏" value={draft.aboutPage.career} onChange={(career) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, career } })} />
          <TextField label="技能栏" value={draft.aboutPage.skills} onChange={(skills) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, skills } })} />
          <TextField label="肖像替代文字" value={draft.aboutPage.portraitAlt} onChange={(portraitAlt) => onChange({ ...draft, aboutPage: { ...draft.aboutPage, portraitAlt } })} />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "portrait") {
    return (
      <FormShell title="肖像" hint="空着就继续用现在的占位图。先上传或填地址，再点保存。" scrollKey="portrait">
        <FormGroup title="图片">
          <ImageField
            label="肖像"
            value={draft.images.portraitUrl}
            emptyHint="现在公开页用的是占位肖像。"
            onChange={(portraitUrl) => onChange({ ...draft, images: { ...draft.images, portraitUrl } })}
          />
        </FormGroup>
      </FormShell>
    );
  }

  if (edu || job) {
    const kind = edu ? "education" : "career";
    const row = (edu ?? job)!;
    const list = draft.about[kind];
    const index = list.findIndex((item) => item.id === row.id);
    return (
      <FormShell title={row.title || (edu ? "教育" : "履历")} hint="这一条只改这一条。" scrollKey={selected ?? "row"}>
        <TimelineFields
          row={row}
          onChange={(next) => {
            const items = list.slice();
            items[index] = next;
            onChange({ ...draft, about: { ...draft.about, [kind]: items } });
          }}
        />
        <MoveRow
          index={index}
          total={list.length}
          onMove={(delta) => onChange({ ...draft, about: { ...draft.about, [kind]: moveIndex(list, index, delta) } })}
          onDelete={() =>
            ask("要拿掉这一条吗？", () => {
              onChange({ ...draft, about: { ...draft.about, [kind]: list.filter((item) => item.id !== row.id) } });
              onSelect("about-copy");
            })
          }
        />
      </FormShell>
    );
  }

  if (skill) {
    const index = draft.about.skills.findIndex((item) => item.id === skill.id);
    return (
      <FormShell title={skill.text || "技能"} scrollKey={selected ?? "skill"}>
        <FormGroup title="文案">
          <TextField
            label="技能"
            value={skill.text}
            onChange={(text) => {
              const skills = draft.about.skills.slice();
              skills[index] = { ...skill, text };
              onChange({ ...draft, about: { ...draft.about, skills } });
            }}
          />
        </FormGroup>
        <MoveRow
          index={index}
          total={draft.about.skills.length}
          onMove={(delta) => onChange({ ...draft, about: { ...draft.about, skills: moveIndex(draft.about.skills, index, delta) } })}
          onDelete={() =>
            ask("要拿掉这项技能吗？", () => {
              onChange({ ...draft, about: { ...draft.about, skills: draft.about.skills.filter((item) => item.id !== skill.id) } });
              onSelect("about-copy");
            })
          }
        />
      </FormShell>
    );
  }

  if (selected === "contact-copy") {
    const page = draft.contactPage;
    const set = (patch: Partial<SiteDraft["contactPage"]>) => onChange({ ...draft, contactPage: { ...page, ...patch } });
    return (
      <FormShell title="联系页文案" hint="栏名和按钮上的字。微信号、邮箱、城市在「微信邮箱城市」。" scrollKey="contact-copy">
        <FormGroup title="文案">
          <TextField label="标题" value={page.title} onChange={(title) => set({ title })} />
          <TextField label="说明" value={page.hint} multiline onChange={(hint) => set({ hint })} />
          <TextField label="微信栏" value={page.wechat} onChange={(wechat) => set({ wechat })} />
          <TextField label="复制按钮" value={page.copy} onChange={(copy) => set({ copy })} />
          <TextField label="已复制" value={page.copied} onChange={(copied) => set({ copied })} />
          <TextField label="邮箱栏" value={page.email} onChange={(email) => set({ email })} />
          <TextField label="城市栏" value={page.city} onChange={(city) => set({ city })} />
          <TextField label="其他链接栏" value={page.social} onChange={(socialLabel) => set({ social: socialLabel })} />
          <TextField label="二维码替代文字" value={page.qrAlt} onChange={(qrAlt) => set({ qrAlt })} />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "profile") {
    return (
      <FormShell title="微信、邮箱、城市" hint="联系页和页脚用的是同一组。链接可以单独点。" scrollKey="profile">
        <FormGroup title="文案">
          <TextField label="微信号" value={draft.profile.wechat} onChange={(wechat) => onChange({ ...draft, profile: { ...draft.profile, wechat } })} />
          <TextField label="邮箱" value={draft.profile.email} onChange={(email) => onChange({ ...draft, profile: { ...draft.profile, email } })} />
          <TextField label="城市" value={draft.profile.city} onChange={(city) => onChange({ ...draft, profile: { ...draft.profile, city } })} />
        </FormGroup>
        <FormGroup title="其他链接">
          <JumpList items={draft.profile.socials.map((item) => [`social:${item.id}`, item.label || item.href] as const)} onSelect={onSelect} />
          <button type="button" className={`${quietClass} mt-3`} onClick={() => ask("要加一个链接吗？", () => addSocial(draft, onChange, onSelect, onPreview))}>
            加一个链接
          </button>
        </FormGroup>
      </FormShell>
    );
  }

  if (social) {
    const index = draft.profile.socials.findIndex((item) => item.id === social.id);
    return (
      <FormShell title={social.label || "链接"} hint="地址要用 https:// 或 mailto:。保存时认不出的地址会被拿掉。" scrollKey={selected ?? "social"}>
        <FormGroup title="链接">
          <TextField
            label="名称"
            value={social.label}
            onChange={(label) => {
              const socials = draft.profile.socials.slice();
              socials[index] = { ...social, label };
              onChange({ ...draft, profile: { ...draft.profile, socials } });
            }}
          />
          <TextField
            label="地址"
            value={social.href}
            onChange={(href) => {
              const socials = draft.profile.socials.slice();
              socials[index] = { ...social, href };
              onChange({ ...draft, profile: { ...draft.profile, socials } });
            }}
          />
        </FormGroup>
        <MoveRow
          index={index}
          total={draft.profile.socials.length}
          onMove={(delta) => onChange({ ...draft, profile: { ...draft.profile, socials: moveIndex(draft.profile.socials, index, delta) } })}
          onDelete={() =>
            ask("要拿掉这个链接吗？", () => {
              onChange({ ...draft, profile: { ...draft.profile, socials: draft.profile.socials.filter((item) => item.id !== social.id) } });
              onSelect("profile");
            })
          }
        />
        {social.href ? (
          <a href={social.href} target="_blank" rel="noreferrer" className={`${quietClass} mt-3`}>
            打开链接看看
          </a>
        ) : null}
      </FormShell>
    );
  }

  if (selected === "qr") {
    return (
      <FormShell title="微信二维码" hint="空着就继续用现在的占位图。" scrollKey="qr">
        <FormGroup title="图片">
          <ImageField
            label="二维码"
            value={draft.images.qrUrl}
            emptyHint="现在公开页用的是占位二维码。"
            onChange={(qrUrl) => onChange({ ...draft, images: { ...draft.images, qrUrl } })}
          />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "footer") {
    return (
      <FormShell title="页脚免责声明" hint="名字在「名字」里改，城市邮箱微信在「微信邮箱城市」，导航在「导航」。" scrollKey="footer">
        <FormGroup title="文案">
          <TextField label="标签" value={draft.footer.label} onChange={(label) => onChange({ ...draft, footer: { ...draft.footer, label } })} />
          <TextField label="声明" value={draft.footer.rights} multiline onChange={(rights) => onChange({ ...draft, footer: { ...draft.footer, rights } })} />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "colors") {
    return (
      <FormShell title="颜色" hint="预览会马上变。公开页要等保存。" scrollKey="colors">
        <FormGroup title="外观">
          <ColorFields colors={draft.colors} onChange={(colors) => onChange({ ...draft, colors })} />
        </FormGroup>
      </FormShell>
    );
  }

  if (selected === "not-found") {
    return (
      <FormShell title="找不到页" hint="访客走错地址时那一行。预览里没有这块，从目录进来改。" scrollKey="not-found">
        <FormGroup title="文案">
          <TextField label="标题" value={draft.notFound.title} onChange={(title) => onChange({ ...draft, notFound: { title } })} />
        </FormGroup>
      </FormShell>
    );
  }

  return (
    <FormShell title="这一块还没有表单" scrollKey={selected}>
      <button type="button" className={quietClass} onClick={() => onSelect("hero")}>
        回到目录
      </button>
    </FormShell>
  );
}

function TimelineFields({ row, onChange }: { row: TimelineDraft; onChange: (next: TimelineDraft) => void }) {
  return (
    <FormGroup title="文案">
      <TextField label="时间" value={row.period} onChange={(period) => onChange({ ...row, period })} />
      <TextField label="标题" value={row.title} onChange={(title) => onChange({ ...row, title })} />
      <TextField label="说明" value={row.detail} multiline onChange={(detail) => onChange({ ...row, detail })} />
    </FormGroup>
  );
}

function BlockEditor({
  block,
  onChange,
  onMove,
  onDelete,
  index,
  total,
}: {
  block: ArticleBlock;
  onChange: (next: ArticleBlock) => void;
  onMove: (delta: -1 | 1) => void;
  onDelete: () => void;
  index: number;
  total: number;
}) {
  return (
    <div className="mt-3 border-t border-stone-100 pt-3">
      <Field label="类型">
        <select
          value={block.type}
          className={fieldClass}
          onChange={(event) => {
            const type = event.target.value;
            if (type === "p") onChange({ type: "p", text: block.type === "table" ? "" : block.text });
            else if (type === "quote") onChange({ type: "quote", text: block.type === "table" ? "" : block.text });
            else onChange({ type: "table", headers: ["", ""], rows: [["", ""]] });
          }}
        >
          <option value="p">段落</option>
          <option value="quote">引文</option>
          <option value="table">表格</option>
        </select>
      </Field>
      {block.type === "p" ? <TextField label="段落" value={block.text} multiline onChange={(text) => onChange({ type: "p", text })} /> : null}
      {block.type === "quote" ? (
        <>
          <TextField label="引文" value={block.text} multiline onChange={(text) => onChange({ ...block, text })} />
          <TextField label="出处" value={block.cite ?? ""} onChange={(cite) => onChange({ type: "quote", text: block.text, cite })} />
        </>
      ) : null}
      {block.type === "table" ? (
        <>
          <TextField label="表头，用 | 分开" value={block.headers.join(" | ")} onChange={(value) => onChange({ ...block, headers: value.split("|").map((cell) => cell.trim()) })} />
          <TextField
            label="各行，一行是一行，格子用 | 分开"
            value={block.rows.map((row) => row.join(" | ")).join("\n")}
            multiline
            onChange={(value) =>
              onChange({
                ...block,
                rows: value
                  .split("\n")
                  .filter((line) => line.trim())
                  .map((line) => line.split("|").map((cell) => cell.trim())),
              })
            }
          />
        </>
      ) : null}
      <MoveRow index={index} total={total} onMove={onMove} onDelete={onDelete} deleteLabel="删除这段" />
    </div>
  );
}

function updateInsight(draft: SiteDraft, id: string, patch: Partial<InsightDraft>, onChange: (next: SiteDraft) => void) {
  onChange({
    ...draft,
    insights: draft.insights.map((item) => (item.id === id ? { ...item, ...patch } : item)),
  });
}

function addInsight(draft: SiteDraft, onChange: (next: SiteDraft) => void, onSelect: (id: string) => void, onPreview: (page: PreviewPage) => void) {
  const id = uid("post");
  const item: InsightDraft = {
    id,
    slug: "新的一篇",
    title: "新的一篇",
    date: todayKey(),
    category: "essay",
    excerpt: "",
    quote: "",
    body: [{ type: "p", text: "" }],
    order: 0,
  };
  onChange({ ...draft, insights: reindexInsights([item, ...[...draft.insights].sort((a, b) => a.order - b.order)]) });
  onSelect(`insight:${id}`);
  onPreview("insights");
}

function addTimeline(
  draft: SiteDraft,
  kind: "education" | "career",
  prefix: "edu" | "job",
  onChange: (next: SiteDraft) => void,
  onSelect: (id: string) => void,
  onPreview: (page: PreviewPage) => void,
) {
  const id = uid(prefix);
  const row = { id, period: "", title: kind === "education" ? "新的教育" : "新的履历", detail: "" };
  onChange({ ...draft, about: { ...draft.about, [kind]: [...draft.about[kind], row] } });
  onSelect(`${prefix}:${id}`);
  onPreview("about");
}

function addSkill(draft: SiteDraft, onChange: (next: SiteDraft) => void, onSelect: (id: string) => void, onPreview: (page: PreviewPage) => void) {
  const id = uid("skill");
  onChange({ ...draft, about: { ...draft.about, skills: [...draft.about.skills, { id, text: "新的一项" }] } });
  onSelect(`skill:${id}`);
  onPreview("about");
}

function addSocial(draft: SiteDraft, onChange: (next: SiteDraft) => void, onSelect: (id: string) => void, onPreview: (page: PreviewPage) => void) {
  const id = uid("social");
  onChange({
    ...draft,
    profile: {
      ...draft.profile,
      socials: [...draft.profile.socials, { id, label: "新的链接", href: "https://example.com" }],
    },
  });
  onSelect(`social:${id}`);
  onPreview("contact");
}
