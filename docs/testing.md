# Testing

Fenix.nfc uses **Vitest** for unit/integration tests and **Playwright** for
end-to-end tests.

## Unit / integration (Vitest)

```bash
npm run test         # single run
npm run test:watch   # watch mode
```

Current unit coverage (`tests/unit/`):

- `permissions.test.ts` — role/permission helpers
- `slug.test.ts` — slug validation and reserved slugs
- `blocks.test.ts` — block registry integrity + editor-schema coverage for
  every ready block
- `nfc.test.ts` — NFC code generation and validation
- `sanitize.test.ts` — HTML sanitizer (XSS stripping)
- `qr.test.ts` — QR generation, verified by decoding the output

Add tests under `tests/unit/`. Path alias `@/…` resolves to `src/…`
(configured in `vitest.config.ts`).

## End-to-end (Playwright)

```bash
npm run test:e2e
```

`playwright.config.ts` boots the dev server automatically. E2E specs target the
critical flows from the spec:

- **Page building**: register → workspace → page → add blocks → reorder →
  change theme → publish → verify public page
- **Forms**: create form → publish → submit publicly → verify lead + conversion
- **NFC**: create tag → assign page → open managed URL → confirm redirect + scan
  → reassign → confirm same URL opens the new page
- **Invitation**: admin prepares + publishes → sends invite → customer accepts →
  sees existing page → edits + republishes
- **Security**: user A cannot access user B's workspace data (RLS rejects)

E2E requires a running local Supabase stack (`npm run db:start`) with a fresh
database (`npm run db:reset`).

## Recommended pre-commit gate

```bash
npm run typecheck && npm run lint && npm run test && npm run build
```
