export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFC")
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(value: string, locale: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const tag = locale === "en" ? "en-US" : locale === "zh-TW" ? "zh-TW" : "zh-CN";
  return new Intl.DateTimeFormat(tag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}
