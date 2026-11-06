"use client";

import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";

const KEY = "minhaj:saved";
function readSaved() {
  try { const value = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []; }
  catch { return []; }
}

export function SaveMaterialButton({ id }: { id: string }) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const sync = () => setSaved(readSaved().includes(id));
    sync(); window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync);
  }, [id]);
  return <button className={`catalog-save${saved ? " is-saved" : ""}`} type="button" aria-label={saved ? "إزالة من المحفوظات" : "حفظ المادة"} aria-pressed={saved} title={saved ? "إزالة من المحفوظات" : "حفظ المادة"} onClick={() => {
    const current = readSaved(); const next = current.includes(id) ? current.filter((value) => value !== id) : [...current, id];
    localStorage.setItem(KEY, JSON.stringify(next)); setSaved(next.includes(id));
  }}><Bookmark size={17} fill={saved ? "currentColor" : "none"} /></button>;
}
