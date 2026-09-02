import { useLang } from '../locales'
import { Reveal } from '../components/Reveal'
import { MaskLine } from '../components/MaskLine'
import { SectionMark } from '../components/SectionMark'
import './HowItWorks.css'

export function HowItWorks() {
  const { t } = useLang()
  return (
    <section id="how" className="how">
      <div className="container">
        <SectionMark num="05" label={t.how.mark} />
        <h2 className="display sec-title how__title">
          <MaskLine delay={60}>{t.how.title}</MaskLine>
        </h2>

        <div className="how__steps">
          {t.how.steps.map((s, i) => (
            <Reveal key={s.name} className="how__step" delay={i * 120}>
              <span className="num-ghost how__num" aria-hidden="true">{`0${i + 1}`}</span>
              <h3 className="display how__name">{s.name}</h3>
              <p className="how__line">{s.line}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="how__journey">
          <span className="how__jline" aria-hidden="true" />
          {t.how.journey.map((word, i) => (
            <span key={word} className="how__jword" style={{ transitionDelay: `${350 + i * 150}ms` }}>
              <span className={`how__jdot${i === 2 ? ' how__jdot--ember' : ''}`} aria-hidden="true" />
              <span className="micro">{word}</span>
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
