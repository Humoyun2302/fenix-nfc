# Supabase setup

Fenix.nfc uses Supabase for PostgreSQL, Auth, Storage, and Row Level Security.

## Local (development)

The local stack is driven entirely by the Supabase CLI (installed as a dev
dependency).

```bash
npm run db:start   # start Postgres/Auth/Storage/Studio in Docker
npm run db:reset   # apply all migrations + platform data seed
```

The CLI prints your local `API URL`, `anon key`, and `service_role key` — copy
them into `.env.local`.

## Cloud (production)

1. Create a project at [supabase.com](https://supabase.com).
2. Link the CLI and push migrations:

   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

   This applies everything in `supabase/migrations/` (schema, RLS, RPCs,
   storage buckets, and the platform data seed) to your cloud database.
3. From **Project Settings → API**, copy the Project URL and anon key into your
   Netlify environment (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`), and the service role key into
   `SUPABASE_SERVICE_ROLE_KEY`.

## Auth configuration

In **Authentication → URL Configuration**:

- **Site URL**: your production origin (e.g. `https://fenixnfc.uz`).
- **Redirect URLs** — add all of:
  - `https://fenixnfc.uz/auth/callback` (OAuth / magic link / email confirm)
  - `https://fenixnfc.uz/reset-password` (password recovery)
  - `http://localhost:3000/auth/callback` and
    `http://localhost:3000/reset-password` for local testing.

Enable the providers you need (Email is on by default). For Google login,
configure the Google provider with its client ID/secret; the app automatically
exposes the Google button when the provider is enabled.

## Storage

Migration `0011_storage.sql` provisions two buckets:

- `media` — workspace media library assets (public read; authenticated write
  scoped to the workspace path).
- `avatars` — profile/brand avatars (public read; scoped write).

No manual bucket creation is required — it is handled by the migration.

## Platform data

Migration `0012_platform_data.sql` inserts subscription **plans** (Free, Pro,
Business, Lifetime, Custom) and the **system theme** gallery. This data is
required for the app to function and is safe to run in production. It is **not**
development-only seed data (users/pages/leads are never auto-inserted).
