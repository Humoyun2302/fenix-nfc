export type Locale = "ru" | "uz";
export type Pair = readonly [string, string];
export type Triple = readonly [string, string, string];

export type Dictionary = {
  meta: { title: string; description: string };
  common: { contact: string; learn: string; menu: string; close: string; language: string; scroll: string; privacy: string; top: string; next: string };
  nav: { solutions: string; how: string; projects: string; about: string; contacts: string };
  journey: { label: string; hints: { solutions: string; how: string; projects: string; contacts: string } };
  hero: { kicker: string; title: string; subtitle: string; solutions: string; discuss: string; connected: string; cardLabel: string };
  marquee: readonly string[];
  solutions: { eyebrow: string; title: string; subtitle: string; items: readonly Pair[] };
  how: { eyebrow: string; title: string; items: readonly Triple[]; wave: string };
  demo: { eyebrow: string; title: string; sentence: string; profile: string; menu: string; website: string; telegram: string; instagram: string; contacts: string; menuItems: readonly string[] };
  uses: { eyebrow: string; title: string; subtitle: string; items: readonly { title: string; description: string; benefits: readonly [string, string, string] }[] };
  projects: { eyebrow: string; title: string; subtitle: string; view: string; categories: Record<"hospitality" | "business" | "events", string>; descriptions: Record<"nova" | "volt" | "artline", string> };
  benefits: { eyebrow: string; title: string; items: readonly Pair[] };
  about: { eyebrow: string; title: string; paragraphs: readonly [string, string] };
  process: { eyebrow: string; title: string; items: readonly Triple[] };
  faq: { eyebrow: string; title: string; open: string; items: readonly Pair[] };
  cta: { eyebrow: string; title: string; subtitle: string; telegram: string; contact: string };
  footer: { description: string; navigation: string; contacts: string; social: string; copyright: string; privacy: string };
};
