import { WeChatCard } from "@/components/contact/WeChatCard";
import { Container } from "@/components/ui/Container";
import { getSite } from "@/lib/content";

export default async function ContactPage() {
  const site = await getSite();

  return (
    <Container className="py-16">
      <h1 className="mb-10 text-center font-serif text-4xl sm:text-5xl">联系</h1>
      <WeChatCard site={site} />
      <dl className="mx-auto mt-12 max-w-xl space-y-4 text-sm">
        <div className="flex justify-between gap-4 border-b border-[var(--line)] py-3">
          <dt className="text-[var(--muted)]">工作邮箱</dt>
          <dd>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </dd>
        </div>
        <div className="flex justify-between gap-4 border-b border-[var(--line)] py-3">
          <dt className="text-[var(--muted)]">所在城市</dt>
          <dd>{site.city}</dd>
        </div>
        {site.socials.map((item) => (
          <div
            key={item.href}
            className="flex justify-between gap-4 border-b border-[var(--line)] py-3"
          >
            <dt className="text-[var(--muted)]">{item.label}</dt>
            <dd>
              <a href={item.href} target="_blank" rel="noreferrer">
                {item.href}
              </a>
            </dd>
          </div>
        ))}
      </dl>
    </Container>
  );
}
