#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const CHANNEL_ID = "UC7AbKZa30XPMInZIsViiBOQ";
const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const API_KEY_NAME = "YOUTUBE_DATA_API_KEY";
const ENV_PATH = path.join(process.cwd(), ".env.local");

function printHelp() {
  console.log(`منهاج — أداة استيراد YouTube (تعمل على الخادم المحلي)

الأوامر:
  node scripts/youtube-import.mjs list-playlists
  node scripts/youtube-import.mjs inspect-playlist <معرّف-القائمة-أو-رابطها>
  node scripts/youtube-import.mjs import --playlists <ID,ID,...> [--apply]

الاستيراد معاينة فقط افتراضيًا. أضف --apply لكتابة بيانات YouTube المحددة
إلى Supabase بحالة imported. لا تُنشَر أي مادة تلقائيًا.

المتغيرات المحلية المطلوبة عند التطبيق:
  ${API_KEY_NAME} في .env.local
  NEXT_PUBLIC_SUPABASE_URL و SUPABASE_SECRET_KEY في .env.local

تذكير: بيانات YouTube API المسترجعة يجب تحديثها أو حذفها خلال 30 يومًا.
أعد تشغيل أمر import دوريًا لتحديث بيانات السلاسل والحلقات المختارة.`);
}

async function readLocalEnv(name) {
  if (process.env[name]?.trim()) return process.env[name].trim();
  let contents;
  try { contents = await readFile(ENV_PATH, "utf8"); }
  catch { return ""; }
  for (const line of contents.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (!match || match[1] !== name) continue;
    let value = match[2];
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    return value.trim();
  }
  return "";
}

async function requireYouTubeKey() {
  const key = await readLocalEnv(API_KEY_NAME);
  if (!key) throw new Error(`أضف ${API_KEY_NAME} إلى .env.local محليًا ثم أعد المحاولة. لا ترسل المفتاح في المحادثة.`);
  return key;
}

async function youtube(endpoint, params = {}) {
  const key = await requireYouTubeKey();
  const url = new URL(`${YOUTUBE_API}/${endpoint}`);
  for (const [name, value] of Object.entries({ ...params, key })) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(name, String(value));
  }
  let response;
  try { response = await fetch(url, { headers: { accept: "application/json" } }); }
  catch { throw new Error("تعذر الاتصال بخدمة YouTube Data API. تحقق من الشبكة وإعداد المفتاح."); }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const reason = payload?.error?.errors?.[0]?.reason || `HTTP ${response.status}`;
    const message = payload?.error?.message || "تعذر جلب بيانات YouTube.";
    throw new Error(`YouTube Data API (${reason}): ${message}`);
  }
  return payload;
}

function playlistIdFrom(value) {
  try {
    const url = new URL(value);
    const id = url.searchParams.get("list");
    if (id) return id;
  } catch { /* the input may be a playlist ID */ }
  if (/^[A-Za-z0-9_-]{10,80}$/.test(value)) return value;
  throw new Error(`معرّف أو رابط قائمة التشغيل غير صالح: ${value}`);
}

async function listChannelPlaylists() {
  const playlists = [];
  let pageToken;
  do {
    const result = await youtube("playlists", {
      part: "snippet,contentDetails,status", channelId: CHANNEL_ID, maxResults: 50, pageToken,
    });
    playlists.push(...(result.items ?? []));
    pageToken = result.nextPageToken;
  } while (pageToken);
  return playlists;
}

async function getPlaylist(id) {
  const result = await youtube("playlists", { part: "snippet,contentDetails,status", id, maxResults: 1 });
  const playlist = result.items?.[0];
  if (!playlist) throw new Error(`لم يُعثر على قائمة التشغيل ${id}.`);
  if (playlist.snippet?.channelId !== CHANNEL_ID) throw new Error(`القائمة ${id} ليست من القناة المعتمدة.`);
  return playlist;
}

async function getPlaylistItems(playlistId) {
  const items = [];
  let pageToken;
  do {
    const result = await youtube("playlistItems", {
      part: "snippet,contentDetails", playlistId, maxResults: 50, pageToken,
    });
    items.push(...(result.items ?? []));
    pageToken = result.nextPageToken;
  } while (pageToken);
  return items;
}

function durationToSeconds(value) {
  if (typeof value !== "string") return null;
  const match = value.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
  if (!match) return null;
  const [, days = "0", hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(days) * 86400 + Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

function bestThumbnail(thumbnails) {
  return thumbnails?.maxres?.url || thumbnails?.standard?.url || thumbnails?.high?.url || thumbnails?.medium?.url || thumbnails?.default?.url || null;
}

async function enrichPlaylistItems(items) {
  const unique = new Map();
  for (const item of items) {
    const videoId = item.contentDetails?.videoId;
    if (videoId && !unique.has(videoId)) unique.set(videoId, item);
  }
  const entries = [...unique.values()];
  const details = new Map();
  for (let index = 0; index < entries.length; index += 50) {
    const ids = entries.slice(index, index + 50).map((item) => item.contentDetails.videoId);
    if (!ids.length) continue;
    const result = await youtube("videos", { part: "snippet,contentDetails", id: ids.join(",") });
    for (const video of result.items ?? []) details.set(video.id, video);
  }
  return entries.map((item, index) => {
    const videoId = item.contentDetails.videoId;
    const video = details.get(videoId);
    const snippet = video?.snippet || item.snippet || {};
    return {
      videoId,
      title: snippet.title || `فيديو ${videoId}`,
      position: Number.isInteger(item.snippet?.position) ? item.snippet.position : index,
      durationSeconds: durationToSeconds(video?.contentDetails?.duration),
      thumbnailUrl: bestThumbnail(video?.snippet?.thumbnails || item.snippet?.thumbnails),
      youtubeUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
    };
  }).sort((a, b) => a.position - b.position);
}

function showPlaylists(playlists) {
  if (!playlists.length) {
    console.log("لم تُعثر على قوائم عامة للقناة عبر API المفتاح الحالي.");
    return;
  }
  console.log(`قوائم القناة: ${playlists.length}\n`);
  for (const [index, playlist] of playlists.entries()) {
    const title = playlist.snippet?.title || "بلا عنوان";
    const count = playlist.contentDetails?.itemCount ?? "؟";
    const privacy = playlist.status?.privacyStatus || "غير معروف";
    console.log(`${String(index + 1).padStart(2, "0")}. ${title}`);
    console.log(`    playlistId: ${playlist.id} · الحلقات: ${count} · الخصوصية: ${privacy}`);
    console.log(`    https://www.youtube.com/playlist?list=${encodeURIComponent(playlist.id)}`);
  }
  console.log("\nاختر خمس قوائم بعد مراجعتها، ثم مرر معرّفاتها إلى أمر import.");
}

async function getSupabaseConfig() {
  const [url, key] = await Promise.all([readLocalEnv("NEXT_PUBLIC_SUPABASE_URL"), readLocalEnv("SUPABASE_SECRET_KEY")]);
  if (!url || !key) throw new Error("أضف NEXT_PUBLIC_SUPABASE_URL وSUPABASE_SECRET_KEY إلى .env.local. لا ترسل المفتاح السري في المحادثة.");
  return { url: url.replace(/\/$/, ""), key };
}

async function supabaseRequest(config, table, { method = "GET", query = {}, body, prefer } = {}) {
  const url = new URL(`${config.url}/rest/v1/${table}`);
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, String(value));
  const headers = {
    apikey: config.key,
    authorization: `Bearer ${config.key}`,
    accept: "application/json",
  };
  if (body !== undefined) headers["content-type"] = "application/json";
  if (prefer) headers.prefer = prefer;
  let response;
  try { response = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }); }
  catch { throw new Error("تعذر الاتصال بـ Supabase. تحقق من إعدادات المشروع والشبكة."); }
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const code = payload?.code || `HTTP ${response.status}`;
    throw new Error(`طلب Supabase إلى جدول ${table} فشل (${code}). لم تُطبع بيانات الاتصال.`);
  }
  return payload;
}

function parseOptions(args) {
  const options = { apply: false, playlists: [] };
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === "--apply") options.apply = true;
    else if (args[index] === "--dry-run") options.apply = false;
    else if (args[index] === "--playlists") {
      const value = args[++index];
      if (!value) throw new Error("أضف قائمة المعرّفات بعد --playlists.");
      options.playlists.push(...value.split(",").map((entry) => playlistIdFrom(entry.trim())));
    } else throw new Error(`خيار غير معروف: ${args[index]}`);
  }
  options.playlists = [...new Set(options.playlists)];
  if (!options.playlists.length) throw new Error("حدد قائمة واحدة على الأقل باستخدام --playlists.");
  return options;
}

async function importPlaylists(options) {
  const plans = [];
  for (const id of options.playlists) {
    const playlist = await getPlaylist(id);
    const playlistItems = await getPlaylistItems(id);
    const lessons = await enrichPlaylistItems(playlistItems);
    plans.push({ playlist, lessons });
  }

  console.log(`${options.apply ? "تطبيق الاستيراد" : "معاينة فقط — لم تُكتب أي بيانات"}`);
  for (const { playlist, lessons } of plans) {
    console.log(`\n${playlist.snippet?.title || "بلا عنوان"} · ${playlist.id}`);
    console.log(`الحلقات القابلة للاستيراد: ${lessons.length}`);
    for (const lesson of lessons.slice(0, 8)) console.log(`  ${lesson.position + 1}. ${lesson.title}${lesson.durationSeconds === null ? " · المدة غير متاحة" : ` · ${lesson.durationSeconds} ث`}`);
    if (lessons.length > 8) console.log(`  … و${lessons.length - 8} حلقة أخرى`);
  }
  if (!options.apply) {
    console.log("\nلم تُكتب أي بيانات. بعد اعتماد المعاينة أعد الأمر نفسه مع --apply.");
    return;
  }

  const config = await getSupabaseConfig();
  const orderResult = await supabaseRequest(config, "materials", { query: { select: "sort_order", kind: "eq.series", order: "sort_order.desc", limit: "1" } });
  let nextOrder = (orderResult?.[0]?.sort_order ?? -1) + 1;
  let insertedLessons = 0;
  for (const { playlist, lessons } of plans) {
    const playlistId = playlist.id;
    const playlistUrl = `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}`;
    const materialSlug = `playlist-${playlistId}`;
    const existingMaterial = await supabaseRequest(config, "materials", {
      query: { select: "sort_order", slug: `eq.${materialSlug}`, limit: "1" },
    });
    const materialOrder = existingMaterial?.[0]?.sort_order ?? nextOrder;
    const materialRows = await supabaseRequest(config, "materials", {
      method: "POST",
      query: { on_conflict: "slug" },
      prefer: "resolution=merge-duplicates,return=representation",
      body: {
        slug: materialSlug,
        title: playlist.snippet?.title || `سلسلة ${playlistId}`,
        kind: "series",
        material_type: "سلسلة",
        source_url: playlistUrl,
        youtube_playlist_id: playlistId,
        thumbnail_url: bestThumbnail(playlist.snippet?.thumbnails),
        sort_order: materialOrder,
      },
    });
    const material = materialRows?.[0];
    if (!material?.id) throw new Error(`لم يُعِد Supabase سجل سلسلة صالحًا للقائمة ${playlistId}.`);
    if (!existingMaterial?.length) nextOrder += 1;

    const existingLessons = await supabaseRequest(config, "lessons", {
      query: { select: "youtube_video_id,status", series_id: `eq.${material.id}` },
    });
    const currentStatuses = new Map((existingLessons ?? []).map((row) => [row.youtube_video_id, row.status]));
    const payload = lessons.map((lesson) => ({
      series_id: material.id,
      slug: `video-${lesson.videoId}`,
      title: lesson.title,
      youtube_url: lesson.youtubeUrl,
      youtube_video_id: lesson.videoId,
      duration_seconds: lesson.durationSeconds,
      thumbnail_url: lesson.thumbnailUrl,
      sort_order: lesson.position,
      status: currentStatuses.get(lesson.videoId) || "imported",
    }));
    for (let index = 0; index < payload.length; index += 100) {
      const batch = payload.slice(index, index + 100);
      await supabaseRequest(config, "lessons", {
        method: "POST",
        query: { on_conflict: "series_id,youtube_video_id" },
        prefer: "resolution=merge-duplicates,return=minimal",
        body: batch,
      });
      insertedLessons += batch.length;
    }
    console.log(`تمت مزامنة بيانات سلسلة: ${playlist.snippet?.title || playlistId} (${lessons.length} حلقة). الحالة الجديدة: imported.`);
  }
  console.log(`اكتملت المزامنة. عدد سجلات الحلقات التي أُرسلت للـ upsert: ${insertedLessons}.`);
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "--help" || command === "help") { printHelp(); return; }
  if (command === "list-playlists" && !args.length) { showPlaylists(await listChannelPlaylists()); return; }
  if (command === "inspect-playlist" && args.length === 1) {
    const playlist = await getPlaylist(playlistIdFrom(args[0]));
    const entries = await enrichPlaylistItems(await getPlaylistItems(playlist.id));
    console.log(`${playlist.snippet?.title || "بلا عنوان"} · ${playlist.id} · ${entries.length} حلقة`);
    for (const lesson of entries) console.log(`${String(lesson.position + 1).padStart(3, "0")} · ${lesson.title} · ${lesson.videoId} · ${lesson.durationSeconds ?? "مدة غير متاحة"}`);
    return;
  }
  if (command === "import") { await importPlaylists(parseOptions(args)); return; }
  printHelp();
  throw new Error("الأمر أو عدد الوسائط غير صحيح.");
}

main().catch((error) => {
  console.error(`خطأ: ${error instanceof Error ? error.message : "تعذر إكمال الأمر."}`);
  process.exitCode = 1;
});
