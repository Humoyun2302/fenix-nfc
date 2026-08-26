# Operations Guide

Fenix.nfc uses Supabase Auth, Postgres, Storage-ready workspace paths, RLS, server actions, and Next.js App Router.

- Deploy on Netlify with `npm run build` and publish `.next`.
- Public pages read only `published_snapshot`.
- Editor changes remain draft data until `Publish` creates a page version.
- NFC URLs use `/t/:code`, record scans, and reject unsafe redirects.
- Forms validate payloads server-side, create leads, and record conversion analytics.
- Billing providers show configuration-required states until credentials are set.
- Seed data in `supabase/seed/dev_seed.sql` is development-only.

Backup Supabase with scheduled database backups and export storage buckets before destructive maintenance.
