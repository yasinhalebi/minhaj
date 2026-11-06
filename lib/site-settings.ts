import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type PublicSiteSettings = {
  siteName: string;
  tagline: string;
};

const fallbackSettings: PublicSiteSettings = {
  siteName: "منهاج",
  tagline: "رسالتي إحياء منهاج النبوة",
};

function readTextSetting(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return fallbackSettings;

  const { data, error } = await supabase
    .from("site_settings")
    .select("key, value")
    .in("key", ["site_name", "site_tagline"]);

  if (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`Supabase site settings query failed (${error.code}).`);
    }
    return fallbackSettings;
  }

  const values = new Map<string, unknown>(
    (data ?? []).map((row) => [row.key, row.value]),
  );

  return {
    siteName: readTextSetting(values.get("site_name"), fallbackSettings.siteName),
    tagline: readTextSetting(values.get("site_tagline"), fallbackSettings.tagline),
  };
}
