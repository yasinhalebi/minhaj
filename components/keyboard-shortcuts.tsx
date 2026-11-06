"use client";

import { useEffect } from "react";

export function KeyboardShortcuts() {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      const input = document.getElementById("catalog-search") as HTMLInputElement | null;
      if (input) { input.focus(); input.select(); }
      else window.location.assign("/library?focus=1");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  return null;
}
