# Fenix.nfc Setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
4. Run `npx supabase link --project-ref <ref>`.
5. Run `npx supabase db push`.
6. Configure Supabase Auth redirect URLs:
   - `http://localhost:3000/dashboard`
   - `https://<netlify-site>/dashboard`
   - `https://<netlify-site>/reset-password`
7. Run `npm run verify`.

For production, set secrets in Netlify project environment variables, not in `netlify.toml`.
