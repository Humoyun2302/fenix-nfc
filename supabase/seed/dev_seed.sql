-- Development-only seed notes:
-- 1. Create auth users in Supabase Auth first.
-- 2. Replace the UUID placeholders below with the auth.users IDs.
-- 3. Do not run this file in production.

insert into public.workspaces (id, name, slug, status)
values
  ('00000000-0000-4000-8000-000000000001', 'Fenix Demo Workspace', 'fenix-demo', 'active'),
  ('00000000-0000-4000-8000-000000000002', 'Prepared Customer Workspace', 'prepared-customer', 'unclaimed')
on conflict (slug) do nothing;

insert into public.pages (id, workspace_id, title, slug, status, draft_design)
values
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Demo Business Card', 'demo-card', 'draft', '{"theme":"minimal-light"}'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000002', 'Prepared Restaurant Menu', 'prepared-menu', 'draft', '{"theme":"modern-restaurant"}')
on conflict (slug) do nothing;

insert into public.blocks (workspace_id, page_id, type, position, content)
values
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', 'profile_header', 0, '{"name":"Fenix Demo","subtitle":"NFC business page"}'),
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', 'button', 1, '{"label":"Book a meeting","url":"https://example.com"}'),
  ('00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000101', 'form', 2, '{"title":"Request details","fields":[{"id":"name","label":"Name","type":"text","required":true}]}');

insert into public.nfc_tags (workspace_id, public_code, tag_name, assigned_page_id)
values
  ('00000000-0000-4000-8000-000000000001', 'ABCD1234', 'Demo tag', '00000000-0000-4000-8000-000000000101'),
  ('00000000-0000-4000-8000-000000000002', 'MENU2026', 'Restaurant table tag', '00000000-0000-4000-8000-000000000102')
on conflict (public_code) do nothing;
