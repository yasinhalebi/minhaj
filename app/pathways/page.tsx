import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageIntro, PathwayEmpty } from "@/components/catalog-ui";
import { getPublishedPathways } from "@/lib/catalog";

export const metadata: Metadata = { title: "مسارات التعلّم", description: "مسارات مرتبة لاكتشاف المحتوى التعليمي المنشور في منهاج." };
export const instant = false;
export default async function PathwaysPage() {
  const pathways = await getPublishedPathways();
  return <><SiteHeader /><main id="main-content"><PageIntro eyebrow="تعلّم بخطوات" title="مسارات التعلّم" description="خطط متدرجة تربط المواد المنشورة وتساعدك على بناء رحلة تعلم واضحة." />{pathways.length ? <div className="pathway-list section-wrap">{pathways.map((pathway, i) => <Link href={`/pathways/${pathway.slug}`} key={pathway.id} className="pathway-row"><span className="empty-orbit"><Compass size={21} /></span><span><strong>{pathway.name}</strong><small>{pathway.description || pathway.audience || "مسار تعليمي منشور"}</small></span><span className="pathway-number">{String(i + 1).padStart(2, "0")}</span><ArrowLeft size={17} /></Link>)}</div> : <PathwayEmpty />}</main><SiteFooter /></>;
}
