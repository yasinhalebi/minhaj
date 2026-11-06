import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type Topic = { id: string; slug: string; name: string; description: string | null };
export type Material = {
  id: string;
  slug: string;
  title: string;
  short_description: string | null;
  description: string | null;
  kind: string;
  material_type: string | null;
  thumbnail_url: string | null;
  source_url: string | null;
  youtube_video_id: string | null;
  youtube_playlist_id: string | null;
  topics?: { topic: Topic }[];
};
export type Lesson = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  summary: string | null;
  youtube_url: string | null;
  youtube_video_id: string;
  duration_seconds: number | null;
  thumbnail_url: string | null;
  sort_order: number;
};
export type Pathway = { id: string; slug: string; name: string; description: string | null; audience: string | null };

function report(error: { code?: string } | null, source: string) {
  if (error && process.env.NODE_ENV !== "production") {
    console.error(`Supabase ${source} query failed (${error.code ?? "unknown"}).`);
  }
}

export async function getPublishedMaterials(options: {
  kind?: string; topicId?: string; search?: string; from?: number; to?: number;
} = {}) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return { items: [] as Material[], count: 0 };
  const columns = options.topicId
    ? "id, slug, title, short_description, description, kind, material_type, thumbnail_url, source_url, youtube_video_id, youtube_playlist_id, topics:material_topics!inner(topic:topics(id, slug, name, description))"
    : "id, slug, title, short_description, description, kind, material_type, thumbnail_url, source_url, youtube_video_id, youtube_playlist_id, topics:material_topics(topic:topics(id, slug, name, description))";
  let query = supabase.from("materials")
    .select(columns, { count: "exact" })
    .eq("status", "published").order("sort_order").order("title");
  if (options.kind) query = query.eq("kind", options.kind);
  if (options.search) query = query.ilike("title", `%${options.search.replace(/[%_,]/g, " ")}%`);
  if (options.topicId) query = query.eq("material_topics.topic_id", options.topicId);
  if (options.from !== undefined && options.to !== undefined) query = query.range(options.from, options.to);
  const { data, error, count } = await query;
  report(error, "materials");
  return { items: (error ? [] : (data ?? [])) as unknown as Material[], count: count ?? 0 };
}

export async function getPublishedSeries(slug: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("materials")
    .select("id, slug, title, short_description, description, kind, material_type, thumbnail_url, source_url, youtube_video_id, youtube_playlist_id, topics:material_topics(topic:topics(id, slug, name, description))")
    .eq("slug", slug).eq("kind", "series").eq("status", "published").maybeSingle();
  report(error, "series");
  return error ? null : data as unknown as Material | null;
}

export async function getPublishedLessons(seriesId: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [] as Lesson[];
  const { data, error } = await supabase.from("lessons")
    .select("id, slug, title, description, summary, youtube_url, youtube_video_id, duration_seconds, thumbnail_url, sort_order")
    .eq("series_id", seriesId).eq("status", "published").order("sort_order");
  report(error, "lessons");
  return error ? [] : (data ?? []) as Lesson[];
}

export async function getPublishedLesson(seriesSlug: string, lessonSlug: string) {
  const series = await getPublishedSeries(seriesSlug);
  if (!series) return null;
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("lessons")
    .select("id, slug, title, description, summary, youtube_url, youtube_video_id, duration_seconds, thumbnail_url, sort_order")
    .eq("series_id", series.id).eq("slug", lessonSlug).eq("status", "published").maybeSingle();
  report(error, "lesson");
  return error || !data ? null : { lesson: data as Lesson, series };
}

export async function getPublishedTopics() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [] as Topic[];
  const { data, error } = await supabase.from("topics")
    .select("id, slug, name, description").eq("status", "published").order("sort_order").order("name");
  report(error, "topics");
  return error ? [] : (data ?? []) as Topic[];
}

export async function getPublishedTopic(slug: string) {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return null;
  const { data, error } = await supabase.from("topics")
    .select("id, slug, name, description").eq("slug", slug).eq("status", "published").maybeSingle();
  report(error, "topic");
  return error ? null : data as Topic | null;
}

export async function getPublishedPathways() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) return [] as Pathway[];
  const { data, error } = await supabase.from("pathways")
    .select("id, slug, name, description, audience").eq("status", "published").order("sort_order").order("name");
  report(error, "pathways");
  return error ? [] : (data ?? []) as Pathway[];
}

export async function getSiteOrigin() {
  const supabase = createSupabaseAdminClient();
  if (supabase) {
    const { data } = await supabase.from("site_settings").select("value").eq("key", "site_url").maybeSingle();
    if (typeof data?.value === "string" && data.value.startsWith("https://")) return data.value.replace(/\/$/, "");
  }
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  return env?.startsWith("https://") ? env.replace(/\/$/, "") : "";
}
