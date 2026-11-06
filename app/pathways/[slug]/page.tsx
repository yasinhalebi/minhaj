import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PageIntro } from "@/components/catalog-ui";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type Props = { params: Promise<{ slug: string }> };
export const instant = false;
type PathwayDetail = {
  slug: string; name: string; description: string | null; audience: string | null;
  pathway_steps: { position: number; title: string; description: string | null; material: { slug: string; title: string; status: string }[] }[];
};
async function getPathway(slug: string) {
  const db = createSupabaseAdminClient(); if (!db) return null;
  const { data, error } = await db.from("pathways").select("id, slug, name, description, audience, pathway_steps(position, title, description, material:materials(slug, title, status))").eq("slug", slug).eq("status", "published").maybeSingle();
  if (error && process.env.NODE_ENV !== "production") console.error(`Supabase pathway query failed (${error.code}).`);
  return error ? null : data as unknown as PathwayDetail | null;
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const pathway = await getPathway(slug);
  return pathway ? { title: pathway.name, description: pathway.description || `مسار ${pathway.name} في منهاج.` } : { title: "المسار" };
}
export default async function PathwayPage({ params }: Props) {
  const { slug } = await params; const pathway = await getPathway(slug); if (!pathway) notFound();
  const steps = [...(pathway.pathway_steps ?? [])].sort((a, b) => a.position - b.position);
  return <><SiteHeader /><main id="main-content"><div className="breadcrumb section-wrap"><Link href="/pathways">المسارات</Link><ArrowRight size={14} /><span>{pathway.name}</span></div><PageIntro eyebrow="مسار تعليمي" title={pathway.name} description={pathway.description || pathway.audience || "رحلة تعلم مرتبة."} /><ol className="pathway-steps section-wrap">{steps.map((step) => { const material = step.material?.[0]; return <li key={step.position}><span className="step-number">{String(step.position).padStart(2, "0")}</span><div><h2>{step.title}</h2>{step.description && <p>{step.description}</p>}{material?.status === "published" && <Link className="text-link" href={`/series/${material.slug}`}>{material.title} <ArrowRight size={15} /></Link>}</div></li>; })}</ol></main><SiteFooter /></>;
}
