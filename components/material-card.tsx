import { Bookmark, BookOpen, Play } from "lucide-react";

type DemoMaterial = {
  kind: string;
  title: string;
  description: string;
  tag: string;
};

export function MaterialCard({ material }: { material: DemoMaterial }) {
  return (
    <article className="material-card">
      <div className="material-cover" aria-label="صورة تجريبية غير مرتبطة بمادة حقيقية">
        <span className="cover-demo-label">صورة تجريبية</span>
        <span className="cover-icon" aria-hidden="true"><BookOpen size={30} /></span>
        <span className="cover-play" aria-hidden="true"><Play size={14} fill="currentColor" /></span>
      </div>
      <div className="material-content">
        <div className="material-meta">
          <span className="material-kind">{material.kind}</span>
          <span className="demo-dot" aria-label="بيانات تجريبية" />
        </div>
        <h3>{material.title}</h3>
        <p className="material-description">{material.description}</p>
        <div className="material-card-bottom">
          <span className="topic-chip">{material.tag}</span>
          <button
            aria-label="الحفظ غير متاح في المعاينة"
            className="save-button"
            disabled
            title="ميزة الحفظ ستتاح لاحقًا"
            type="button"
          >
            <Bookmark size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
