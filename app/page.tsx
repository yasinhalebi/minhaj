import {
  ArrowLeft,
  ArrowUpLeft,
  BookOpen,
  Bookmark,
  Compass,
  Library,
  Play,
  Sparkles,
} from "lucide-react";
import { MaterialCard } from "@/components/material-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SectionHeading } from "@/components/section-heading";

const samplePathways = [
  { number: "01", title: "مسار تجريبي: أبدأ من الصفر", icon: Compass },
  { number: "02", title: "مسار تجريبي: أبني منهجي", icon: BookOpen },
  { number: "03", title: "مسار تجريبي: أستكشف موضوعًا", icon: Sparkles },
];

const sampleMaterials = [
  {
    kind: "سلسلة تجريبية",
    title: "عنوان سلسلة تجريبي",
    description: "هذا نص مؤقت لمعاينة شكل وصف المادة.",
    tag: "وسم تجريبي",
  },
  {
    kind: "محاضرة تجريبية",
    title: "عنوان محاضرة تجريبي",
    description: "يُضاف الوصف بعد مراجعة المادة ومصدرها.",
    tag: "وسم تجريبي",
  },
  {
    kind: "موضوع تجريبي",
    title: "اسم موضوع تجريبي",
    description: "بطاقة مؤقتة لعرض شكل عناصر المكتبة.",
    tag: "بيانات تجريبية",
  },
];

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        انتقل إلى المحتوى
      </a>
      <SiteHeader />

      <main id="main-content">
        <section className="hero-shell" aria-labelledby="hero-title">
          <div className="hero section-wrap">
            <div className="hero-copy">
              <p className="eyebrow">
                <span className="eyebrow-mark" aria-hidden="true" />
                فهرس تعليمي مستقل · واجهة تجريبية
              </p>
              <h1 id="hero-title">
                المعرفة أقرب.
                <span>والبداية أذكى.</span>
              </h1>
              <p className="hero-lede">
                اكتشف محتوى الشيخ أحمد السيد بسهولة. سلاسل ومحاضرات مرتبة،
                ومداخل واضحة تساعدك على الوصول إلى ما تبحث عنه بسرعة.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#pathways">
                  ابدأ من هنا <ArrowLeft size={18} aria-hidden="true" />
                </a>
                <a className="button button-secondary" href="#library">
                  تصفح المكتبة <Library size={18} aria-hidden="true" />
                </a>
              </div>
              <p className="hero-motto">«رسالتي إحياء منهاج النبوة»</p>
            </div>

            <div className="hero-preview" aria-label="بطاقة معاينة تجريبية لمسار تعليمي">
              <div className="preview-glow" aria-hidden="true" />
              <div className="preview-topline">
                <span className="preview-icon"><Compass size={20} aria-hidden="true" /></span>
                <span className="preview-label">مسار تعليمي</span>
                <span className="preview-number">معاينة</span>
              </div>
              <div className="preview-content">
                <p className="preview-kicker">خطوة 01 · تجريبية</p>
                <h2>عنوان خطوة تجريبية</h2>
                <p>تظهر هنا المواد المقترحة بعد مراجعة المحتوى واعتماده.</p>
              </div>
              <div className="preview-progress" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="preview-bottomline">
                <span>بيانات مؤقتة للمعاينة</span>
                <ArrowUpLeft size={18} aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="معلومات عن الفهرس">
          <div className="section-wrap trust-inner">
            <span><BookOpen size={17} aria-hidden="true" /> فهرس للمحتوى المنشور</span>
            <span><Play size={17} aria-hidden="true" /> المشاهدة من YouTube</span>
            <span><Bookmark size={17} aria-hidden="true" /> لا تُنشر مادة قبل مراجعتها</span>
          </div>
        </section>

        <section id="pathways" className="content-section section-wrap" aria-labelledby="pathways-title">
          <SectionHeading
            eyebrow="خطوتك التالية"
            title="اختر طريق البداية"
            description="مسارات مقترحة تساعدك على ترتيب الاكتشاف. البطاقات أدناه تجريبية وليست توصيات منشورة."
            id="pathways-title"
          />
          <div className="pathway-grid">
            {samplePathways.map(({ number, title, icon: Icon }) => (
              <a className="pathway-card" href="#library" key={number}>
                <div className="pathway-card-top">
                  <span className="pathway-icon"><Icon size={20} aria-hidden="true" /></span>
                  <span className="pathway-number">{number}</span>
                </div>
                <h3>{title}</h3>
                <span className="pathway-link">مثال للمعاينة <ArrowLeft size={16} aria-hidden="true" /></span>
              </a>
            ))}
          </div>
        </section>

        <section id="library" className="content-section library-section" aria-labelledby="library-title">
          <div className="section-wrap">
            <SectionHeading
              eyebrow="اكتشف وتعلّم"
              title="من المكتبة"
              description="ابحث بحسب النوع أو الموضوع عندما يصبح الفهرس متاحًا. المواد المعروضة هنا أمثلة شكلية فقط."
              id="library-title"
              action={<span className="demo-pill">بيانات تجريبية</span>}
            />
            <div className="library-toolbar" aria-label="أدوات المكتبة للمعاينة">
              <span className="search-preview"><Library size={18} aria-hidden="true" /> البحث والتصفية متاحان لاحقًا</span>
              <span className="toolbar-note">لا توجد مواد حقيقية بعد</span>
            </div>
            <div className="material-grid">
              {sampleMaterials.map((material, index) => (
                <MaterialCard key={`${material.kind}-${index}`} material={material} />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about-section section-wrap" aria-labelledby="about-title">
          <div className="about-mark" aria-hidden="true"><BookOpen size={24} /></div>
          <div>
            <p className="eyebrow">عن الفهرس</p>
            <h2 id="about-title">المصدر هو المحتوى الأصلي.</h2>
            <p>
              منهاج مشروع مستقل وغير رسمي. لا يستضيف التسجيلات؛ بل ينظم الوصول
              إلى المواد المنشورة على YouTube، مع إبقاء بيانات المواد غير المراجعة
              خارج النشر.
            </p>
          </div>
          <a className="text-link" href="#page-top">
            إلى الأعلى <ArrowUpLeft size={17} aria-hidden="true" />
          </a>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
