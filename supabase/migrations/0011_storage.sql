-- Fenix.nfc — 0011 — storage buckets and object-level access policies.
-- Convention: object path is "<workspace_id>/<...>" so we can authorize by the
-- first path segment.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media', 'media', true, 20971520,
   array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml',
         'application/pdf','video/mp4']),
  ('avatars', 'avatars', true, 5242880,
   array['image/png','image/jpeg','image/webp'])
on conflict (id) do nothing;

-- Public read for both buckets (published pages need public images).
create policy "fx media public read"
  on storage.objects for select to anon, authenticated
  using (bucket_id in ('media', 'avatars'));

-- Writes must target a workspace the user can edit.
create policy "fx media insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id in ('media', 'avatars')
    and public.fx_can_edit((split_part(name, '/', 1))::uuid)
  );

create policy "fx media update"
  on storage.objects for update to authenticated
  using (
    bucket_id in ('media', 'avatars')
    and public.fx_can_edit((split_part(name, '/', 1))::uuid)
  );

create policy "fx media delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id in ('media', 'avatars')
    and public.fx_can_edit((split_part(name, '/', 1))::uuid)
  );
