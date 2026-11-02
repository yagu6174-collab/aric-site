"use client";

import { AboutArchive } from "@/components/about/AboutArchive";
import { ContactArchive } from "@/components/contact/ContactArchive";
import { EditModeProvider, type AddKind, type PreviewPage } from "@/components/edit/mode";
import { HomeView } from "@/components/home/HomeView";
import { InsightArticle } from "@/components/insights/InsightArticle";
import { InsightsBoard } from "@/components/insights/InsightsBoard";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { I18nProvider } from "@/i18n/provider";
import { colorVars, presentDraft, type SiteDraft } from "@/lib/draft";

export function SitePreview({
  draft,
  page,
  selected,
  onSelect,
  onAdd,
}: {
  draft: SiteDraft;
  page: PreviewPage;
  selected: string | null;
  onSelect: (id: string) => void;
  onAdd: (kind: AddKind) => void;
}) {
  const model = presentDraft(draft);
  const reading = model.insights.find((item) => selected === `insight:${item.id}`) ?? model.insights[0] ?? null;

  return (
    <EditModeProvider value={{ selected, onSelect, onAdd, page }}>
      <I18nProvider source={model.copy} lockLocale="zh-CN">
        <div className="edit-stage" style={colorVars(model.colors)}>
          <Header />
          {page === "home" ? <HomeView insights={model.insights} /> : null}
          {page === "insights" ? <InsightsBoard items={model.insights} /> : null}
          {page === "about" ? <AboutArchive about={model.about} portraitUrl={model.images.portraitUrl} /> : null}
          {page === "contact" ? <ContactArchive site={model.profile} qrUrl={model.images.qrUrl} /> : null}
          {page === "reading" && reading ? <InsightArticle item={reading} /> : null}
          {page === "reading" && !reading ? (
            <p className="shell page lede">还没有文章。</p>
          ) : null}
          <Footer site={model.profile} />
        </div>
      </I18nProvider>
    </EditModeProvider>
  );
}
