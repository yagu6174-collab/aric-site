export type SiteProfile = {
  name: string;
  nameEn: string;
  wechat: string;
  email: string;
  city: string;
  socials: { label: string; href: string }[];
};

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  philosophies: { title: string; body: string }[];
  photoBanner: string;
};

export type AboutContent = {
  story: string[];
  education: { period: string; title: string; detail: string }[];
  career: { period: string; title: string; detail: string }[];
  skills: string[];
};
