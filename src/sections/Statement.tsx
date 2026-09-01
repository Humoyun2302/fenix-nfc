import { useLang } from '../locales'
import { Reveal } from '../components/Reveal'
import { SectionMark } from '../components/SectionMark'
import { WoodPlaque } from '../components/WoodPlaque'
import { NfcSymbol } from '../components/marks'
import { FlowArrow, MiniPhone } from '../components/flow'
import './Statement.css'

export function Statement() {
  const { t } = useLang()
  return (
    <section className="statement" id="concept">
      <div className="container">
        <SectionMark num="02" label={t.statement.mark} inverse />

        <h2 className="display statement__title">
          {t.statement.lines.map((line, i) => (
            <Reveal as="span" key={line} className="statement__line" delay={i * 90} style={{ marginLeft: `${i * 4}%` }}>
              {line}
            </Reveal>
          ))}
        </h2>

        <div className="statement__flow">
          <Reveal className="statement__node">
            <div className="statement__obj">
              <WoodPlaque width={170} />
            </div>
            <span className="micro statement__nlabel">{t.statement.object}</span>
          </Reveal>
          <FlowArrow />
          <Reveal className="statement__node" delay={140}>
            <div className="statement__pulse">
              <span className="cssring cssring--1" aria-hidden="true" />
              <span className="cssring cssring--2" aria-hidden="true" />
              <NfcSymbol size={30} color="#FF4B00" strokeWidth={2.3} />
            </div>
            <span className="micro statement__nlabel">{t.statement.tapWord}</span>
          </Reveal>
          <FlowArrow />
          <Reveal className="statement__node" delay={280}>
            <MiniPhone />
            <span className="micro statement__nlabel">{t.statement.phone}</span>
          </Reveal>
        </div>

        <Reveal as="p" className="statement__para" delay={180}>
          {t.statement.para}
        </Reveal>
      </div>
    </section>
  )
}
