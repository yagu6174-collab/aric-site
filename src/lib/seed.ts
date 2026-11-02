import "server-only";
import { zhCN } from "@/i18n/dictionaries/zh-CN";
import { getAbout, getInsights, getSite } from "@/lib/content";
import { defaultColors, normalizeSiteDraft, type SiteDraft } from "@/lib/draft";

function philosophyParagraphs() {
  const item = zhCN.philosophies[0];
  return [item.title, ...item.body.split(/\n+/)].map((line) => line.trim()).filter(Boolean);
}

export function seedDraft(): SiteDraft {
  const site = getSite();
  const about = getAbout();
  const insights = getInsights();
  const categories = zhCN.insights.categories;
  return normalizeSiteDraft(
    {
      revision: 1,
      brand: { name: zhCN.name, nameEn: zhCN.nameEn },
      nav: { ...zhCN.nav },
      hero: {
        line1: zhCN.home.heroLines[0],
        line2: zhCN.home.heroLines[1],
        subtitle: zhCN.home.heroSubtitle,
      },
      philosophy: { title: zhCN.home.philosophyTitle, paragraphs: philosophyParagraphs() },
      latest: { title: zhCN.home.latestTitle },
      studio: {
        aboutTitle: zhCN.studio.about.title,
        aboutDesc: zhCN.studio.about.desc,
        contactTitle: zhCN.studio.contact.title,
        contactDesc: zhCN.studio.contact.desc,
      },
      insightsPage: {
        title: zhCN.insights.title,
        disclaimer: zhCN.insights.disclaimer,
        all: zhCN.insights.all,
        empty: zhCN.insights.empty,
        charCount: zhCN.insights.charCount,
        back: zhCN.insights.back,
        categories: { ...categories },
      },
      aboutPage: {
        title: zhCN.about.title,
        storyTitle: zhCN.about.storyTitle,
        portraitAlt: zhCN.about.portraitAlt,
        education: zhCN.about.education,
        career: zhCN.about.career,
        skills: zhCN.about.skills,
        story: about.story,
      },
      contactPage: { ...zhCN.contact },
      footer: { ...zhCN.footer },
      notFound: { ...zhCN.notFound },
      profile: {
        wechat: site.wechat,
        email: site.email,
        city: site.city,
        socials: site.socials.map((item, index) => ({
          id: `social-${index + 1}`,
          label: item.label,
          href: item.href,
        })),
      },
      about: {
        education: about.education,
        career: about.career,
        skills: about.skills,
      },
      insights: insights.map((item, order) => ({
        id: `post-${order + 1}`,
        slug: item.slug,
        title: item.title,
        date: item.date,
        category: item.category,
        excerpt: item.excerpt,
        quote: item.quote,
        body: item.body,
        order,
      })),
      images: { portraitUrl: "", qrUrl: "" },
      colors: { ...defaultColors },
    },
    emptySeedCarrier(),
  );
}

function emptySeedCarrier(): SiteDraft {
  const categories = {
    allocation: "资产配置",
    market: "市场观察",
    risk: "风险管理",
    family: "家庭财务规划",
    essay: "个人随笔",
  } as const;
  return {
    revision: 1,
    brand: { name: "陆恩惠", nameEn: "Aric" },
    nav: { home: "首页", insights: "理财见解", about: "个人介绍", contact: "联系方式", skip: "跳到正文" },
    hero: { line1: "越害怕风险", line2: "越需要保险", subtitle: "理财顾问，写一点自己的看法。" },
    philosophy: { title: "先稳一手", paragraphs: [] },
    latest: { title: "最近写下的" },
    studio: { aboutTitle: "我是谁", aboutDesc: "", contactTitle: "联系", contactDesc: "" },
    insightsPage: {
      title: "理财见解",
      disclaimer: "",
      all: "全部",
      empty: "这一分类还没有文章。",
      charCount: "字",
      back: "返回见解列表",
      categories: { ...categories },
    },
    aboutPage: {
      title: "个人介绍",
      storyTitle: "服务理念",
      portraitAlt: "陆恩惠",
      education: "教育背景",
      career: "职业履历",
      skills: "专业技能",
      story: [],
    },
    contactPage: {
      title: "联系方式",
      wechat: "微信号",
      copy: "一键复制",
      copied: "已复制",
      hint: "",
      email: "工作邮箱",
      city: "所在城市",
      social: "其他链接",
      qrAlt: "微信二维码",
    },
    footer: { label: "免责声明：", rights: "" },
    notFound: { title: "这一页不存在" },
    profile: { wechat: "", email: "", city: "", socials: [] },
    about: { education: [], career: [], skills: [] },
    insights: [],
    images: { portraitUrl: "", qrUrl: "" },
    colors: { ...defaultColors },
  };
}
