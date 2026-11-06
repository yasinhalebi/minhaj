import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, Play, Search } from "lucide-react";
import type { Material } from "@/lib/catalog";
import { SaveMaterialButton } from "@/components/save-material-button";

const kindNames: Record<string, string> = {
  series: "سلسلة", lecture: "محاضرة", playlist: "قائمة تشغيل", podcast: "بودكاست",
  topic: "موضوع", book: "كتاب", summary: "ملخص",
};

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="catalog-intro section-wrap"><p className="eyebrow"><span className="eyebrow-mark" />{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}

export function CatalogEmpty({ title = "لا توجد مواد منشورة هنا بعد", description = "ستظهر المواد هنا بعد مراجعتها ونشرها من لوحة الإدارة." }: { title?: string; description?: string }) {
  return <div className="catalog-empty section-wrap"><span className="empty-orbit"><BookOpen size={25} /></span><h2>{title}</h2><p>{description}</p><Link className="text-link" href="/library">استكشف المكتبة <ArrowLeft size={16} /></Link></div>;
}

export function MaterialGrid({ materials }: { materials: Material[] }) {
  if (!materials.length) return <CatalogEmpty />;
  return <div className="catalog-grid section-wrap">{materials.map((item) => {
    const href = item.kind === "series" ? `/series/${item.slug}` : item.source_url || (item.youtube_video_id ? `https://www.youtube.com/watch?v=${encodeURIComponent(item.youtube_video_id)}` : "#");
    const external = href.startsWith("https://") || href.startsWith("http://");
    return <article className="catalog-item" key={item.id}>
      <Link href={href} className="catalog-cover" aria-label={`افتح ${item.title}`} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
        {item.thumbnail_url ? <span className="catalog-cover-image" style={{ backgroundImage: `url("${item.thumbnail_url.replace(/["\\]/g, "")}")` }} /> : <span className="catalog-cover-art"><span className="cover-glow" /><BookOpen size={32} /></span>}
        <span className="catalog-play"><Play size={14} fill="currentColor" /></span>
      </Link>
      <div className="catalog-item-body"><div className="catalog-item-heading"><p className="catalog-kicker">{item.material_type || kindNames[item.kind] || "مادة"}</p><SaveMaterialButton id={item.id} /></div><h2><Link href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{item.title}</Link></h2><p className="catalog-description">{item.short_description || item.description || ""}</p><div className="catalog-topics">{(item.topics ?? []).slice(0, 2).map(({ topic }) => <Link key={topic.id} href={`/topic/${topic.slug}`}>{topic.name}</Link>)}</div></div>
    </article>;
  })}</div>;
}

export function CatalogSearch({ query = "", kind = "", topic = "", topics = [], focus = false }: { query?: string; kind?: string; topic?: string; topics?: { id: string; slug: string; name: string }[]; focus?: boolean }) {
  return <form className="catalog-search section-wrap" action="/library">
    <label className="catalog-search-field"><Search size={19} /><span className="sr-only">ابحث في المواد</span><input id="catalog-search" name="q" autoFocus={focus} defaultValue={query} placeholder="ابحث عن سلسلة أو محاضرة…" /></label>
    <label className="sr-only" htmlFor="catalog-kind">نوع المادة</label><select id="catalog-kind" name="kind" defaultValue={kind}><option value="">كل الأنواع</option><option value="series">سلاسل</option><option value="lecture">محاضرات</option><option value="playlist">قوائم تشغيل</option><option value="podcast">بودكاست</option><option value="book">كتب</option><option value="summary">ملخصات</option></select>
    <label className="sr-only" htmlFor="catalog-topic">الموضوع</label><select id="catalog-topic" name="topic" defaultValue={topic}><option value="">كل الموضوعات</option>{topics.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select>
    <button className="button button-primary" type="submit">بحث <ArrowLeft size={17} /></button>
  </form>;
}

export function Pager({ page, pages, query }: { page: number; pages: number; query: string }) {
  if (pages < 2) return null;
  const link = (number: number) => `/library?page=${number}${query ? `&${query}` : ""}`;
  return <nav className="catalog-pager section-wrap" aria-label="صفحات النتائج">{page > 1 ? <Link href={link(page - 1)}>السابق</Link> : <span />}{Array.from({ length: pages }, (_, i) => i + 1).map((number) => <Link aria-current={number === page ? "page" : undefined} href={link(number)} key={number}>{number}</Link>)}{page < pages ? <Link href={link(page + 1)}>التالي</Link> : <span />}</nav>;
}

export function PathwayEmpty() {
  return <div className="catalog-empty section-wrap"><span className="empty-orbit"><Compass size={25} /></span><h2>المسارات قيد الإعداد</h2><p>ستُنشر المسارات التعليمية بعد مراجعة ترتيبها وموادها.</p><Link className="text-link" href="/library">تصفح المواد المنشورة <ArrowLeft size={16} /></Link></div>;
}
