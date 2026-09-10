import { SkillTags } from "@/components/about/SkillTags";
import { StorySplit } from "@/components/about/StorySplit";
import { Timeline } from "@/components/about/Timeline";
import { Container } from "@/components/ui/Container";
import { getAbout } from "@/lib/content";

export default async function AboutPage() {
  const about = await getAbout();

  return (
    <Container className="py-16">
      <h1 className="mb-12 font-serif text-4xl sm:text-5xl">关于与履历</h1>
      <StorySplit story={about.story} />
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Timeline title="教育背景" items={about.education} />
        <Timeline title="职业履历" items={about.career} />
      </div>
      <SkillTags skills={about.skills} />
    </Container>
  );
}
