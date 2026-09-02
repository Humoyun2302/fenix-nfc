import { useLang } from '../locales'
import { Reveal } from '../components/Reveal'
import { MaskLine } from '../components/MaskLine'
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
          {t.statement.lines.map((line, i) => {
            const last = i === t.statement.lines.length - 1
            return (
              <MaskLine
                key={line}
                className={`statement__line${last ? ' mline--loose' : ''}`}
                delay={i * 100}
                style={{ marginLeft: `${i * 4}%` }}
              >
                {last ? (
                  <span className="st-circle">
                    {line}
                    {/* hand-drawn ember ring around the connecting word */}
                    <svg className="st-circle__svg" viewBox="0 0 320 120" preserveAspectRatio="none" aria-hidden="true">
                      <path
                        pathLength={1}
                        d="M160 11 C 252 4, 309 30, 307 59 C 305 93, 231 113, 151 111 C 67 109, 12 89, 10 57 C 8 26, 80 8, 186 13"
                        fill="none"
                        stroke="var(--ember)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </span>
                ) : (
                  line
                )}
              </MaskLine>
            )
          })}
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
              <NfcSymbol size={30} color="#5B8CFF" strokeWidth={2.3} />
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
