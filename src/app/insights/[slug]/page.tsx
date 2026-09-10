import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/insights/ArticleBody";
import { Disclaimer } from "@/components/insights/Disclaimer";
import { Container } from "@/components/ui/Container";
import { getInsight } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getInsight(slug);
  if (!item) notFound();

  return (
    <Container className="py-16">
      <Link href="/insights" className="text-sm text-[var(--muted)]">
        ← 返回见解列表
      </Link>
      <p className="mt-8 text-sm text-[var(--muted)]">
        {item.date} · {item.readingMinutes} min read
      </p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl">
        {item.title}
      </h1>
      <p className="mt-5 max-w-2xl text-[var(--muted)]">{item.excerpt}</p>
      <ArticleBody body={item.body} />
      <div className="mt-12">
        <Disclaimer />
      </div>
    </Container>
  );
}
