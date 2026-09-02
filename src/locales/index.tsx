import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import type { ReactNode } from 'react'
import { uz } from './uz'
import { ru } from './ru'
import { en } from './en'
import type { Dict, Lang } from './types'

const DICTS: Record<Lang, Dict> = { uz, ru, en }
const STORAGE_KEY = 'fenix.lang'

interface LangValue {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
}

const LangContext = createContext<LangValue | null>(null)

function readStoredLang(): Lang {
  // Uzbek is always the default — no auto-detection on first visit.
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s === 'uz' || s === 'ru' || s === 'en') return s
  } catch {
    /* storage unavailable */
  }
  return 'uz'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  const setLang = (l: Lang) => {
    const apply = () => {
      setLangState(l)
      try {
        localStorage.setItem(STORAGE_KEY, l)
      } catch {
        /* storage unavailable */
      }
    }
    // Crossfade the whole page between languages where the browser can.
    const doc = document as Document & { startViewTransition?: (cb: () => void) => void }
    if (doc.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      doc.startViewTransition(() => flushSync(apply))
    } else {
      apply()
    }
  }

  useEffect(() => {
    const t = DICTS[lang]
    document.documentElement.lang = lang
    document.title = t.meta.title
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', t.meta.description)
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, t: DICTS[lang] }), [lang])
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang(): LangValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
