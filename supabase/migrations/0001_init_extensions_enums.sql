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
