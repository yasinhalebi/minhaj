import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { CatalogEmpty, PageIntro } from "@/components/catalog-ui";
import { getPublishedLessons, getPublishedSeries } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };
export const instant = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const series = await getPublishedSeries(slug);
  return series ? { title: series.title, description: series.short_description || series.description || `حلقات سلسلة ${series.title} المنشورة في منهاج.` } : { title: "السلسلة" };
}
export default async function SeriesPage({ params }: Props) {
  const { slug } = await params; const series = await getPublishedSeries(slug);
  if (!series) notFound();
  const lessons = await getPublishedLessons(series.id);
  return <><SiteHeader /><main id="main-content"><div className="breadcrumb section-wrap"><Link href="/library">المكتبة</Link><ArrowRight size={14} /><span>السلاسل</span></div><PageIntro eyebrow="سلسلة منشورة" title={series.title} description={series.short_description || series.description || "تصفح حلقات هذه السلسلة."} />{series.youtube_playlist_id && <div className="series-source section-wrap"><a className="button button-primary" href={series.source_url || `https://www.youtube.com/playlist?list=${encodeURIComponent(series.youtube_playlist_id)}`} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor" /> مشاهدة السلسلة على YouTube</a></div>}<section className="lesson-list section-wrap" aria-label="حلقات السلسلة">{lessons.length ? lessons.map((lesson, index) => <Link className="lesson-row" href={`/series/${series.slug}/${lesson.slug}`} key={lesson.id}><span className="lesson-index">{String(index + 1).padStart(2, "0")}</span><span className="lesson-copy"><strong>{lesson.title}</strong><small>{lesson.description || lesson.summary || ""}</small></span><span className="lesson-action"><Play size={15} fill="currentColor" /></span></Link>) : <CatalogEmpty title="لا توجد حلقات منشورة بعد" description="ستظهر الحلقات هنا بعد مراجعتها ونشرها." />}</section></main><SiteFooter /></>;
}
