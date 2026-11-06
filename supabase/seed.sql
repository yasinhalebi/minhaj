-- Re-runnable base settings and the owner-approved initial topic list.
-- ON CONFLICT DO NOTHING preserves later edits made through the admin panel.
-- Pathways and lessons remain empty until reviewed content is available.
insert into public.site_settings (key, value)
values
  ('site_name', to_jsonb('منهاج'::text)),
  ('site_tagline', to_jsonb('رسالتي إحياء منهاج النبوة'::text))
on conflict (key) do nothing;

insert into public.topics (slug, name, description, sort_order, status)
values
  ('aqidah-iman', 'العقيدة والإيمان', null, 10, 'published'),
  ('quran-uloom', 'القرآن وعلومه', null, 20, 'published'),
  ('hadith-sunnah', 'الحديث والسنة', null, 30, 'published'),
  ('seerah-nabawiyyah', 'السيرة النبوية', null, 40, 'published'),
  ('fiqh-ibadat', 'الفقه والعبادات', null, 50, 'published'),
  ('tazkiyah-akhlaq', 'تزكية النفس والأخلاق', null, 60, 'published'),
  ('talab-alilm-manahij', 'طلب العلم والمنهجية', null, 70, 'published'),
  ('fikr-qadaya-muasira', 'الفكر والقضايا المعاصرة', null, 80, 'published')
on conflict (slug) do nothing;
