import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { en } from './en'
import { ru } from './ru'
import { DEFAULT_LANG, isLang, STORAGE_KEY, type Lang } from './types'
import { uz } from './uz'
import type { Dictionary } from './types'

const dictionaries: Record<Lang, Dictionary> = { uz, ru, en }

type I18nValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: Dictionary
}

const I18nContext = createContext<I18nValue | null>(null)

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {
    /* private mode */
  }
  return DEFAULT_LANG
}

function applyDocumentLang(lang: Lang, dict: Dictionary) {
  document.documentElement.lang = lang
  document.title = dict.meta.title
  const meta = document.querySelector('meta[name="description"]')
  if (meta) meta.setAttribute('content', dict.meta.description)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang)

  useEffect(() => {
    applyDocumentLang(lang, dictionaries[lang])
  }, [lang])

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: (next) => {
        setLangState(next)
        try {
          window.localStorage.setItem(STORAGE_KEY, next)
        } catch {
          /* ignore */
        }
      },
      t: dictionaries[lang],
    }),
    [lang],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within LanguageProvider')
  return ctx
}
