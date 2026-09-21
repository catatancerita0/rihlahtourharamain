-- Rihlah Tour Haramain: backend schema.
--
-- Run this once in the Supabase SQL editor (Dashboard, SQL Editor, New query).
-- It is written to be re-runnable: every policy is dropped before it is
-- created, so a second run repairs the database instead of failing halfway.
--
-- Two rules shape the whole file:
--
--   1. Reading content is public. Visitors never sign in, so the anon role can
--      select every row in the content tables.
--   2. Writing is not. It is restricted to a named list of admins that you
--      control, not merely to "any signed-in user". If sign-ups are ever
--      switched on by accident, a new account still cannot touch the content.
--
-- The admin check is a SECURITY DEFINER function so it can read the admins
-- table even though that table is not readable through RLS.

-- ---------------------------------------------------------------------------
-- Admins
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  note text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- The panel needs to answer "is the signed-in account an admin", which is a
-- read of its own row. It does not need the full list, so the policy is limited
-- to your own row and to existing admins rather than being open to everyone.
drop policy if exists "admins are readable" on public.admins;
create policy "admins are readable"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------
--
-- One row per record. `doc` holds the record as JSON because the shapes are
-- nested (hotels, itineraries, bilingual text) and a column per field would
-- turn every content change into a migration. The application validates each
-- document on read and ignores anything it cannot use, so a hand-edited row
-- can never break the public site.

create table if not exists public.content_docs (
  collection text not null,
  slug text not null,
  position integer not null default 0,
  doc jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (collection, slug)
);

alter table public.content_docs enable row level security;

drop policy if exists "content is readable by everyone" on public.content_docs;
create policy "content is readable by everyone"
  on public.content_docs for select
  using (true);

drop policy if exists "content is inserted by admins" on public.content_docs;
create policy "content is inserted by admins"
  on public.content_docs for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "content is updated by admins" on public.content_docs;
create policy "content is updated by admins"
  on public.content_docs for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "content is deleted by admins" on public.content_docs;
create policy "content is deleted by admins"
  on public.content_docs for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------
--
-- A single row per settings group: the site profile (contact details, licence
-- numbers, photos), the homepage layout and the About page copy.

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "settings are readable by everyone" on public.site_settings;
create policy "settings are readable by everyone"
  on public.site_settings for select
  using (true);

drop policy if exists "settings are inserted by admins" on public.site_settings;
create policy "settings are inserted by admins"
  on public.site_settings for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "settings are updated by admins" on public.site_settings;
create policy "settings are updated by admins"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "settings are deleted by admins" on public.site_settings;
create policy "settings are deleted by admins"
  on public.site_settings for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Media
-- ---------------------------------------------------------------------------
--
-- Photos and licence scans live in one public bucket. Public read is the point:
-- these files are served straight to visitors. Uploads are admin only, and the
-- size limit is enforced by the bucket rather than trusted to the client.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'application/pdf']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "media is readable by everyone" on storage.objects;
create policy "media is readable by everyone"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "media is uploaded by admins" on storage.objects;
create policy "media is uploaded by admins"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media is replaced by admins" on storage.objects;
create policy "media is replaced by admins"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

drop policy if exists "media is removed by admins" on storage.objects;
create policy "media is removed by admins"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Last step: name the admin account
-- ---------------------------------------------------------------------------
--
-- 1. Create the account in Authentication, Users, Add user. Use the email
--    address the admin will sign in with, and set a password there.
-- 2. Then run the statement below with that email address.
--
-- Until this runs, nobody can write content. That is deliberate: an empty
-- admins table means no admins, not "anyone who signs in".

-- insert into public.admins (user_id, note)
-- select id, 'pemilik' from auth.users where email = 'ISI_EMAIL_ADMIN'
-- on conflict (user_id) do nothing;
