import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/catalog";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = await getSiteOrigin();
  return { rules: { userAgent: "*", allow: "/" }, ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}) };
}
