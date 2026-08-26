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
