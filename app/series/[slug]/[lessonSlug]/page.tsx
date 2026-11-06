import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getPublishedLesson } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string; lessonSlug: string }> };
export const instant = false;
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, lessonSlug } = await params; const entry = await getPublishedLesson(slug, lessonSlug);
  return entry ? { title: entry.lesson.title, description: entry.lesson.description || entry.lesson.summary || `شاهد ${entry.lesson.title} من سلسلة ${entry.series.title}.` } : { title: "المحاضرة" };
}
export default async function LessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params; const entry = await getPublishedLesson(slug, lessonSlug);
  if (!entry) notFound();
  const { lesson, series } = entry;
  return <><SiteHeader /><main id="main-content"><div className="breadcrumb section-wrap"><Link href="/series">السلاسل</Link><ArrowRight size={14} /><Link href={`/series/${series.slug}`}>{series.title}</Link><ArrowRight size={14} /><span>{lesson.title}</span></div><article className="lesson-detail section-wrap"><p className="eyebrow"><span className="eyebrow-mark" />من سلسلة {series.title}</p><h1>{lesson.title}</h1>{lesson.description && <p className="lesson-lede">{lesson.description}</p>}<div className="video-frame">{lesson.youtube_video_id ? <iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(lesson.youtube_video_id)}`} title={lesson.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen /> : <p>مشاهدة الفيديو غير متاحة حاليًا.</p>}</div>{lesson.summary && <section className="lesson-summary"><h2>عن المحاضرة</h2><p>{lesson.summary}</p></section>}<a className="text-link" href={lesson.youtube_url || `https://www.youtube.com/watch?v=${encodeURIComponent(lesson.youtube_video_id)}`} target="_blank" rel="noreferrer">فتح على YouTube <ExternalLink size={16} /></a></article></main><SiteFooter /></>;
}
