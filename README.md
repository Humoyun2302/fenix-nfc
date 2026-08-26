# Fenix.nfc

Fenix.nfc is a production-shaped SaaS builder for mobile-first mini websites, NFC-connected pages, QR codes, forms, leads, analytics, and customer-prepared workspaces.

## Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Supabase Auth, PostgreSQL, RLS, Storage-ready workspace paths
- React Hook Form, Zod, TanStack Query-ready architecture
- dnd-kit editor ordering
- Lucide icons, Recharts-ready analytics modules
- Vitest and Playwright
- Netlify deployment config

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Supabase-backed workflows require the environment variables in `.env.example`. Without them, protected routes show a configuration-required state instead of fake data.

## Database

Run the migration in `supabase/migrations` against a linked Supabase project:

```bash
npx supabase link --project-ref <ref>
npx supabase db push
```

Development-only seed data lives in `supabase/seed/dev_seed.sql`.

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

## Deployment

Netlify uses `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `.next`
- Node: 22

Set secrets in Netlify environment variables, not in source control.

See `docs/SETUP.md` and `docs/OPERATIONS.md` for setup, Auth redirects, NFC, QR, deployment, backup, and troubleshooting notes.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
