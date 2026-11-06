import Link from "next/link";
import { BookOpen, Search } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="site-header" id="page-top">
      <div className="section-wrap header-inner">
        <Link aria-label="منهاج — الصفحة الرئيسية" className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><BookOpen size={22} /></span>
          <span className="brand-copy">
            <strong>منهاج</strong>
            <span>رسالتي إحياء منهاج النبوة</span>
          </span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="main-nav">
          <Link href="#library">المكتبة</Link>
          <Link href="#pathways">مسارات البداية</Link>
          <Link href="#about">عن منهاج</Link>
        </nav>

        <a className="header-search" href="#library" aria-label="انتقل إلى معاينة البحث">
          <Search size={17} aria-hidden="true" />
          <span>ابحث في الفهرس</span>
        </a>
      </div>
    </header>
  );
}
