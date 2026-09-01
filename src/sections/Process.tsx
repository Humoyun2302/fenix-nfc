import { MaskedLines, Reveal } from '@/components/Reveal'
import { useI18n } from '@/i18n'

export function Process() {
  const { lang, t } = useI18n()

  return (
    <section id="process" className="section-y relative" aria-labelledby="process-title">
      <div className="shell">
        <div className="max-w-[36rem]">
          <p className="eyebrow">{t.howItWorks.eyebrow}</p>
          <MaskedLines
            key={lang}
            as="h2"
            id="process-title"
            lines={[t.howItWorks.title]}
            className="display-2 mt-4 text-ink"
          />
        </div>

        <ol className="process-track mt-14 sm:mt-16">
          {t.howItWorks.steps.map((step, index) => (
            <li key={step.index} className="process-step">
              <Reveal delay={index * 0.08}>
                <span className="numeral process-index">{step.index}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
