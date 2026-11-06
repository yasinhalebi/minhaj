import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageIntro } from "@/components/catalog-ui";
import { SavedMaterials } from "@/components/saved-materials";
import { getPublishedMaterials } from "@/lib/catalog";

export const metadata: Metadata = { title: "المحفوظات", description: "المواد التي حفظتها على هذا الجهاز." };
export const instant = false;
export default async function SavedPage() {
  const { items } = await getPublishedMaterials({ from: 0, to: 999 });
  return <><SiteHeader /><main id="main-content"><PageIntro eyebrow="على هذا الجهاز" title="المحفوظات" description="موادك المحفوظة تبقى في متصفح هذا الجهاز." /><SavedMaterials materials={items} /></main><SiteFooter /></>;
}
