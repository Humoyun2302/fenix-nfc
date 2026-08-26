-- Fenix.nfc — combined schema setup
-- Generated from supabase/migrations/* in order.
-- Paste this whole file into the Supabase SQL Editor and run it once.


-- ============================================================
-- 0001_init_extensions_enums.sql
-- ============================================================

-- Fenix.nfc — 0001 — extensions, enum types, and shared trigger helpers.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- Enumerations ---------------------------------------------------------------

create type public.workspace_role as enum ('owner', 'admin', 'editor', 'viewer');
create type public.workspace_status as enum ('active', 'suspended');
create type public.invitation_status as enum ('pending', 'accepted', 'cancelled', 'expired');
create type public.page_status as enum ('draft', 'published', 'disabled', 'archived');
create type public.lead_status as enum ('new', 'contacted', 'qualified', 'won', 'lost');
create type public.nfc_status as enum ('active', 'disabled');
create type public.nfc_target as enum ('page', 'url');
create type public.domain_status as enum (
  'pending', 'verification_required', 'verifying', 'active',
  'ssl_pending', 'failed', 'disconnected'
);
create type public.subscription_status as enum (
  'active', 'trialing', 'past_due', 'canceled', 'expired'
);
create type public.payment_status as enum (
  'pending', 'processing', 'paid', 'failed', 'canceled', 'refunded'
);
create type public.integration_type as enum (
  'telegram', 'email', 'webhook', 'google_analytics', 'gtm',
  'meta_pixel', 'tiktok_pixel'
);
create type public.analytics_event_type as enum (
  'page_view', 'unique_visitor', 'link_click', 'button_click',
  'product_click', 'form_start', 'form_submission', 'nfc_scan',
  'qr_redirect', 'payment_start', 'payment_success'
);

-- Shared trigger: keep updated_at fresh on every UPDATE. ----------------------

create or replace function public.fx_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ============================================================
-- 0002_core_tenancy.sql
-- ============================================================

-- Fenix.nfc — 0002 — profiles, workspaces, members, invitations.

-- Profiles: one row per auth user. -------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email citext not null,
  full_name text,
  username citext unique,
  avatar_url text,
  locale text not null default 'en',
  is_platform_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_email_idx on public.profiles (email);

-- Plans must exist before workspaces reference them. --------------------------
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  name text not null,
  price numeric(12, 2) not null default 0,
  currency text not null default 'UZS',
  billing_interval text not null default 'month',
  limits jsonb not null default '{}'::jsonb,
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Workspaces: the tenant boundary. -------------------------------------------
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug citext not null unique,
  owner_id uuid references public.profiles (id) on delete set null,
  plan_id uuid references public.plans (id) on delete set null,
  status public.workspace_status not null default 'active',
  is_claimed boolean not null default true,
  claim_email citext,
  claimed_at timestamptz,
  logo_url text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index workspaces_owner_idx on public.workspaces (owner_id);
create index workspaces_status_idx on public.workspaces (status);

-- Workspace membership + roles. ----------------------------------------------
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role public.workspace_role not null default 'viewer',
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);
create index workspace_members_user_idx on public.workspace_members (user_id);
create index workspace_members_ws_idx on public.workspace_members (workspace_id);

-- Invitations (also used for admin-prepared workspace claim flow). ------------
create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  email citext not null,
  role public.workspace_role not null default 'owner',
  token text not null unique,
  status public.invitation_status not null default 'pending',
  is_ownership_claim boolean not null default false,
  expires_at timestamptz not null,
  invited_by uuid references public.profiles (id) on delete set null,
  accepted_by uuid references public.profiles (id) on delete set null,
  accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index invitations_workspace_idx on public.invitations (workspace_id);
create index invitations_email_idx on public.invitations (email);
create index invitations_status_idx on public.invitations (status);

create trigger set_updated_at before update on public.profiles
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.plans
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.workspaces
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.workspace_members
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.invitations
  for each row execute function public.fx_set_updated_at();


-- ============================================================
-- 0003_auth_helpers.sql
-- ============================================================

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


-- ============================================================
-- 0004_pages_blocks.sql
-- ============================================================

-- Fenix.nfc — 0004 — pages, versions, blocks, themes, brand kits.

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  title text not null default 'Untitled page',
  slug citext not null unique,
  is_internal boolean not null default false,
  status public.page_status not null default 'draft',
  -- Global (draft) design settings; snapshotted into page_versions on publish.
  design jsonb not null default '{}'::jsonb,
  -- SEO / social metadata.
  seo jsonb not null default '{}'::jsonb,
  language text not null default 'en',
  published_version_id uuid,
  published_at timestamptz,
  published_by uuid references public.profiles (id) on delete set null,
  has_unpublished_changes boolean not null default false,
  sort_order int not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index pages_workspace_idx on public.pages (workspace_id);
create index pages_status_idx on public.pages (status);

-- Blocks hold the LIVE DRAFT state of a page. --------------------------------
create table public.blocks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid not null references public.pages (id) on delete cascade,
  type text not null,
  position int not null default 0,
  content jsonb not null default '{}'::jsonb,
  design jsonb not null default '{}'::jsonb,
  is_visible boolean not null default true,
  schedule_start timestamptz,
  schedule_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index blocks_page_idx on public.blocks (page_id, position);
create index blocks_workspace_idx on public.blocks (workspace_id);

-- Immutable published snapshots. ---------------------------------------------
create table public.page_versions (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.pages (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  version_number int not null,
  snapshot jsonb not null,
  change_summary text,
  published_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  unique (page_id, version_number)
);
create index page_versions_page_idx on public.page_versions (page_id, version_number desc);

alter table public.pages
  add constraint pages_published_version_fk
  foreign key (published_version_id)
  references public.page_versions (id) on delete set null;

-- Themes: system themes (workspace_id null) + workspace-created themes. -------
create table public.themes (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces (id) on delete cascade,
  key text not null,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  is_system boolean not null default false,
  preview jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index themes_system_key_idx
  on public.themes (key) where workspace_id is null;
create index themes_workspace_idx on public.themes (workspace_id);

-- Reusable brand kits. -------------------------------------------------------
create table public.brand_kits (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  config jsonb not null default '{}'::jsonb,
  is_default boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index brand_kits_workspace_idx on public.brand_kits (workspace_id);

create trigger set_updated_at before update on public.pages
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.blocks
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.themes
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.brand_kits
  for each row execute function public.fx_set_updated_at();


-- ============================================================
-- 0005_media_forms_leads.sql
-- ============================================================

-- Fenix.nfc — 0005 — media, forms, submissions, leads.

create table public.media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  bucket text not null default 'media',
  path text not null,
  url text,
  kind text not null default 'image',
  mime_type text,
  size_bytes bigint,
  width int,
  height int,
  filename text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bucket, path)
);
create index media_workspace_idx on public.media (workspace_id);

create table public.forms (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  name text not null default 'Untitled form',
  submit_label text not null default 'Send',
  success_message text not null default 'Thank you! We will be in touch.',
  notify jsonb not null default '{}'::jsonb,
  spam_protection boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index forms_workspace_idx on public.forms (workspace_id);

create table public.form_fields (
  id uuid primary key default gen_random_uuid(),
  form_id uuid not null references public.forms (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  type text not null,
  label text not null,
  field_key text not null,
  placeholder text,
  required boolean not null default false,
  options jsonb not null default '[]'::jsonb,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (form_id, field_key)
);
create index form_fields_form_idx on public.form_fields (form_id, position);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  form_id uuid not null references public.forms (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  data jsonb not null default '{}'::jsonb,
  visitor_id text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);
create index form_submissions_form_idx on public.form_submissions (form_id, created_at desc);
create index form_submissions_workspace_idx on public.form_submissions (workspace_id);

create table public.lead_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  color text not null default '#858B92',
  created_at timestamptz not null default now(),
  unique (workspace_id, name)
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  submission_id uuid references public.form_submissions (id) on delete set null,
  name text,
  phone text,
  email citext,
  data jsonb not null default '{}'::jsonb,
  status public.lead_status not null default 'new',
  utm jsonb not null default '{}'::jsonb,
  referrer text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index leads_workspace_idx on public.leads (workspace_id, created_at desc);
create index leads_status_idx on public.leads (workspace_id, status);

create table public.lead_tag_links (
  lead_id uuid not null references public.leads (id) on delete cascade,
  tag_id uuid not null references public.lead_tags (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  primary key (lead_id, tag_id)
);

create table public.lead_notes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);
create index lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

create trigger set_updated_at before update on public.media
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.forms
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.form_fields
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.leads
  for each row execute function public.fx_set_updated_at();


-- ============================================================
-- 0006_analytics_nfc_qr.sql
-- ============================================================

-- Fenix.nfc — 0006 — analytics events, NFC tags & scans, QR configs.

create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  block_id uuid references public.blocks (id) on delete set null,
  type public.analytics_event_type not null,
  visitor_id text,
  session_id text,
  device text,
  browser text,
  os text,
  country text,
  referrer text,
  utm jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index analytics_events_ws_time_idx on public.analytics_events (workspace_id, created_at desc);
create index analytics_events_page_idx on public.analytics_events (page_id, type);
create index analytics_events_type_idx on public.analytics_events (workspace_id, type, created_at desc);

create table public.nfc_tags (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  code text not null unique,
  name text not null default 'NFC tag',
  table_number text,
  target_type public.nfc_target not null default 'page',
  target_page_id uuid references public.pages (id) on delete set null,
  target_url text,
  status public.nfc_status not null default 'active',
  notes text,
  total_scans bigint not null default 0,
  unique_scans bigint not null default 0,
  last_scan_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index nfc_tags_workspace_idx on public.nfc_tags (workspace_id);

create table public.nfc_scans (
  id uuid primary key default gen_random_uuid(),
  tag_id uuid not null references public.nfc_tags (id) on delete cascade,
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  visitor_id text,
  ip_hash text,
  user_agent text,
  country text,
  referrer text,
  created_at timestamptz not null default now()
);
create index nfc_scans_tag_idx on public.nfc_scans (tag_id, created_at desc);

create table public.qr_configs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null default 'QR code',
  target_type text not null default 'page',
  target_ref text not null,
  options jsonb not null default '{}'::jsonb,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index qr_configs_workspace_idx on public.qr_configs (workspace_id);

create trigger set_updated_at before update on public.nfc_tags
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.qr_configs
  for each row execute function public.fx_set_updated_at();


-- ============================================================
-- 0007_products_domains_integrations.sql
-- ============================================================

-- Fenix.nfc — 0007 — products & menus, domains, integrations.

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  name text not null,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index product_categories_workspace_idx on public.product_categories (workspace_id);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  category_id uuid references public.product_categories (id) on delete set null,
  name text not null,
  description text,
  price numeric(12, 2),
  old_price numeric(12, 2),
  currency text not null default 'UZS',
  images jsonb not null default '[]'::jsonb,
  sku text,
  quantity int,
  availability boolean not null default true,
  product_type text not null default 'product',
  is_featured boolean not null default false,
  badges jsonb not null default '[]'::jsonb,
  sizes jsonb not null default '[]'::jsonb,
  addons jsonb not null default '[]'::jsonb,
  translations jsonb not null default '{}'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_workspace_idx on public.products (workspace_id);
create index products_category_idx on public.products (category_id);

create table public.domains (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  page_id uuid references public.pages (id) on delete set null,
  hostname citext not null unique,
  status public.domain_status not null default 'pending',
  verification_token text not null,
  ssl_status text not null default 'pending',
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index domains_workspace_idx on public.domains (workspace_id);

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  type public.integration_type not null,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'disconnected',
  last_test_at timestamptz,
  last_error text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, type)
);
create index integrations_workspace_idx on public.integrations (workspace_id);

create trigger set_updated_at before update on public.product_categories
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.products
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.domains
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.integrations
  for each row execute function public.fx_set_updated_at();


-- ============================================================
-- 0008_billing_notifications_audit.sql
-- ============================================================

-- Fenix.nfc — 0008 — subscriptions, payments, notifications, audit logs.

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  plan_id uuid not null references public.plans (id) on delete restrict,
  status public.subscription_status not null default 'active',
  is_lifetime boolean not null default false,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz,
  cancel_at timestamptz,
  granted_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id)
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id) on delete set null,
  provider text not null default 'manual',
  amount numeric(12, 2) not null default 0,
  currency text not null default 'UZS',
  status public.payment_status not null default 'pending',
  external_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_workspace_idx on public.payments (workspace_id, created_at desc);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  data jsonb not null default '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_workspace_idx on public.notifications (workspace_id, created_at desc);

create table public.notification_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces (id) on delete set null,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  target_type text,
  target_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_logs_workspace_idx on public.audit_logs (workspace_id, created_at desc);
create index audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);

create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.payments
  for each row execute function public.fx_set_updated_at();
create trigger set_updated_at before update on public.notification_settings
  for each row execute function public.fx_set_updated_at();


-- ============================================================
-- 0009_rls_policies.sql
-- ============================================================

-- Fenix.nfc — 0009 — Row Level Security for every user-facing table.
-- Default posture: deny. Public (anonymous) access to page content, analytics,
-- form submissions and NFC scans is intentionally NOT granted here; it flows
-- through audited SECURITY DEFINER RPCs (see 0010) so drafts and secrets stay
-- private.

-- Extra helper: do two users share any workspace? (no recursion via definer)
create or replace function public.fx_shares_workspace(other uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members a
    join public.workspace_members b on a.workspace_id = b.workspace_id
    where a.user_id = auth.uid() and b.user_id = other
  );
$$;

-- Enable RLS everywhere. -----------------------------------------------------
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.invitations enable row level security;
alter table public.pages enable row level security;
alter table public.blocks enable row level security;
alter table public.page_versions enable row level security;
alter table public.themes enable row level security;
alter table public.brand_kits enable row level security;
alter table public.media enable row level security;
alter table public.forms enable row level security;
alter table public.form_fields enable row level security;
alter table public.form_submissions enable row level security;
alter table public.leads enable row level security;
alter table public.lead_tags enable row level security;
alter table public.lead_tag_links enable row level security;
alter table public.lead_notes enable row level security;
alter table public.analytics_events enable row level security;
alter table public.nfc_tags enable row level security;
alter table public.nfc_scans enable row level security;
alter table public.qr_configs enable row level security;
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.domains enable row level security;
alter table public.integrations enable row level security;
alter table public.subscriptions enable row level security;
alter table public.payments enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_settings enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles -------------------------------------------------------------------
create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.fx_shares_workspace(id) or public.fx_is_platform_admin());
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());

-- Plans (public catalog) -----------------------------------------------------
create policy plans_select on public.plans for select to anon, authenticated using (true);
create policy plans_admin_write on public.plans for all to authenticated
  using (public.fx_is_platform_admin()) with check (public.fx_is_platform_admin());

-- Workspaces -----------------------------------------------------------------
create policy workspaces_select on public.workspaces for select to authenticated
  using (public.fx_is_member(id));
create policy workspaces_insert on public.workspaces for insert to authenticated
  with check (public.fx_is_platform_admin());
create policy workspaces_update on public.workspaces for update to authenticated
  using (public.fx_can_manage(id)) with check (public.fx_can_manage(id));
create policy workspaces_delete on public.workspaces for delete to authenticated
  using (public.fx_is_owner(id));

-- Workspace members ----------------------------------------------------------
create policy members_select on public.workspace_members for select to authenticated
  using (public.fx_is_member(workspace_id));
create policy members_manage on public.workspace_members for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Invitations ----------------------------------------------------------------
create policy invitations_manage on public.invitations for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Generic macro-style policies for workspace-scoped tables. -------------------

-- Pages / blocks / versions (editors).
create policy pages_select on public.pages for select to authenticated using (public.fx_is_member(workspace_id));
create policy pages_write on public.pages for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

create policy blocks_select on public.blocks for select to authenticated using (public.fx_is_member(workspace_id));
create policy blocks_write on public.blocks for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

create policy versions_select on public.page_versions for select to authenticated using (public.fx_is_member(workspace_id));
create policy versions_insert on public.page_versions for insert to authenticated
  with check (public.fx_can_edit(workspace_id));

-- Themes: system themes visible to all authenticated; workspace themes to members.
create policy themes_select on public.themes for select to authenticated
  using (is_system or (workspace_id is not null and public.fx_is_member(workspace_id)));
create policy themes_write on public.themes for all to authenticated
  using (workspace_id is not null and public.fx_can_manage(workspace_id))
  with check (workspace_id is not null and public.fx_can_manage(workspace_id));

create policy brand_kits_select on public.brand_kits for select to authenticated using (public.fx_is_member(workspace_id));
create policy brand_kits_write on public.brand_kits for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Media.
create policy media_select on public.media for select to authenticated using (public.fx_is_member(workspace_id));
create policy media_write on public.media for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Forms.
create policy forms_select on public.forms for select to authenticated using (public.fx_is_member(workspace_id));
create policy forms_write on public.forms for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy form_fields_select on public.form_fields for select to authenticated using (public.fx_is_member(workspace_id));
create policy form_fields_write on public.form_fields for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Submissions: readable by members, no direct client writes (RPC only).
create policy form_submissions_select on public.form_submissions for select to authenticated using (public.fx_is_member(workspace_id));
create policy form_submissions_delete on public.form_submissions for delete to authenticated using (public.fx_can_manage(workspace_id));

-- Leads.
create policy leads_select on public.leads for select to authenticated using (public.fx_is_member(workspace_id));
create policy leads_update on public.leads for update to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy leads_delete on public.leads for delete to authenticated using (public.fx_can_manage(workspace_id));

create policy lead_tags_select on public.lead_tags for select to authenticated using (public.fx_is_member(workspace_id));
create policy lead_tags_write on public.lead_tags for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy lead_tag_links_select on public.lead_tag_links for select to authenticated using (public.fx_is_member(workspace_id));
create policy lead_tag_links_write on public.lead_tag_links for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

create policy lead_notes_select on public.lead_notes for select to authenticated using (public.fx_is_member(workspace_id));
create policy lead_notes_write on public.lead_notes for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Analytics: readable by members; writes via RPC only.
create policy analytics_select on public.analytics_events for select to authenticated using (public.fx_is_member(workspace_id));

-- NFC.
create policy nfc_tags_select on public.nfc_tags for select to authenticated using (public.fx_is_member(workspace_id));
create policy nfc_tags_write on public.nfc_tags for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));
create policy nfc_scans_select on public.nfc_scans for select to authenticated using (public.fx_is_member(workspace_id));

create policy qr_configs_select on public.qr_configs for select to authenticated using (public.fx_is_member(workspace_id));
create policy qr_configs_write on public.qr_configs for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Products.
create policy product_categories_select on public.product_categories for select to authenticated using (public.fx_is_member(workspace_id));
create policy product_categories_write on public.product_categories for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));
create policy products_select on public.products for select to authenticated using (public.fx_is_member(workspace_id));
create policy products_write on public.products for all to authenticated
  using (public.fx_can_edit(workspace_id)) with check (public.fx_can_edit(workspace_id));

-- Domains.
create policy domains_select on public.domains for select to authenticated using (public.fx_is_member(workspace_id));
create policy domains_write on public.domains for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Integrations (contain secrets → managers only, even for reads).
create policy integrations_all on public.integrations for all to authenticated
  using (public.fx_can_manage(workspace_id)) with check (public.fx_can_manage(workspace_id));

-- Subscriptions & payments.
create policy subscriptions_select on public.subscriptions for select to authenticated using (public.fx_is_member(workspace_id));
create policy payments_select on public.payments for select to authenticated using (public.fx_can_manage(workspace_id));

-- Notifications (per-user).
create policy notifications_select on public.notifications for select to authenticated
  using (user_id = auth.uid() or (workspace_id is not null and public.fx_can_manage(workspace_id)));
create policy notifications_update on public.notifications for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy notification_settings_all on public.notification_settings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Audit logs (managers read; writes via service role / RPC).
create policy audit_logs_select on public.audit_logs for select to authenticated
  using ((workspace_id is not null and public.fx_can_manage(workspace_id)) or public.fx_is_platform_admin());


-- ============================================================
-- 0010_functions_rpcs.sql
-- ============================================================

-- Fenix.nfc — 0010 — triggers, workspace bootstrap, publishing, invitations,
-- and audited public RPCs for anonymous visitors.

-- Slugify helper. ------------------------------------------------------------
create or replace function public.fx_slugify(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from
    regexp_replace(lower(coalesce(input, '')), '[^a-z0-9]+', '-', 'g')
  );
$$;

-- Create a profile automatically when an auth user is created. ---------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_username text;
  candidate text;
  suffix int := 0;
begin
  base_username := public.fx_slugify(split_part(new.email, '@', 1));
  if base_username = '' then
    base_username := 'user';
  end if;
  candidate := base_username;
  while exists (select 1 from public.profiles where username = candidate) loop
    suffix := suffix + 1;
    candidate := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, email, full_name, username, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    candidate,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Bootstrap a workspace for the current user (owner + free subscription). -----
create or replace function public.fx_create_workspace(p_name text)
returns public.workspaces
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_slug text;
  v_base text;
  v_suffix int := 0;
  v_plan uuid;
  v_ws public.workspaces;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  v_base := public.fx_slugify(p_name);
  if v_base = '' then v_base := 'workspace'; end if;
  v_slug := v_base;
  while exists (select 1 from public.workspaces where slug = v_slug) loop
    v_suffix := v_suffix + 1;
    v_slug := v_base || '-' || v_suffix::text;
  end loop;

  select id into v_plan from public.plans where key = 'free' limit 1;

  insert into public.workspaces (name, slug, owner_id, created_by, plan_id, is_claimed, claimed_at)
  values (coalesce(nullif(trim(p_name), ''), 'My workspace'), v_slug, v_uid, v_uid, v_plan, true, now())
  returning * into v_ws;

  insert into public.workspace_members (workspace_id, user_id, role, invited_by)
  values (v_ws.id, v_uid, 'owner', v_uid);

  if v_plan is not null then
    insert into public.subscriptions (workspace_id, plan_id, status)
    values (v_ws.id, v_plan, 'active')
    on conflict (workspace_id) do nothing;
  end if;

  return v_ws;
end;
$$;

-- Publish a page: snapshot current draft (design + blocks) into a version. ----
create or replace function public.fx_publish_page(p_page_id uuid, p_summary text default null)
returns public.page_versions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_page public.pages;
  v_next int;
  v_snapshot jsonb;
  v_version public.page_versions;
begin
  select * into v_page from public.pages where id = p_page_id;
  if not found then
    raise exception 'Page not found' using errcode = 'P0002';
  end if;
  if not public.fx_can_edit(v_page.workspace_id) then
    raise exception 'Not authorized to publish this page' using errcode = '42501';
  end if;

  select coalesce(max(version_number), 0) + 1 into v_next
  from public.page_versions where page_id = p_page_id;

  select jsonb_build_object(
    'design', v_page.design,
    'seo', v_page.seo,
    'title', v_page.title,
    'language', v_page.language,
    'blocks', coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', b.id,
            'type', b.type,
            'position', b.position,
            'content', b.content,
            'design', b.design,
            'schedule_start', b.schedule_start,
            'schedule_end', b.schedule_end
          ) order by b.position
        )
        from public.blocks b
        where b.page_id = p_page_id and b.is_visible = true
      ),
      '[]'::jsonb
    )
  ) into v_snapshot;

  insert into public.page_versions (page_id, workspace_id, version_number, snapshot, change_summary, published_by)
  values (p_page_id, v_page.workspace_id, v_next, v_snapshot, p_summary, auth.uid())
  returning * into v_version;

  update public.pages
  set published_version_id = v_version.id,
      published_at = now(),
      published_by = auth.uid(),
      status = 'published',
      has_unpublished_changes = false
  where id = p_page_id;

  return v_version;
end;
$$;

-- Accept an invitation / claim a prepared workspace. --------------------------
create or replace function public.fx_accept_invitation(p_token text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_email citext;
  v_inv public.invitations;
begin
  if v_uid is null then
    raise exception 'Not authenticated' using errcode = '28000';
  end if;

  select * into v_inv from public.invitations where token = p_token;
  if not found then
    raise exception 'Invitation not found' using errcode = 'P0002';
  end if;
  if v_inv.status <> 'pending' then
    raise exception 'Invitation is no longer valid' using errcode = 'P0001';
  end if;
  if v_inv.expires_at < now() then
    update public.invitations set status = 'expired' where id = v_inv.id;
    raise exception 'Invitation has expired' using errcode = 'P0001';
  end if;

  select email into v_email from public.profiles where id = v_uid;

  if v_inv.is_ownership_claim then
    update public.workspaces
    set owner_id = v_uid, is_claimed = true, claimed_at = now()
    where id = v_inv.workspace_id;

    insert into public.workspace_members (workspace_id, user_id, role, invited_by)
    values (v_inv.workspace_id, v_uid, 'owner', v_inv.invited_by)
    on conflict (workspace_id, user_id) do update set role = 'owner';
  else
    insert into public.workspace_members (workspace_id, user_id, role, invited_by)
    values (v_inv.workspace_id, v_uid, v_inv.role, v_inv.invited_by)
    on conflict (workspace_id, user_id) do update set role = excluded.role;
  end if;

  update public.invitations
  set status = 'accepted', accepted_by = v_uid, accepted_at = now()
  where id = v_inv.id;

  insert into public.audit_logs (workspace_id, actor_id, action, target_type, target_id, meta)
  values (v_inv.workspace_id, v_uid, 'invitation.accepted', 'invitation', v_inv.id::text,
          jsonb_build_object('ownership_claim', v_inv.is_ownership_claim));

  return v_inv.workspace_id;
end;
$$;

-- PUBLIC RPC: fetch a published page by slug (anonymous-safe). ----------------
create or replace function public.fx_get_public_page(p_slug text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_page public.pages;
  v_ws public.workspaces;
  v_snapshot jsonb;
begin
  select * into v_page from public.pages where slug = p_slug;
  if not found then
    return jsonb_build_object('state', 'not_found');
  end if;

  select * into v_ws from public.workspaces where id = v_page.workspace_id;
  if v_ws.status <> 'active' then
    return jsonb_build_object('state', 'suspended');
  end if;
  if v_page.status = 'disabled' then
    return jsonb_build_object('state', 'disabled');
  end if;
  if v_page.status = 'archived' then
    return jsonb_build_object('state', 'not_found');
  end if;
  if v_page.published_version_id is null then
    return jsonb_build_object('state', 'unpublished');
  end if;

  select snapshot into v_snapshot from public.page_versions where id = v_page.published_version_id;

  return jsonb_build_object(
    'state', 'ok',
    'page_id', v_page.id,
    'workspace_id', v_page.workspace_id,
    'slug', v_page.slug,
    'snapshot', v_snapshot
  );
end;
$$;

-- Resolve a username to its home (lowest sort_order published) page slug. -----
create or replace function public.fx_username_home_slug(p_username text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.slug
  from public.profiles pr
  join public.workspaces w on w.owner_id = pr.id and w.status = 'active'
  join public.pages p on p.workspace_id = w.id
    and p.status = 'published' and p.published_version_id is not null
  where pr.username = p_username
  order by p.sort_order asc, p.created_at asc
  limit 1;
$$;

-- PUBLIC RPC: record an analytics event. -------------------------------------
create or replace function public.fx_track_event(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ws uuid := (payload ->> 'workspace_id')::uuid;
begin
  if v_ws is null or not public.fx_workspace_active(v_ws) then
    return;
  end if;
  insert into public.analytics_events (
    workspace_id, page_id, block_id, type, visitor_id, session_id,
    device, browser, os, country, referrer, utm, meta
  ) values (
    v_ws,
    nullif(payload ->> 'page_id', '')::uuid,
    nullif(payload ->> 'block_id', '')::uuid,
    (payload ->> 'type')::public.analytics_event_type,
    payload ->> 'visitor_id',
    payload ->> 'session_id',
    payload ->> 'device',
    payload ->> 'browser',
    payload ->> 'os',
    payload ->> 'country',
    payload ->> 'referrer',
    coalesce(payload -> 'utm', '{}'::jsonb),
    coalesce(payload -> 'meta', '{}'::jsonb)
  );
end;
$$;

-- PUBLIC RPC: submit a form → submission + lead + conversion event. ----------
create or replace function public.fx_submit_form(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_form public.forms;
  v_data jsonb := coalesce(payload -> 'data', '{}'::jsonb);
  v_submission_id uuid;
begin
  select * into v_form from public.forms where id = (payload ->> 'form_id')::uuid;
  if not found or not v_form.is_active then
    raise exception 'Form is not available' using errcode = 'P0001';
  end if;
  if not public.fx_workspace_active(v_form.workspace_id) then
    raise exception 'Workspace is not active' using errcode = 'P0001';
  end if;

  insert into public.form_submissions (
    workspace_id, form_id, page_id, block_id, data, visitor_id, ip_hash, user_agent
  ) values (
    v_form.workspace_id, v_form.id,
    nullif(payload ->> 'page_id', '')::uuid,
    nullif(payload ->> 'block_id', '')::uuid,
    v_data,
    payload ->> 'visitor_id',
    payload ->> 'ip_hash',
    payload ->> 'user_agent'
  ) returning id into v_submission_id;

  insert into public.leads (
    workspace_id, page_id, block_id, submission_id, name, phone, email, data, utm, referrer
  ) values (
    v_form.workspace_id,
    nullif(payload ->> 'page_id', '')::uuid,
    nullif(payload ->> 'block_id', '')::uuid,
    v_submission_id,
    coalesce(v_data ->> 'name', v_data ->> 'full_name'),
    coalesce(v_data ->> 'phone', v_data ->> 'tel'),
    nullif(v_data ->> 'email', ''),
    v_data,
    coalesce(payload -> 'utm', '{}'::jsonb),
    payload ->> 'referrer'
  );

  perform public.fx_track_event(jsonb_build_object(
    'workspace_id', v_form.workspace_id,
    'page_id', payload ->> 'page_id',
    'block_id', payload ->> 'block_id',
    'type', 'form_submission',
    'visitor_id', payload ->> 'visitor_id'
  ));

  return jsonb_build_object('ok', true, 'submission_id', v_submission_id);
end;
$$;

-- PUBLIC RPC: resolve an NFC code, record the scan, return the destination. ---
create or replace function public.fx_resolve_nfc(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tag public.nfc_tags;
  v_slug text;
  v_visitor text := payload ->> 'visitor_id';
  v_is_unique boolean := false;
begin
  select * into v_tag from public.nfc_tags where code = payload ->> 'code';
  if not found then
    return jsonb_build_object('state', 'not_found');
  end if;
  if v_tag.status <> 'active' then
    return jsonb_build_object('state', 'disabled');
  end if;
  if not public.fx_workspace_active(v_tag.workspace_id) then
    return jsonb_build_object('state', 'suspended');
  end if;

  if v_visitor is not null then
    v_is_unique := not exists (
      select 1 from public.nfc_scans where tag_id = v_tag.id and visitor_id = v_visitor
    );
  end if;

  insert into public.nfc_scans (tag_id, workspace_id, visitor_id, ip_hash, user_agent, country, referrer)
  values (v_tag.id, v_tag.workspace_id, v_visitor, payload ->> 'ip_hash',
          payload ->> 'user_agent', payload ->> 'country', payload ->> 'referrer');

  update public.nfc_tags
  set total_scans = total_scans + 1,
      unique_scans = unique_scans + (case when v_is_unique then 1 else 0 end),
      last_scan_at = now()
  where id = v_tag.id;

  perform public.fx_track_event(jsonb_build_object(
    'workspace_id', v_tag.workspace_id,
    'type', 'nfc_scan',
    'visitor_id', v_visitor,
    'meta', jsonb_build_object('tag_id', v_tag.id)
  ));

  if v_tag.target_type = 'url' then
    return jsonb_build_object('state', 'ok', 'target_type', 'url', 'url', v_tag.target_url);
  end if;

  select slug into v_slug from public.pages where id = v_tag.target_page_id;
  if v_slug is null then
    return jsonb_build_object('state', 'not_found');
  end if;
  return jsonb_build_object('state', 'ok', 'target_type', 'page', 'slug', v_slug);
end;
$$;

-- Restrict + expose RPCs appropriately. --------------------------------------
revoke all on function public.fx_create_workspace(text) from anon;
revoke all on function public.fx_publish_page(uuid, text) from anon;
revoke all on function public.fx_accept_invitation(text) from anon;

grant execute on function public.fx_get_public_page(text) to anon, authenticated;
grant execute on function public.fx_username_home_slug(text) to anon, authenticated;
grant execute on function public.fx_track_event(jsonb) to anon, authenticated;
grant execute on function public.fx_submit_form(jsonb) to anon, authenticated;
grant execute on function public.fx_resolve_nfc(jsonb) to anon, authenticated;


-- ============================================================
-- 0011_storage.sql
-- ============================================================

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


-- ============================================================
-- 0012_platform_data.sql
-- ============================================================

-- Fenix.nfc — 0012 — platform data (plans + system themes). Safe for production.

insert into public.plans (key, name, price, currency, billing_interval, limits, features, sort_order)
values
  ('free', 'Free', 0, 'UZS', 'month',
   '{"pages":1,"nfc_tags":1,"members":1,"storage_mb":100,"forms":1,"leads":50,"analytics_days":7,"custom_domains":0}',
   '{"custom_css":false,"remove_branding":false,"payment_blocks":false,"integrations":false,"advanced_templates":false}', 1),
  ('pro', 'Pro', 79000, 'UZS', 'month',
   '{"pages":10,"nfc_tags":10,"members":3,"storage_mb":2048,"forms":20,"leads":5000,"analytics_days":90,"custom_domains":1}',
   '{"custom_css":true,"remove_branding":true,"payment_blocks":true,"integrations":true,"advanced_templates":true}', 2),
  ('business', 'Business', 199000, 'UZS', 'month',
   '{"pages":100,"nfc_tags":100,"members":15,"storage_mb":20480,"forms":200,"leads":100000,"analytics_days":365,"custom_domains":10}',
   '{"custom_css":true,"remove_branding":true,"payment_blocks":true,"integrations":true,"advanced_templates":true}', 3),
  ('lifetime', 'Lifetime', 2990000, 'UZS', 'once',
   '{"pages":100,"nfc_tags":100,"members":15,"storage_mb":20480,"forms":200,"leads":100000,"analytics_days":365,"custom_domains":10}',
   '{"custom_css":true,"remove_branding":true,"payment_blocks":true,"integrations":true,"advanced_templates":true}', 4),
  ('custom', 'Custom', 0, 'UZS', 'month',
   '{"pages":-1,"nfc_tags":-1,"members":-1,"storage_mb":-1,"forms":-1,"leads":-1,"analytics_days":-1,"custom_domains":-1}',
   '{"custom_css":true,"remove_branding":true,"payment_blocks":true,"integrations":true,"advanced_templates":true}', 5)
on conflict (key) do nothing;

-- Original system themes. Each config drives the public renderer + editor. -----
insert into public.themes (key, name, is_system, sort_order, config, preview)
values
  ('minimal-light', 'Minimal Light', true, 1,
   '{"background":"#FFFFFF","text":"#30343A","heading":"#171717","link":"#4677C8","button_bg":"#171717","button_text":"#FFFFFF","button_radius":10,"card_bg":"#FFFFFF","card_border":"#E1E4E7","card_radius":14,"font":"inter","spacing":14,"content_width":420}',
   '{"bg":"#FFFFFF","accent":"#171717"}'),
  ('minimal-dark', 'Minimal Dark', true, 2,
   '{"background":"#17181B","text":"#D7DADF","heading":"#FFFFFF","link":"#8FB4F2","button_bg":"#FFFFFF","button_text":"#17181B","button_radius":10,"card_bg":"#1F2124","card_border":"#2D3034","card_radius":14,"font":"inter","spacing":14,"content_width":420}',
   '{"bg":"#17181B","accent":"#FFFFFF"}'),
  ('luxury-gold', 'Luxury Black & Gold', true, 3,
   '{"background":"#121212","text":"#CFCFCF","heading":"#F4E9CE","link":"#D6A84B","button_bg":"#D6A84B","button_text":"#171717","button_radius":8,"card_bg":"#1A1A1A","card_border":"#2A2A2A","card_radius":12,"font":"inter","spacing":14,"content_width":420}',
   '{"bg":"#121212","accent":"#D6A84B"}'),
  ('clean-business', 'Clean Business', true, 4,
   '{"background":"#F7F8FA","text":"#30343A","heading":"#1B2733","link":"#2F6FED","button_bg":"#1B2733","button_text":"#FFFFFF","button_radius":8,"card_bg":"#FFFFFF","card_border":"#E1E4E7","card_radius":12,"font":"inter","spacing":12,"content_width":440}',
   '{"bg":"#F7F8FA","accent":"#1B2733"}'),
  ('professional-blue', 'Professional Blue', true, 5,
   '{"background":"#EEF3FB","text":"#2A3340","heading":"#12233D","link":"#2F6FED","button_bg":"#2F6FED","button_text":"#FFFFFF","button_radius":10,"card_bg":"#FFFFFF","card_border":"#D6E0F0","card_radius":14,"font":"inter","spacing":14,"content_width":430}',
   '{"bg":"#EEF3FB","accent":"#2F6FED"}'),
  ('modern-restaurant', 'Modern Restaurant', true, 6,
   '{"background":"#14100D","text":"#E7DFD5","heading":"#F6C177","link":"#F6C177","button_bg":"#C7622B","button_text":"#FFFFFF","button_radius":12,"card_bg":"#1E1813","card_border":"#33291F","card_radius":16,"font":"inter","spacing":16,"content_width":440}',
   '{"bg":"#14100D","accent":"#C7622B"}'),
  ('traditional-restaurant', 'Traditional Restaurant', true, 7,
   '{"background":"#FBF6EC","text":"#3A2E22","heading":"#7A3B1E","link":"#7A3B1E","button_bg":"#7A3B1E","button_text":"#FFF7EC","button_radius":6,"card_bg":"#FFFFFF","card_border":"#E7D8BF","card_radius":10,"font":"inter","spacing":14,"content_width":440}',
   '{"bg":"#FBF6EC","accent":"#7A3B1E"}'),
  ('warm-cafe', 'Warm Cafe', true, 8,
   '{"background":"#F4E9DD","text":"#4A3B2E","heading":"#6B4423","link":"#A5673F","button_bg":"#6B4423","button_text":"#FBF3EA","button_radius":16,"card_bg":"#FFFBF5","card_border":"#E4D2BE","card_radius":18,"font":"inter","spacing":16,"content_width":420}',
   '{"bg":"#F4E9DD","accent":"#6B4423"}'),
  ('premium-hotel', 'Premium Hotel', true, 9,
   '{"background":"#0F1A2B","text":"#C7D2E0","heading":"#E8D9B5","link":"#C9A227","button_bg":"#C9A227","button_text":"#0F1A2B","button_radius":4,"card_bg":"#152238","card_border":"#22314A","card_radius":8,"font":"inter","spacing":16,"content_width":440}',
   '{"bg":"#0F1A2B","accent":"#C9A227"}'),
  ('medical-clean', 'Medical Clean', true, 10,
   '{"background":"#F1FAFB","text":"#28454A","heading":"#0F6E78","link":"#0F9AA8","button_bg":"#0F9AA8","button_text":"#FFFFFF","button_radius":10,"card_bg":"#FFFFFF","card_border":"#D3ECEF","card_radius":14,"font":"inter","spacing":14,"content_width":430}',
   '{"bg":"#F1FAFB","accent":"#0F9AA8"}'),
  ('beauty', 'Beauty', true, 11,
   '{"background":"#FBF0F3","text":"#4A3540","heading":"#B5477A","link":"#C85E92","button_bg":"#B5477A","button_text":"#FFFFFF","button_radius":18,"card_bg":"#FFFFFF","card_border":"#F0D7E1","card_radius":20,"font":"inter","spacing":16,"content_width":420}',
   '{"bg":"#FBF0F3","accent":"#B5477A"}'),
  ('personal-brand', 'Personal Brand', true, 12,
   '{"background":"#FFFFFF","text":"#30343A","heading":"#171717","link":"#D6A84B","button_bg":"#D6A84B","button_text":"#171717","button_radius":12,"card_bg":"#FAFAFA","card_border":"#ECECEC","card_radius":16,"font":"inter","spacing":14,"content_width":420}',
   '{"bg":"#FFFFFF","accent":"#D6A84B"}'),
  ('technology', 'Technology', true, 13,
   '{"background":"#0B0F17","text":"#AEB8C7","heading":"#FFFFFF","link":"#5EE0C4","button_bg":"#5EE0C4","button_text":"#0B0F17","button_radius":8,"card_bg":"#121826","card_border":"#1E2637","card_radius":12,"font":"inter","spacing":14,"content_width":430}',
   '{"bg":"#0B0F17","accent":"#5EE0C4"}'),
  ('event', 'Event', true, 14,
   '{"background":"#161029","text":"#D6CCEC","heading":"#FFFFFF","link":"#B48CFF","button_bg":"#7C4DFF","button_text":"#FFFFFF","button_radius":14,"card_bg":"#211A38","card_border":"#322A52","card_radius":18,"font":"inter","spacing":16,"content_width":430}',
   '{"bg":"#161029","accent":"#7C4DFF"}'),
  ('digital-card', 'Digital Business Card', true, 15,
   '{"background":"#F4F5F6","text":"#30343A","heading":"#2D3034","link":"#4677C8","button_bg":"#2D3034","button_text":"#FFFFFF","button_radius":10,"card_bg":"#FFFFFF","card_border":"#E1E4E7","card_radius":14,"font":"inter","spacing":12,"content_width":400}',
   '{"bg":"#F4F5F6","accent":"#2D3034"}'),
  ('portfolio', 'Portfolio', true, 16,
   '{"background":"#FAFAF8","text":"#33322E","heading":"#111111","link":"#111111","button_bg":"#111111","button_text":"#FFFFFF","button_radius":2,"card_bg":"#FFFFFF","card_border":"#E6E4DE","card_radius":4,"font":"inter","spacing":16,"content_width":460}',
   '{"bg":"#FAFAF8","accent":"#111111"}'),
  ('soft-pastel', 'Soft Pastel', true, 17,
   '{"background":"#F3F1FB","text":"#4A4560","heading":"#5B4B8A","link":"#7C6BB0","button_bg":"#9C8CD6","button_text":"#FFFFFF","button_radius":20,"card_bg":"#FFFFFF","card_border":"#E6E1F5","card_radius":22,"font":"inter","spacing":16,"content_width":420}',
   '{"bg":"#F3F1FB","accent":"#9C8CD6"}'),
  ('bold-creator', 'Bold Creator', true, 18,
   '{"background":"#111111","text":"#EDEDED","heading":"#FFE600","link":"#FFE600","button_bg":"#FFE600","button_text":"#111111","button_radius":24,"card_bg":"#1A1A1A","card_border":"#2A2A2A","card_radius":24,"font":"inter","spacing":18,"content_width":430}',
   '{"bg":"#111111","accent":"#FFE600"}')
on conflict do nothing;

