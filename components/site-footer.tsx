import { ArrowUpLeft, BookOpen } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-wrap footer-inner">
        <div className="footer-brand">
          <BookOpen size={21} aria-hidden="true" />
          <span>منهاج</span>
        </div>
        <p>فهرس مستقل للمحتوى التعليمي المنشور على YouTube.</p>
        <a href="#page-top" className="footer-top-link">
          العودة للأعلى <ArrowUpLeft size={16} aria-hidden="true" />
        </a>
        <small>معاينة أولية — المحتوى الظاهر تجريبي وغير منشور.</small>
      </div>
    </footer>
  );
}
