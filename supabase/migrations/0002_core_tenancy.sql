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
