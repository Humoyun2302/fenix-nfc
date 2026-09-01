export type Lang = 'uz' | 'ru' | 'en'

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'uz', label: 'UZ' },
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' },
]

export const STORAGE_KEY = 'fenix-language'
export const DEFAULT_LANG: Lang = 'uz'

export type ProductKey = 'acrylic' | 'wood' | 'card' | 'custom'
export type SolutionKey = 'restaurants' | 'hotels' | 'doctors' | 'gyms' | 'business'
export type ProjectKey = 'restaurant' | 'hotel' | 'gym' | 'card'

type ProductCopy = {
  name: string
  line: string
  labels: [string, string, string]
  alt: string
}

type SolutionCopy = {
  label: string
  headline: string
  sentence: string
  screen: {
    kicker: string
    title: string
    subtitle: string
    actions: string[]
    media?: string
    stats?: { label: string; value: string }[]
  }
}

type ProjectCopy = {
  title: string
  category: string
  summary: string
}

export type Dictionary = {
  meta: { title: string; description: string }
  a11y: {
    skip: string
    openMenu: string
    closeMenu: string
    close: string
    lang: string
    primaryNav: string
    footerNav: string
    useCases: string
    home: string
    tapPlaque: string
  }
  nav: {
    products: string
    solutions: string
    projects: string
    howItWorks: string
    contact: string
  }
  hero: {
    kicker: string
    line1: string
    line2: string
    lede: string
    ctaProducts: string
    ctaContact: string
    scroll: string
  }
  products: {
    eyebrow: string
    title: string
    items: Record<ProductKey, ProductCopy>
  }
  solutions: {
    eyebrow: string
    title: string
    tapHint: string
  } & Record<SolutionKey, SolutionCopy>
  howItWorks: {
    eyebrow: string
    title: string
    steps: { index: string; title: string; body: string }[]
  }
  projects: {
    eyebrow: string
    title: string
    items: Record<ProjectKey, ProjectCopy>
  }
  contact: {
    eyebrow: string
    title: string
    line: string
    cta: string
    telegram: string
    instagram: string
    phone: string
    email: string
    location: string
    formName: string
    formReach: string
    formReachPlaceholder: string
    formIdea: string
    formIdeaPlaceholder: string
    formSend: string
    formSending: string
    formHint: string
    formReceived: string
    formReceivedBody: string
    honeypot: string
  }
  footer: {
    tagline: string
    note: string
  }
  phoneUi: {
    poweredBy: string
    idleHint: string
    time: string
  }
}

export function isLang(value: string | null): value is Lang {
  return value === 'uz' || value === 'ru' || value === 'en'
}
