# FENIX NFC — website

Premium, editorial, product-first website for Fenix NFC.
**Physical → Tap → Digital.** Uzbek-first, with Russian and English.

Stack: **React 19 + Vite 7 + TypeScript**. No backend, static deploy.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
npm run preview    # serve the production build locally
```

## Deploy to Netlify

`netlify.toml` is included. Either connect the repo in Netlify
(build command `npm run build`, publish directory `dist`) or:

```bash
npx netlify-cli deploy --prod
```

## Structure

```
src/
  locales/      uz.ts · ru.ts · en.ts · LangProvider (typed dictionaries —
                a missing translation is a compile error; UZ is the default,
                choice persists in localStorage "fenix.lang")
  data/         products.ts · usecases.ts (icons) · works.ts (photography
                index: hero/product photos, per-scene client products,
                6 featured projects, 20-item archive)
  sections/     Hero · Statement · Products · UseCases · HowItWorks ·
                Projects · Cta  (one file + one css each)
  components/   Phone (realistic smartphone demo), Scene (photo + hairline
                environment per industry), Nav, Footer, marks, flow, Reveal,
                WoodPlaque/AcrylicPlaque/… (vector renders, still used in
                decorative CTA artwork)
  styles/       global.css (design tokens, grain, type system, buttons)
  assets/works/ 27 optimized WebP product photographs (real client work)
```

## Product photography

Real photos live in `src/assets/works/` and are indexed in
`src/data/works.ts` (which piece appears in the hero, each product row,
each use-case scene, the featured project grid and the archive).

Most product photos are transparent WebP cutouts. The shared `.ph` class
keeps their rendering consistent, while each section adds a suitable
drop shadow and sizing for its background. The gym scene intentionally
keeps its original white studio background.
Any new photo: convert to WebP (~1200px wide, quality 82), drop it in
`assets/works/`, and reference it from `works.ts`.

## Placeholders to replace before launch

- **Contacts** — `@fenixnfc`, `hello@fenixnfc.uz`, `+998 90 000 00 00`
  appear in `src/sections/Cta.tsx` and `src/components/Footer.tsx`.
- **Instagram link** in `Footer.tsx`.

## Design system

- Palette: warm off-white `#F3F1EB`, deep black `#0A0A0A`, warm grey
  `#D9D5CC`, single accent **ember orange `#FF4B00`** (used only for the
  tap pulse, active states, micro-labels and hover fills).
- Type: Inter Tight (display) + Inter (text), self-hosted via Fontsource,
  Cyrillic subsets included.
- 12-column grid, deliberate grid breaks, oversized outlined section
  numbers, hairline rules, micro-labels, near-invisible paper grain.
- Motion: scroll reveals, ≤2° pointer tilt on the hero product, NFC pulse,
  crossfading use-case stage. `prefers-reduced-motion` disables everything.
