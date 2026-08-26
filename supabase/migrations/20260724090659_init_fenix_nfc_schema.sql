create extension if not exists pgcrypto;
create schema if not exists private;

create type public.workspace_role as enum ('owner', 'administrator', 'editor', 'viewer');
create type public.workspace_status as enum ('active', 'suspended', 'unclaimed');
create type public.page_status as enum ('draft', 'published', 'disabled', 'archived');
create type public.nfc_status as enum ('active', 'disabled');
create type public.payment_status as enum ('pending', 'processing', 'paid', 'failed', 'canceled', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  locale text not null default 'en',
  account_delete_requested_at timestamptz,
  is_super_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  limits jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status public.workspace_status not null default 'active',
  owner_id uuid references auth.users(id) on delete set null,
  plan_id uuid references public.plans(id) on delete set null,
  default_locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null,
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role public.workspace_role not null default 'owner',
  token_hash text not null unique,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  canceled_at timestamptz,
  invited_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  slug text not null unique,
  status public.page_status not null default 'draft',
  draft_design jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  published_snapshot jsonb,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.page_drafts (
  page_id uuid primary key references public.pages(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table public.page_versions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  page_id uuid not null references public.pages(id) on delete cascade,
  snapshot jsonb not null,
  change_summary text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  page_id uuid not null references public.pages(id) on delete cascade,
  type text not null,
  position integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  design jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  scheduled_from timestamptz,
  scheduled_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, position) deferrable initially deferred
);

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  name text not null,
  design jsonb not null,
  is_system boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  brand_name text not null,
  logo_url text,
  alternate_logo_url text,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  bucket text not null,
  path text not null,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  page_id uuid references public.pages(id) on delete cascade,
  block_id uuid references public.blocks(id) on delete set null,
  name text not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms(id) on delete cascade,
  label text not null,
  field_type text not null,
  settings jsonb not null default '{}'::jsonb,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  form_id uuid references public.forms(id) on delete set null,
  page_id uuid references public.pages(id) on delete set null,
  block_id uuid references public.blocks(id) on delete set null,
  visitor_id text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  block_id uuid references public.blocks(id) on delete set null,
  visitor_id text,
  name text,
  phone text,
  email text,
  form_data jsonb not null default '{}'::jsonb,
  status text not null default 'new',
  tags text[] not null default '{}',
  notes text,
  utm jsonb not null default '{}'::jsonb,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  body text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  block_id uuid references public.blocks(id) on delete set null,
  event_type text not null,
  visitor_id text,
  metadata jsonb not null default '{}'::jsonb,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table public.nfc_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  public_code text not null unique,
  tag_name text not null,
  table_number text,
  assigned_page_id uuid references public.pages(id) on delete set null,
  assigned_url text,
  status public.nfc_status not null default 'active',
  notes text,
  total_scans integer not null default 0,
  unique_scans integer not null default 0,
  last_scan_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.nfc_scans (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  nfc_tag_id uuid not null references public.nfc_tags(id) on delete cascade,
  visitor_id text,
  destination text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table public.qr_configurations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  target_type text not null,
  target_id uuid,
  target_url text,
  options jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  locale text not null default 'en',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  category_id uuid references public.product_categories(id) on delete set null,
  name text not null,
  description text,
  price numeric(12,2),
  old_price numeric(12,2),
  currency text not null default 'UZS',
  images text[] not null default '{}',
  sku text,
  quantity integer,
  action jsonb not null default '{}'::jsonb,
  product_type text not null default 'product',
  availability text not null default 'available',
  badges text[] not null default '{}',
  sort_order integer not null default 0,
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.domains (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  page_id uuid references public.pages(id) on delete set null,
  domain text not null unique,
  status text not null default 'pending',
  verification_token text not null default encode(gen_random_bytes(16), 'hex'),
  ssl_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  provider text not null,
  encrypted_config jsonb not null default '{}'::jsonb,
  status text not null default 'configuration_required',
  last_tested_at timestamptz,
  error_log text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, provider)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status text not null default 'active',
  current_period_end timestamptz,
  provider text not null default 'manual',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  provider text not null,
  amount numeric(12,2) not null,
  currency text not null default 'UZS',
  status public.payment_status not null default 'pending',
  external_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  channel text not null default 'in_app',
  payload jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  target_type text,
  target_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function private.is_workspace_member(target_workspace uuid)
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = target_workspace
      and wm.user_id = (select auth.uid())
  );
$$;

create or replace function private.workspace_role_rank(target_workspace uuid)
returns integer
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce(max(case wm.role
    when 'owner' then 4
    when 'administrator' then 3
    when 'editor' then 2
    when 'viewer' then 1
  end), 0)
  from public.workspace_members wm
  where wm.workspace_id = target_workspace
    and wm.user_id = (select auth.uid());
$$;

create or replace function private.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce((select p.is_super_admin from public.profiles p where p.id = (select auth.uid())), false);
$$;

create or replace function public.increment_nfc_scan_count()
returns trigger
language plpgsql
security invoker
as $$
begin
  update public.nfc_tags
    set total_scans = total_scans + 1,
        last_scan_at = new.created_at
    where id = new.nfc_tag_id;
  return new;
end;
$$;

create trigger nfc_scan_count after insert on public.nfc_scans
for each row execute function public.increment_nfc_scan_count();

do $$
declare
  t text;
begin
  foreach t in array array[
    'profiles','plans','workspaces','brand_kits','pages','page_drafts','page_versions','blocks','themes','media',
    'forms','form_fields','form_submissions','leads','analytics_events','nfc_tags','qr_configurations','products',
    'product_categories','domains','integrations','subscriptions','payments'
  ] loop
    execute format('create trigger set_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', t, t);
  end loop;
end $$;

create index idx_workspace_members_user on public.workspace_members(user_id);
create index idx_pages_workspace on public.pages(workspace_id);
create index idx_blocks_page_position on public.blocks(page_id, position);
create index idx_leads_workspace_created on public.leads(workspace_id, created_at desc);
create index idx_analytics_workspace_created on public.analytics_events(workspace_id, created_at desc);
create index idx_nfc_tags_workspace on public.nfc_tags(workspace_id);
create index idx_nfc_scans_tag_created on public.nfc_scans(nfc_tag_id, created_at desc);
create index idx_products_workspace_category on public.products(workspace_id, category_id);
create index idx_audit_logs_workspace_created on public.audit_logs(workspace_id, created_at desc);

grant usage on schema public to anon, authenticated;
grant usage on schema private to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on function private.is_workspace_member(uuid) to authenticated;
grant execute on function private.workspace_role_rank(uuid) to authenticated;
grant execute on function private.is_super_admin() to authenticated;
grant select on public.pages to anon;
grant insert on public.analytics_events, public.leads, public.form_submissions, public.nfc_scans to anon;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invitations enable row level security;
alter table public.pages enable row level security;
alter table public.page_drafts enable row level security;
alter table public.page_versions enable row level security;
alter table public.blocks enable row level security;
alter table public.themes enable row level security;
alter table public.brand_kits enable row level security;
alter table public.media enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_submissions enable row level security;
alter table public.leads enable row level security;
alter table public.lead_notes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.nfc_tags enable row level security;
alter table public.nfc_scans enable row level security;
alter table public.qr_configurations enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.domains enable row level security;
alter table public.integrations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles own read" on public.profiles for select to authenticated using ((select auth.uid()) = id or private.is_super_admin());
create policy "profiles own update" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);
create policy "plans readable" on public.plans for select to authenticated using (true);

create policy "workspace members can read workspace" on public.workspaces for select to authenticated using (private.is_workspace_member(id) or private.is_super_admin());
create policy "users create owned workspace" on public.workspaces for insert to authenticated with check (owner_id = (select auth.uid()) or private.is_super_admin());
create policy "admins update workspace" on public.workspaces for update to authenticated using (private.workspace_role_rank(id) >= 3 or private.is_super_admin()) with check (private.workspace_role_rank(id) >= 3 or private.is_super_admin());

create policy "members read members" on public.workspace_members for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "owner adds self or admin adds members" on public.workspace_members for insert to authenticated with check (user_id = (select auth.uid()) or private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());
create policy "admins update members" on public.workspace_members for update to authenticated using (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());

create policy "members read invitations" on public.invitations for select to authenticated using (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());
create policy "admins manage invitations" on public.invitations for all to authenticated using (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());

create policy "members read pages" on public.pages for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "public read published pages" on public.pages for select to anon using (status = 'published' and published_snapshot is not null);
create policy "editors manage pages" on public.pages for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());

create policy "members read blocks" on public.blocks for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "editors manage blocks" on public.blocks for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());

create policy "workspace read/write common" on public.page_drafts for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());
create policy "workspace read versions" on public.page_versions for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "editors create versions" on public.page_versions for insert to authenticated with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());

create policy "themes visible" on public.themes for select to authenticated using (workspace_id is null or private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "admins manage themes" on public.themes for all to authenticated using (workspace_id is not null and private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin()) with check (workspace_id is not null and private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());

create policy "members read workspace resources" on public.brand_kits for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "admins manage brand kits" on public.brand_kits for all to authenticated using (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());

create policy "members read media" on public.media for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "editors manage media" on public.media for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());

create policy "members manage forms" on public.forms for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());
create policy "members manage form fields" on public.form_fields for all to authenticated using (exists (select 1 from public.forms f where f.id = form_id and private.workspace_role_rank(f.workspace_id) >= 2) or private.is_super_admin()) with check (exists (select 1 from public.forms f where f.id = form_id and private.workspace_role_rank(f.workspace_id) >= 2) or private.is_super_admin());
create policy "public submit forms" on public.form_submissions for insert to anon with check (exists (select 1 from public.pages p where p.id = page_id and p.status = 'published'));
create policy "members read submissions" on public.form_submissions for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());

create policy "public create leads" on public.leads for insert to anon with check (exists (select 1 from public.pages p where p.id = page_id and p.status = 'published'));
create policy "members manage leads" on public.leads for all to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin()) with check (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "members manage lead notes" on public.lead_notes for all to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin()) with check (private.is_workspace_member(workspace_id) or private.is_super_admin());

create policy "public create analytics" on public.analytics_events for insert to anon with check (true);
create policy "members read analytics" on public.analytics_events for select to authenticated using (workspace_id is null or private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "members create analytics" on public.analytics_events for insert to authenticated with check (workspace_id is null or private.is_workspace_member(workspace_id) or private.is_super_admin());

create policy "members manage nfc tags" on public.nfc_tags for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());
create policy "public create nfc scans" on public.nfc_scans for insert to anon with check (true);
create policy "members read nfc scans" on public.nfc_scans for select to authenticated using (private.is_workspace_member(workspace_id) or private.is_super_admin());
create policy "members create nfc scans" on public.nfc_scans for insert to authenticated with check (private.is_workspace_member(workspace_id) or private.is_super_admin());

create policy "members manage qr" on public.qr_configurations for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());
create policy "members manage categories" on public.product_categories for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());
create policy "members manage products" on public.products for all to authenticated using (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 2 or private.is_super_admin());
create policy "admins manage domains" on public.domains for all to authenticated using (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());
create policy "admins manage integrations" on public.integrations for all to authenticated using (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin()) with check (private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());
create policy "owners read subscriptions" on public.subscriptions for select to authenticated using (private.workspace_role_rank(workspace_id) >= 4 or private.is_super_admin());
create policy "owners read payments" on public.payments for select to authenticated using (private.workspace_role_rank(workspace_id) >= 4 or private.is_super_admin());
create policy "users read notifications" on public.notifications for select to authenticated using (user_id = (select auth.uid()) or private.is_super_admin());
create policy "members read audit logs" on public.audit_logs for select to authenticated using (workspace_id is null or private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());
create policy "admins write audit logs" on public.audit_logs for insert to authenticated with check (workspace_id is null or private.workspace_role_rank(workspace_id) >= 3 or private.is_super_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workspace-media',
  'workspace-media',
  false,
  10485760,
  array['image/png','image/jpeg','image/webp','image/gif','application/pdf']
)
on conflict (id) do nothing;

create policy "members read workspace media" on storage.objects
for select to authenticated
using (
  bucket_id = 'workspace-media'
  and private.is_workspace_member(((storage.foldername(name))[1])::uuid)
);

create policy "editors upload workspace media" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'workspace-media'
  and private.workspace_role_rank(((storage.foldername(name))[1])::uuid) >= 2
);

create policy "editors update workspace media" on storage.objects
for update to authenticated
using (
  bucket_id = 'workspace-media'
  and private.workspace_role_rank(((storage.foldername(name))[1])::uuid) >= 2
)
with check (
  bucket_id = 'workspace-media'
  and private.workspace_role_rank(((storage.foldername(name))[1])::uuid) >= 2
);

create policy "editors delete workspace media" on storage.objects
for delete to authenticated
using (
  bucket_id = 'workspace-media'
  and private.workspace_role_rank(((storage.foldername(name))[1])::uuid) >= 2
);

insert into public.plans (code, name, limits) values
  ('free', 'Free', '{"pages":1,"nfc_tags":1,"team_members":1,"analytics_days":7}'::jsonb),
  ('pro', 'Pro', '{"pages":10,"nfc_tags":10,"team_members":3,"analytics_days":90,"custom_domains":1}'::jsonb),
  ('business', 'Business', '{"pages":50,"nfc_tags":100,"team_members":10,"analytics_days":365,"custom_domains":5}'::jsonb),
  ('lifetime', 'Lifetime', '{"pages":50,"nfc_tags":100,"team_members":10,"analytics_days":3650}'::jsonb),
  ('custom', 'Custom', '{}'::jsonb);
