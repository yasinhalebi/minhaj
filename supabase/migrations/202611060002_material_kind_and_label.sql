-- Align materials with the documented content kind and Arabic display label.
alter table public.materials
  add column if not exists kind text not null default 'series';

alter table public.materials
  add column if not exists material_type text;

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.materials'::regclass
      and conname = 'materials_kind_allowed'
  ) then
    alter table public.materials
      add constraint materials_kind_allowed
      check (kind in ('series', 'lecture', 'playlist', 'podcast', 'topic', 'book', 'summary'));
  end if;
end;
$$;

create index if not exists materials_kind_status_order_idx
  on public.materials (kind, status, sort_order, id);
