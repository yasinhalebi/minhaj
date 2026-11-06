-- Re-runnable base settings only. Editorial topics and pathways remain empty
-- until the owner approves their content; no sample lessons are inserted.
insert into public.site_settings (key, value)
values
  ('site_name', to_jsonb('منهاج'::text)),
  ('site_tagline', to_jsonb('رسالتي إحياء منهاج النبوة'::text))
on conflict (key) do update
set value = excluded.value,
    updated_at = pg_catalog.now();
