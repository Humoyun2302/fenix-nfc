import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../locales'
import { USE_CASES } from '../data/usecases'
import type { CaseId } from '../data/usecases'
import { Reveal } from '../components/Reveal'
import { SectionMark } from '../components/SectionMark'
import { Scene } from '../components/Scene'
import { Phone } from '../components/Phone'
import { Connector } from '../components/flow'
import './UseCases.css'

export function UseCases() {
  const { t } = useLang()
  const [active, setActive] = useState<CaseId>('restaurant')

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const idx = USE_CASES.findIndex((c) => c.id === active)
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault()
      const next = USE_CASES[(idx + 1) % USE_CASES.length].id
      setActive(next)
      document.getElementById(`uctab-${next}`)?.focus()
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = USE_CASES[(idx + USE_CASES.length - 1) % USE_CASES.length].id
      setActive(prev)
      document.getElementById(`uctab-${prev}`)?.focus()
    }
  }

  return (
    <section id="solutions" className="uc">
      <div className="container">
        <SectionMark num="04" label={t.cases.mark} />
        <h2 className="display sec-title">
          {t.cases.title.map((line, i) => (
            <Reveal as="span" key={line} className="sec-title__line" delay={i * 90}>
              {line}
            </Reveal>
          ))}
        </h2>
      </div>

      <div className="container uc__layout">
        <Reveal className="uc__rail">
          <span className="micro micro--mute uc__hint">{t.cases.hint}</span>
          <div className="uc__tabs" role="tablist" aria-label={t.cases.mark} onKeyDown={onKeyDown}>
            {USE_CASES.map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`uctab-${c.id}`}
                aria-selected={active === c.id}
                aria-controls={`ucpanel-${c.id}`}
                tabIndex={active === c.id ? 0 : -1}
                className={`uc__tab${active === c.id ? ' on' : ''}`}
                onClick={() => setActive(c.id)}
              >
                <span className="uc__tabnum micro">{c.num}</span>
                <span className="uc__tabname display">{t.cases.items[c.id].label}</span>
                <ArrowRight className="uc__tabarrow" size={18} strokeWidth={1.75} />
              </button>
            ))}
          </div>
          <div className="uc__headlines">
            {USE_CASES.map((c) => (
              <p key={c.id} className={`uc__headline${active === c.id ? ' on' : ''}`} aria-hidden={active !== c.id}>
                {t.cases.items[c.id].headline}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal className="uc__stagewrap" delay={120}>
          {USE_CASES.map((c) => (
            <div
              key={c.id}
              role="tabpanel"
              id={`ucpanel-${c.id}`}
              aria-labelledby={`uctab-${c.id}`}
              className={`uc__slide${active === c.id ? ' on' : ''}`}
              aria-hidden={active !== c.id}
            >
              <div className="uc__scenebox">
                <Scene id={c.id} tapLabel={t.common.tap} />
                <span className="micro micro--mute uc__caption">{t.cases.items[c.id].caption}</span>
              </div>
              <Connector />
              <Phone caseId={c.id} className="uc__phone" />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
