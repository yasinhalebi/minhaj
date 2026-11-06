import Link from "next/link";
import { BookOpen, Search } from "lucide-react";

type SiteHeaderProps = {
  siteName?: string;
  tagline?: string;
  variant?: "light" | "hero";
};

export function SiteHeader({
  siteName = "منهاج",
  tagline = "رسالتي إحياء منهاج النبوة",
  variant = "light",
}: SiteHeaderProps) {
  return (
    <header className={`site-header${variant === "hero" ? " site-header--hero" : ""}`} id="page-top">
      <div className="section-wrap header-inner">
        <Link aria-label="منهاج — الصفحة الرئيسية" className="brand" href="/">
          <span className="brand-mark" aria-hidden="true"><BookOpen size={22} /></span>
          <span className="brand-copy">
            <strong>{siteName}</strong>
            <span>{tagline}</span>
          </span>
        </Link>

        <nav aria-label="التنقل الرئيسي" className="main-nav">
          <Link href="/library">المكتبة</Link>
          <Link href="/pathways">مسارات البداية</Link>
          <Link href="/about">عن منهاج</Link>
          <Link href="/saved">المحفوظات</Link>
        </nav>

        <Link className="header-search" href="/library" aria-label="ابحث في الفهرس">
          <Search size={17} aria-hidden="true" />
          <span>ابحث في الفهرس</span>
        </Link>
      </div>
    </header>
  );
}
