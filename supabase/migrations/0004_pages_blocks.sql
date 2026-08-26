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
