export type SocialLink = {
  id: string;
  label: string;
  href: string;
};

export type TimelineEntry = {
  id: string;
  period: string;
  title: string;
  detail: string;
};

export type SiteProfile = {
  name: string;
  nameEn: string;
  wechat: string;
  email: string;
  city: string;
  socials: SocialLink[];
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  philosophies: { title: string; body: string }[];
};

export type AboutContent = {
  story: string[];
  education: TimelineEntry[];
  career: TimelineEntry[];
  skills: { id: string; text: string }[];
};
