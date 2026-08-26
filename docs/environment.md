# Environment variables

Copy `.env.example` to `.env.local` for development. On Netlify, set the same
keys under **Site settings → Environment variables**.

`NEXT_PUBLIC_*` variables are inlined into the client bundle at **build time**,
so they must be present when `next build` runs. All values are validated at
startup by `src/lib/env.ts` (Zod); a missing/invalid value fails fast with a
clear message rather than causing a confusing runtime error.

| Variable                         | Scope        | Required | Description                                                                 |
| -------------------------------- | ------------ | -------- | --------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`       | Client       | Yes      | Supabase project URL. Local: `http://127.0.0.1:54321`.                       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`  | Client       | Yes      | Anon key. Safe to expose — RLS enforces all access.                          |
| `NEXT_PUBLIC_SITE_URL`           | Client       | No\*     | Canonical public origin (no trailing slash). Defaults to `http://localhost:3000`. |
| `SUPABASE_SERVICE_ROLE_KEY`      | Server only  | No\*\*   | Service role key. Bypasses RLS. Used for admin/privileged server operations. |

\* Required in production — it powers auth redirect URLs, invitation links,
NFC/QR managed URLs, and Open Graph metadata. Set it to your real domain
(e.g. `https://fenixnfc.uz`).

\*\* Optional for the core app, but required for super-admin actions, payment
webhooks, and other privileged server-only flows. **Never** expose it to the
client or prefix it with `NEXT_PUBLIC_`.

## Example `.env.local` (local development)

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from `npm run db:start`>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SUPABASE_SERVICE_ROLE_KEY=<service role key from `npm run db:start`>
```

## Production notes

- Rotate the service role key if it is ever exposed.
- `NEXT_PUBLIC_SITE_URL` must exactly match the origin registered in Supabase
  Auth redirect settings (see [supabase-setup.md](./supabase-setup.md)).
