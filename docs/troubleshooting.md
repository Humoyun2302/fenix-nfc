# Troubleshooting

## `Invalid public environment variables`

`src/lib/env.ts` validates env at startup. This error means one of
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing or
malformed. Copy `.env.example` to `.env.local` and fill in the values printed by
`npm run db:start`. Remember `NEXT_PUBLIC_*` vars are needed at **build** time
too.

## `npm run db:start` fails

The Supabase CLI needs Docker. Ensure Docker Desktop (or a compatible engine) is
running, then retry. If ports are in use, stop other Postgres/Supabase instances
or run `npx supabase stop` first.

## Types resolve to `never` / query results untyped

`src/types/database.ts` must satisfy the Supabase client's `GenericSchema`.
Row shapes are declared as `type` aliases (not `interface`) on purpose —
interfaces lack an implicit index signature and are not assignable to
`Record<string, unknown>`, which silently degrades every query type to `never`.
Regenerate with `npm run db:types` after schema changes and keep rows as
`type` aliases.

## Auth redirect / magic link / password reset not working

The origin in `NEXT_PUBLIC_SITE_URL` must exactly match a Supabase **Redirect
URL** (Authentication → URL Configuration). Add both your production and
`http://localhost:3000` callback + reset URLs. See
[supabase-setup.md](./supabase-setup.md).

## NFC managed URL shows a status page instead of redirecting

`/t/<code>` redirects to `/nfc-status` when the tag is unknown, disabled, or the
workspace is suspended. Verify the tag is `active`, assigned to a published page
or approved URL, and that the workspace status is `active`.

## Public page shows "not found" / "unpublished"

Public pages only serve **published** snapshots. Open the page in the editor and
press **Publish**. Confirm the page `status` is `published` and the workspace is
not suspended.

## Build succeeds locally but fails on Netlify

Ensure all four env vars are set in Netlify **before** the build (they are
inlined at build time), and that migrations have been pushed to the cloud
Supabase project. Check the Netlify function logs for server errors.

## Middleware deprecation warning

Next.js 16 renamed the `middleware` convention to `proxy`. This project already
uses `src/proxy.ts`; if you re-add a `middleware.ts`, migrate it with
`npx @next/codemod@canary middleware-to-proxy .`.
