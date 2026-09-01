import { useLang } from '../locales'
import { LANGS } from '../locales/types'

export function LangSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLang()
  return (
    <div className={`langs ${className}`.trim()} role="group" aria-label={t.common.langLabel}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className={`langs__btn${l === lang ? ' on' : ''}`}
          aria-pressed={l === lang}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
