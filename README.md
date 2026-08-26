# Fenix.nfc

A production-ready, multi-tenant SaaS **website builder** for mobile-first mini
sites, digital business cards, restaurant menus, and NFC-connected pages.
Inspired by the compact editing workflow of Taplink, built with entirely
original code and branding.

> **Status:** Rock-solid vertical slice — project init, full database schema +
> migrations + RLS, authentication, workspaces, the Taplink-style block editor,
> draft/publish, public page rendering, forms/leads, analytics, NFC redirects,
> and QR codes are implemented and verified (typecheck, lint, unit tests, and a
> production build all pass). Outer surfaces (super-admin, billing gateways,
> custom domains, integrations) are scaffolded and expand from here.

## Tech stack

| Area          | Choice                                            |
| ------------- | ------------------------------------------------- |
| Framework     | Next.js 16 (App Router, Turbopack) + React 19     |
| Language      | TypeScript (strict)                               |
| Styling       | Tailwind CSS v4 with Fenix brand tokens           |
| Backend / DB  | Supabase (PostgreSQL, Auth, Storage, RLS)         |
| Forms         | React Hook Form + Zod                             |
| Data fetching | TanStack Query (client) + Server Actions          |
| Drag & drop   | dnd-kit                                            |
| Icons         | lucide-react                                       |
| Charts        | Recharts                                           |
| QR codes      | `qrcode`                                           |
| Testing       | Vitest (unit/integration) + Playwright (E2E)      |
| Deployment    | Netlify                                            |

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local   # then fill in the values (see docs/environment.md)

# 3. Start the local Supabase stack (requires Docker) and apply migrations
npm run db:start
npm run db:reset             # applies supabase/migrations + platform data

# 4. (Optional) regenerate DB types from the local schema
npm run db:types

# 5. Run the app
npm run dev                  # http://localhost:3000
```

## Scripts

| Script              | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Start the dev server                               |
| `npm run build`     | Production build                                   |
| `npm run start`     | Serve the production build                          |
| `npm run lint`      | ESLint                                             |
| `npm run typecheck` | `tsc --noEmit`                                     |
| `npm run test`      | Unit/integration tests (Vitest, single run)       |
| `npm run test:watch`| Vitest in watch mode                              |
| `npm run test:e2e`  | Playwright end-to-end tests                        |
| `npm run db:start`  | Start local Supabase (Docker)                      |
| `npm run db:reset`  | Reset + re-apply all migrations and platform data  |
| `npm run db:types`  | Generate `src/types/database.ts` from local schema |

## Project structure

```
src/
  app/
    (auth)/          Login, register, password reset, magic link
    (app)/           Authenticated shell: dashboard, editor, statistics,
                     leads, products, settings/*
    p/[slug]/        Public page renderer
    t/[code]/        NFC managed-URL redirect
    invite/[token]/  Customer invitation claim
    api/public/*     Public tracking + form submission endpoints
  components/        UI primitives, editor, blocks, analytics, nfc, qr
  lib/
    supabase/        Client/server/admin clients + session proxy helper
    permissions/     Role helpers mirroring RLS
    validation/      Zod schemas
    blocks/          Block registry, editor schema, sanitizer
    design/          Theme resolution
    publishing/      Public page fetching
    nfc/ qr/         Code generation
  types/             Hand-authored database types
supabase/
  migrations/        Ordered SQL migrations (schema, RLS, RPCs, storage, data)
  config.toml        Local Supabase config
tests/
  unit/              Vitest unit tests
  e2e/               Playwright specs
docs/                Setup, deployment, and operations guides
```

## Documentation

All guides live in [`docs/`](./docs):

- [Local development](./docs/local-development.md)
- [Supabase setup](./docs/supabase-setup.md)
- [Database & migrations](./docs/database-migrations.md)
- [Environment variables](./docs/environment.md)
- [Netlify deployment](./docs/deployment-netlify.md)
- [Admin & customer invitations](./docs/admin-invitations.md)
- [NFC & QR setup](./docs/nfc-qr.md)
- [Custom domains](./docs/domains.md)
- [Payments & integrations](./docs/payments-integrations.md)
- [Testing](./docs/testing.md)
- [Troubleshooting](./docs/troubleshooting.md)

## Security model

Every user-facing table is protected by PostgreSQL **Row Level Security**.
Workspace isolation is enforced at the database layer via `SECURITY DEFINER`
helper functions (`fx_is_member`, `fx_can_edit`, `fx_can_manage`, …), so a user
can never reach another workspace by tampering with IDs in URLs or requests.
Public visitors interact only through audited RPCs (`fx_get_public_page`,
`fx_track_event`, `fx_submit_form`, `fx_resolve_nfc`). Server actions validate
all input with Zod and never trust client-supplied identity.
