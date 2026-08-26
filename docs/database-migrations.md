# Database & migrations

All schema changes are versioned SQL files in `supabase/migrations/`, applied in
filename order.

## Migration files

| File                                   | Contents                                                        |
| -------------------------------------- | -------------------------------------------------------------- |
| `0001_init_extensions_enums.sql`       | Extensions (`pgcrypto`, `citext`), enum types, `updated_at` trigger fn |
| `0002_core_tenancy.sql`                | `profiles`, `plans`, `workspaces`, `workspace_members`, `invitations` |
| `0003_auth_helpers.sql`                | `SECURITY DEFINER` RLS helper functions                        |
| `0004_pages_blocks.sql`                | `pages`, `blocks`, `page_versions`, `themes`, `brand_kits`     |
| `0005_media_forms_leads.sql`           | `media`, `forms`, `form_fields`, `form_submissions`, `leads`, tags, notes |
| `0006_analytics_nfc_qr.sql`            | `analytics_events`, `nfc_tags`, `nfc_scans`, `qr_configs`      |
| `0007_products_domains_integrations.sql` | `product_categories`, `products`, `domains`, `integrations`  |
| `0008_billing_notifications_audit.sql` | `subscriptions`, `payments`, `notifications`, settings, `audit_logs` |
| `0009_rls_policies.sql`                | Enables RLS + policies on every user-facing table              |
| `0010_functions_rpcs.sql`              | Triggers + RPCs (workspace bootstrap, publish, invitations, public reads) |
| `0011_storage.sql`                     | Storage buckets + policies                                     |
| `0012_platform_data.sql`               | Plans + system themes (production-safe seed)                   |

## Design conventions

- **UUID** primary keys (`gen_random_uuid()`).
- `created_at` / `updated_at` timestamps; `updated_at` maintained by the
  `fx_set_updated_at` trigger.
- Foreign keys with deliberate `ON DELETE` behavior (cascade only where a child
  cannot exist without its parent).
- Indexes on all foreign keys and common query filters (workspace_id, slug,
  status, created_at).

## Applying migrations

**Local:**

```bash
npm run db:reset   # drop + recreate + apply all migrations and platform data
```

**Cloud:**

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

## Adding a migration

```bash
npx supabase migration new <descriptive_name>
# edit the generated file under supabase/migrations/
npm run db:reset       # verify locally
npm run db:types       # regenerate src/types/database.ts
```

Keep `src/types/database.ts` in sync with the schema after every change.

## Backups

Enable automated backups on your Supabase cloud project (Project Settings →
Database → Backups). For manual dumps:

```bash
npx supabase db dump --file backup.sql            # schema + data
npx supabase db dump --data-only --file data.sql  # data only
```
