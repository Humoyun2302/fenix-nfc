# Netlify deployment

Fenix.nfc deploys to Netlify using the official Next.js runtime plugin, which
supports the App Router: server components, route handlers, server actions, and
the `proxy` (session-refresh) layer.

## Configuration

`netlify.toml` (repo root) already defines:

- Build command: `npm run build`
- Publish directory: `.next`
- Node version: 20
- `@netlify/plugin-nextjs`
- Baseline security headers

## Steps

1. **Push** the repository to GitHub/GitLab and create a new Netlify site from
   it (or `npx netlify init`).
2. **Environment variables** — under **Site settings → Environment variables**,
   add (see [environment.md](./environment.md)):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your production origin, e.g. `https://fenixnfc.uz`)
   - `SUPABASE_SERVICE_ROLE_KEY`

   > `NEXT_PUBLIC_*` values are inlined at build time — set them **before** the
   > first build or trigger a redeploy after changing them.
3. **Database** — push migrations to your cloud Supabase project (see
   [supabase-setup.md](./supabase-setup.md) and
   [database-migrations.md](./database-migrations.md)).
4. **Auth redirect URLs** — in Supabase, register your production
   `/auth/callback` and `/reset-password` URLs (see
   [supabase-setup.md](./supabase-setup.md)).
5. **Deploy.** Netlify runs `npm run build` and serves the site.

## Post-deploy verification

Confirm each of these works in production:

- [ ] Register, log in, log out, magic link, password reset
- [ ] Create a workspace and a page
- [ ] Add/edit/reorder blocks; changes persist after refresh
- [ ] Publish; the public page at `/p/<slug>` reflects the published snapshot
- [ ] Public form submission creates a lead
- [ ] Analytics events are recorded (statistics page updates)
- [ ] NFC managed URL `/t/<code>` redirects and records a scan
- [ ] QR codes generate and scan correctly
- [ ] No server-side console errors in the Netlify function logs

## Custom domain

Point your apex/subdomain at Netlify per their DNS instructions and set
`NEXT_PUBLIC_SITE_URL` to the final origin. For customer-connected domains
inside the product, see [domains.md](./domains.md).
