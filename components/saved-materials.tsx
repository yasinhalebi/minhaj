"use client";

import { useEffect, useState } from "react";
import type { Material } from "@/lib/catalog";
import { CatalogEmpty, MaterialGrid } from "@/components/catalog-ui";

export function SavedMaterials({ materials }: { materials: Material[] }) {
  const [savedIds, setSavedIds] = useState<string[] | null>(null);
  useEffect(() => {
    const sync = () => {
      try { const value = JSON.parse(localStorage.getItem("minhaj:saved") || "[]"); setSavedIds(Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []); }
      catch { setSavedIds([]); }
    };
    sync(); window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync);
  }, []);
  if (savedIds === null) return <div className="catalog-empty section-wrap" aria-live="polite"><p>جارٍ تحميل محفوظاتك…</p></div>;
  const saved = materials.filter((item) => savedIds.includes(item.id));
  return saved.length ? <MaterialGrid materials={saved} /> : <CatalogEmpty title="لم تحفظ أي مادة بعد" description="استخدم علامة الحفظ على أي مادة للعودة إليها بسهولة." />;
}
