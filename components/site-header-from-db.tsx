import { io } from "next/cache";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { SiteHeader } from "@/components/site-header";

export async function SiteHeaderFromDatabase() {
  await io();
  const settings = await getPublicSiteSettings();
  return <SiteHeader siteName={settings.siteName} tagline={settings.tagline} variant="hero" />;
}
