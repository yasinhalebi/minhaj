import type { MetadataRoute } from "next";
import { getPublishedLessons, getPublishedMaterials, getPublishedPathways, getPublishedTopics, getSiteOrigin } from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = await getSiteOrigin();
  if (!origin || origin.endsWith(".example")) return [];
  const [materials, topics, pathways] = await Promise.all([
    getPublishedMaterials(), getPublishedTopics(), getPublishedPathways(),
  ]);
  const series = materials.items.filter((item) => item.kind === "series");
  const lessons = await Promise.all(series.map(async (item) => ({ series: item, lessons: await getPublishedLessons(item.id) })));
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    ...["library", "pathways", "about"].map((path) => ({ url: `${origin}/${path}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...topics.map((topic) => ({ url: `${origin}/topic/${topic.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...pathways.map((pathway) => ({ url: `${origin}/pathways/${pathway.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...materials.items.filter((item) => item.kind === "series").map((series) => ({ url: `${origin}/series/${series.slug}`, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...lessons.flatMap(({ series: parent, lessons: entries }) => entries.map((lesson) => ({ url: `${origin}/series/${parent.slug}/${lesson.slug}`, changeFrequency: "monthly" as const, priority: 0.5 }))),
  ];
}
