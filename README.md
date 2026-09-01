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
  data/         products.ts · usecases.ts · projects.ts (layout + icon data)
  sections/     Hero · Statement · Products · UseCases · HowItWorks ·
                Projects · Cta  (one file + one css each)
  components/   WoodPlaque · AcrylicPlaque · BusinessCard · RoundTag (vector
                product renders), Phone (realistic smartphone demo), Scene
                (per-industry environments), Nav, Footer, marks, flow, Reveal
  styles/       global.css (design tokens, grain, type system, buttons)
  assets/       plaquePhoto.ts (real photography slot — see below)
```

## Using the real plaque photograph

The site currently uses a vector studio render of the wooden plaque.
When the real photo is ready:

1. Drop the file at `src/assets/wood-plaque.jpg`
2. Open `src/assets/plaquePhoto.ts`, uncomment the import and set
   `plaquePhoto = photo`

Every plaque on the site (hero, products, projects, scenes) switches to the
photograph automatically, clipped to the same rounded geometry.

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
