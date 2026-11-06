import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { MaterialGrid, PageIntro } from "@/components/catalog-ui";
import { getPublishedMaterials, getPublishedTopic } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };
export const instant = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const topic = await getPublishedTopic(slug);
  return topic ? { title: topic.name, description: topic.description || `المواد المنشورة ضمن موضوع ${topic.name} في فهرس منهاج.` } : { title: "الموضوع" };
}
export default async function TopicPage({ params }: Props) {
  const { slug } = await params; const topic = await getPublishedTopic(slug);
  if (!topic) notFound();
  const { items } = await getPublishedMaterials({ topicId: topic.id });
  return <><SiteHeader /><main id="main-content"><PageIntro eyebrow="موضوع" title={topic.name} description={topic.description || `المواد المنشورة المرتبطة بموضوع ${topic.name}.`} /><MaterialGrid materials={items} /></main><SiteFooter /></>;
}
