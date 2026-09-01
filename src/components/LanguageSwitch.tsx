import { LANGS, type Lang } from '@/i18n/types'
import { useI18n } from '@/i18n'

type LanguageSwitchProps = {
  /** Larger touch targets for the mobile overlay. */
  stacked?: boolean
}

export function LanguageSwitch({ stacked = false }: LanguageSwitchProps) {
  const { lang, setLang, t } = useI18n()

  return (
    <div
      role="radiogroup"
      aria-label={t.a11y.lang}
      className={stacked ? 'lang-switch lang-switch-stacked' : 'lang-switch'}
    >
      {LANGS.map((item) => (
        <button
          key={item.id}
          type="button"
          role="radio"
          aria-checked={lang === item.id}
          onClick={() => setLang(item.id as Lang)}
          className={lang === item.id ? 'is-active' : ''}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
