# Local development

## Prerequisites

- **Node.js 20+** (Netlify build uses Node 20).
- **Docker Desktop** (or a compatible engine) — required by the Supabase CLI to
  run the local stack.
- The Supabase CLI is installed as a dev dependency, so `npx supabase` / the
  `npm run db:*` scripts work without a global install.

## First-time setup

```bash
npm install
cp .env.example .env.local
```

Fill `.env.local` with your local Supabase values (the CLI prints them after
`npm run db:start`). See [environment.md](./environment.md) for each variable.

## Running the database

```bash
npm run db:start   # boots Postgres, Auth, Storage, Studio in Docker
npm run db:reset   # drops + recreates the DB and applies every migration
```

`db:reset` runs all files in `supabase/migrations/` in order, including the
platform data seed (plans + system themes). Supabase Studio is available at the
URL printed by the CLI (typically http://127.0.0.1:54323).

## Running the app

```bash
npm run dev        # http://localhost:3000
```

## Type generation

The database types in `src/types/database.ts` are hand-authored to mirror the
migrations. When you change the schema, regenerate them from the running local
stack:

```bash
npm run db:types
```

## Quality gates

Run these before committing; CI/deploy expects all four to pass:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Troubleshooting

If the app throws `Invalid public environment variables`, your `.env.local` is
missing or incomplete. See [environment.md](./environment.md). For Docker/DB
issues, see [troubleshooting.md](./troubleshooting.md).
