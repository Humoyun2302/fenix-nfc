-- Fenix.nfc — 0003 — SECURITY DEFINER helpers used by RLS policies.
-- These bypass RLS internally so policies can query membership without
-- triggering infinite recursion on workspace_members.

create or replace function public.fx_is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select is_platform_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.fx_member_role(ws uuid)
returns public.workspace_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.workspace_members
  where workspace_id = ws and user_id = auth.uid()
  limit 1;
$$;

create or replace function public.fx_is_member(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where workspace_id = ws and user_id = auth.uid()
  ) or public.fx_is_platform_admin();
$$;

-- Owner or administrator: can manage members, NFC, forms, analytics, etc.
create or replace function public.fx_can_manage(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.fx_member_role(ws) in ('owner', 'admin'), false)
    or public.fx_is_platform_admin();
$$;

-- Owner, administrator, or editor: can edit pages/blocks/media.
create or replace function public.fx_can_edit(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.fx_member_role(ws) in ('owner', 'admin', 'editor'),
    false
  ) or public.fx_is_platform_admin();
$$;

-- Owner only: billing, ownership transfer, delete workspace.
create or replace function public.fx_is_owner(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.fx_member_role(ws) = 'owner', false)
    or public.fx_is_platform_admin();
$$;

-- True when the workspace is active (not suspended). Public renderer checks it.
create or replace function public.fx_workspace_active(ws uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select status = 'active' from public.workspaces where id = ws),
    false
  );
$$;
