-- Minhaj initial schema. Apply once to a new Supabase project.
-- Public table access is server-only; the Next.js server must check admins
-- before using the service-role key. Storage upload policies allow active admins.

create type public.content_status as enum (
  'imported',
  'reviewed',
  'published',
  'hidden'
);

create type public.admin_role as enum ('manager', 'editor');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

create table public.materials (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 160),
  title text not null check (length(title) between 1 and 240),
  short_description text,
  description text,
  presentation_type text,
  programming_type text,
  source_url text,
  youtube_video_id text,
  youtube_playlist_id text,
  thumbnail_url text,
  accent_color text,
  icon text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status public.content_status not null default 'imported',
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 160),
  name text not null check (length(name) between 1 and 160),
  description text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status public.content_status not null default 'imported',
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.material_topics (
  material_id uuid not null references public.materials(id) on delete cascade,
  topic_id uuid not null references public.topics(id) on delete cascade,
  created_at timestamptz not null default pg_catalog.now(),
  primary key (material_id, topic_id)
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  series_id uuid not null references public.materials(id) on delete cascade,
  slug text not null check (length(slug) between 1 and 160),
  title text not null check (length(title) between 1 and 240),
  description text,
  summary text,
  youtube_url text,
  youtube_video_id text not null check (length(youtube_video_id) between 1 and 64),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  thumbnail_url text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status public.content_status not null default 'imported',
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint lessons_series_slug_key unique (series_id, slug),
  constraint lessons_series_youtube_video_key unique (series_id, youtube_video_id)
);

create table public.pathways (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (length(slug) between 1 and 160),
  name text not null check (length(name) between 1 and 200),
  description text,
  audience text,
  icon text,
  accent_color text,
  sort_order integer not null default 0 check (sort_order >= 0),
  status public.content_status not null default 'imported',
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.pathway_steps (
  id uuid primary key default gen_random_uuid(),
  pathway_id uuid not null references public.pathways(id) on delete cascade,
  position integer not null check (position > 0),
  title text not null check (length(title) between 1 and 240),
  description text,
  material_id uuid references public.materials(id) on delete set null,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now(),
  constraint pathway_steps_pathway_position_key unique (pathway_id, position)
);

create table public.site_settings (
  key text primary key check (length(key) between 1 and 120),
  value jsonb not null,
  updated_at timestamptz not null default pg_catalog.now()
);

create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  admin_role public.admin_role not null default 'editor',
  is_active boolean not null default true,
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

create index materials_status_order_idx on public.materials (status, sort_order, id);
create index topics_status_order_idx on public.topics (status, sort_order, id);
create index material_topics_topic_id_idx on public.material_topics (topic_id, material_id);
create index lessons_series_order_idx on public.lessons (series_id, status, sort_order, id);
create index lessons_status_idx on public.lessons (status, id);
create index pathways_status_order_idx on public.pathways (status, sort_order, id);
create index pathway_steps_material_id_idx on public.pathway_steps (material_id);
create index admins_active_role_idx on public.admins (is_active, admin_role);

create trigger materials_set_updated_at
before update on public.materials
for each row execute function public.set_updated_at();

create trigger topics_set_updated_at
before update on public.topics
for each row execute function public.set_updated_at();

create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

create trigger pathways_set_updated_at
before update on public.pathways
for each row execute function public.set_updated_at();

create trigger pathway_steps_set_updated_at
before update on public.pathway_steps
for each row execute function public.set_updated_at();

create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

create trigger admins_set_updated_at
before update on public.admins
for each row execute function public.set_updated_at();

-- Membership lookup used only by Storage policies. SECURITY DEFINER avoids
-- recursive RLS checks on admins; the search path is pinned for safety.
create or replace function public.is_active_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admins as a
    where a.user_id = (select auth.uid())
      and a.is_active
  );
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.is_active_admin() from public, anon;
grant execute on function public.is_active_admin() to authenticated;

alter table public.materials enable row level security;
alter table public.topics enable row level security;
alter table public.material_topics enable row level security;
alter table public.lessons enable row level security;
alter table public.pathways enable row level security;
alter table public.pathway_steps enable row level security;
alter table public.site_settings enable row level security;
alter table public.admins enable row level security;

-- No anon/authenticated grants or policies on public tables. Application reads
-- and writes must go through protected Next.js server code.
revoke all privileges on table
  public.materials,
  public.topics,
  public.material_topics,
  public.lessons,
  public.pathways,
  public.pathway_steps,
  public.site_settings,
  public.admins
from anon, authenticated;

alter default privileges in schema public
revoke all on tables from anon, authenticated;

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
);

create policy "site assets are publicly readable"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'site-assets');

create policy "active admins can upload site assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'site-assets' and public.is_active_admin());

create policy "active admins can update site assets"
on storage.objects for update
to authenticated
using (bucket_id = 'site-assets' and public.is_active_admin())
with check (bucket_id = 'site-assets' and public.is_active_admin());

create policy "active admins can delete site assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'site-assets' and public.is_active_admin());
