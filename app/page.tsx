import { Suspense } from "react";
import { io } from "next/cache";
import { ArrowLeft, ArrowUpLeft, BookOpen, Compass, Library, Play, ShieldCheck } from "lucide-react";
import { CatalogEmpty, MaterialGrid } from "@/components/catalog-ui";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteHeaderFromDatabase } from "@/components/site-header-from-db";
import { getPublishedMaterials, getPublishedPathways } from "@/lib/catalog";

export default function Home() {
  return <>
    <a className="skip-link" href="#main-content">انتقل إلى المحتوى</a>
    <section className="hero-shell" aria-labelledby="hero-title">
      <Suspense fallback={<SiteHeader variant="hero" />}><SiteHeaderFromDatabase /></Suspense>
      <div className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-mark" aria-hidden="true" />فهرس تعليمي مستقل</p>
          <h1 id="hero-title">المعرفة أقرب.<span>والبداية أذكى.</span></h1>
          <p className="hero-lede">اكتشف محتوى الشيخ أحمد السيد بسهولة. سلاسل ومحاضرات مرتبة ومداخل واضحة تساعدك على الوصول إلى ما تبحث عنه بسرعة.</p>
          <div className="hero-actions"><a className="button button-primary" href="/library">تصفح المكتبة <ArrowLeft size={18} /></a><a className="button button-secondary" href="/pathways">اكتشف مسارات التعلّم <Compass size={18} /></a></div>
          <p className="hero-motto">«رسالتي إحياء منهاج النبوة»</p>
        </div>
        <div className="hero-preview" aria-label="مبادئ فهرس منهاج">
          <div className="preview-glow" aria-hidden="true" />
          <div className="preview-topline"><span className="preview-icon"><BookOpen size={20} /></span><span className="preview-label">فهرس منظّم</span><span className="preview-number">منهاج</span></div>
          <div className="preview-content"><p className="preview-kicker">اكتشف · تعلّم · تابع</p><h2>رحلتك التعليمية، في مكان واحد</h2><p>وصول سريع إلى المواد المنشورة ومصدرها الأصلي.</p></div>
          <div className="preview-progress" aria-hidden="true"><span /><span /><span /></div>
          <div className="preview-bottomline"><span>مراجعة قبل النشر</span><ShieldCheck size={18} /></div>
        </div>
      </div>
    </section>
    <div className="trust-strip"><div className="section-wrap trust-inner"><span><BookOpen size={17} />فهرس للمحتوى المنشور</span><span><Play size={17} />المشاهدة من المصدر الأصلي</span><span><ShieldCheck size={17} />مراجعة قبل النشر</span></div></div>
    <Suspense fallback={<HomeSectionsFallback />}><HomeSections /></Suspense>
    <SiteFooter />
  </>;
}

async function HomeSections() {
  await io();
  const [{ items }, pathways] = await Promise.all([
    getPublishedMaterials({ from: 0, to: 5 }), getPublishedPathways(),
  ]);
  return <main id="main-content">
    <section className="content-section section-wrap" aria-labelledby="home-pathways-title">
      <div className="section-heading"><div className="section-heading-copy"><p className="eyebrow">خطوتك التالية</p><h2 id="home-pathways-title">مسارات تعلّم واضحة</h2><p className="section-description">ابدأ بمسار متدرج، أو انتقل مباشرة إلى المكتبة.</p></div><a className="text-link" href="/pathways">كل المسارات <ArrowLeft size={16} /></a></div>
      {pathways.length ? <div className="pathway-grid">{pathways.slice(0, 3).map((pathway, index) => <a className="pathway-card" href={`/pathways/${pathway.slug}`} key={pathway.id}><div className="pathway-card-top"><span className="pathway-icon"><Compass size={20} /></span><span className="pathway-number">{String(index + 1).padStart(2, "0")}</span></div><h3>{pathway.name}</h3><span className="pathway-link">ابدأ المسار <ArrowLeft size={16} /></span></a>)}</div> : <CatalogEmpty title="المسارات قيد الإعداد" description="تصفح المكتبة للوصول إلى المواد المنشورة حاليًا." />}
    </section>
    <section className="content-section home-library" aria-labelledby="home-library-title">
      <div className="section-wrap"><div className="section-heading"><div className="section-heading-copy"><p className="eyebrow">اكتشف وتعلّم</p><h2 id="home-library-title">من المكتبة</h2><p className="section-description">مواد منشورة ومراجعة، وروابطها تقودك إلى مصدرها.</p></div><a className="text-link" href="/library">افتح المكتبة <Library size={16} /></a></div><MaterialGrid materials={items} /></div>
    </section>
    <section className="about-section section-wrap" id="about"><div className="about-mark"><BookOpen size={24} /></div><div><p className="eyebrow">عن الفهرس</p><h2>المصدر هو المحتوى الأصلي.</h2><p>منهاج مشروع مستقل وغير رسمي ينظم الوصول إلى المواد المنشورة، ولا يستضيف التسجيلات.</p></div><a className="text-link" href="/about">عن منهاج <ArrowUpLeft size={17} /></a></section>
  </main>;
}

function HomeSectionsFallback() {
  return <main id="main-content"><section className="content-section section-wrap"><div className="section-heading"><div><p className="eyebrow">اكتشف وتعلّم</p><h2>من المكتبة</h2></div></div><p className="section-description">جارٍ تحميل المحتوى المنشور…</p></section></main>;
}
