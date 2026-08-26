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
