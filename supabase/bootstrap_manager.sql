-- Run after creating the owner's Auth user in Supabase Dashboard.
-- Replace both occurrences of REPLACE_WITH_YOUR_AUTH_EMAIL before running.
do $$
declare
  target_user_id uuid;
begin
  select u.id
    into target_user_id
  from auth.users as u
  where lower(u.email) = lower('REPLACE_WITH_YOUR_AUTH_EMAIL');

  if target_user_id is null then
    raise exception 'No Supabase Auth user found for the supplied email.';
  end if;

  insert into public.admins (user_id, admin_role, is_active)
  values (target_user_id, 'manager', true)
  on conflict (user_id) do update
    set admin_role = excluded.admin_role,
        is_active = true,
        updated_at = pg_catalog.now();
end;
$$;

select a.admin_role, a.is_active
from public.admins as a
join auth.users as u on u.id = a.user_id
where lower(u.email) = lower('REPLACE_WITH_YOUR_AUTH_EMAIL');
