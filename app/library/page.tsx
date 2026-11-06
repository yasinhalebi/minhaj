import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CatalogSearch, MaterialGrid, PageIntro, Pager } from "@/components/catalog-ui";
import { getPublishedMaterials, getPublishedTopics } from "@/lib/catalog";

export const metadata: Metadata = { title: "المكتبة", description: "تصفح المواد التعليمية المنشورة في فهرس منهاج." };
export const instant = false;
const pageSize = 12;
type Props = { searchParams: Promise<{ q?: string; kind?: string; topic?: string; page?: string; focus?: string }> };

export default async function LibraryPage({ searchParams }: Props) {
  const params = await searchParams;
  const topics = await getPublishedTopics();
  const matchingTopic = params.topic ? topics.find((item) => item.slug === params.topic) : undefined;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const { items, count } = params.topic && !matchingTopic ? { items: [], count: 0 } : await getPublishedMaterials({
    search: params.q?.trim() || undefined,
    kind: params.kind || undefined,
    topicId: matchingTopic?.id,
    from: (requestedPage - 1) * pageSize,
    to: requestedPage * pageSize - 1,
  });
  const pages = Math.ceil(count / pageSize);
  const page = pages ? Math.min(requestedPage, pages) : 1;
  return <><SiteHeader /><main id="main-content"><PageIntro eyebrow="الفهرس" title="المكتبة" description="مواد منشورة ومراجعة، مرتبة لتصل إلى ما تبحث عنه بسرعة." /><CatalogSearch query={params.q} kind={params.kind} topic={params.topic} topics={topics} focus={params.focus === "1"} /><div className="catalog-results"><p className="catalog-count section-wrap">{count ? `${count} مادة منشورة` : "لا توجد نتائج منشورة"}</p><MaterialGrid materials={items} /><Pager page={page} pages={pages} query={[params.q && `q=${encodeURIComponent(params.q)}`, params.kind && `kind=${encodeURIComponent(params.kind)}`, params.topic && `topic=${encodeURIComponent(params.topic)}`].filter(Boolean).join("&")} /></div></main><SiteFooter /></>;
}
