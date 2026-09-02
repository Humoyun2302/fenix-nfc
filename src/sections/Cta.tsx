import { ArrowRight, Mail, Phone, Send } from 'lucide-react'
import { useLang } from '../locales'
import { useTilt } from '../hooks/useTilt'
import { useMagnet } from '../hooks/useMagnet'
import { Reveal } from '../components/Reveal'
import { MaskLine } from '../components/MaskLine'
import { SectionMark } from '../components/SectionMark'
import { WoodPlaque } from '../components/WoodPlaque'
import { NfcSymbol } from '../components/marks'
import './Cta.css'

export function Cta() {
  const { t } = useLang()
  const plaqueRef = useTilt<HTMLDivElement>(4)
  const magnetRef = useMagnet<HTMLAnchorElement>()
  return (
    <section id="contact" className="cta">
      <div className="container">
        <div className="cta__panel">
          <NfcSymbol size={460} color="rgba(255,255,255,0.06)" strokeWidth={1.1} className="cta__ghost" />
          <div className="cta__plaque" aria-hidden="true" ref={plaqueRef}>
            <WoodPlaque width={560} />
          </div>

          <div className="cta__inner">
            <SectionMark num="07" label={t.cta.mark} inverse />
        <h2 className="display cta__title">
          {t.cta.title.map((line, i) => {
            const last = i === t.cta.title.length - 1
            return (
              <MaskLine key={line} className="cta__line" delay={i * 110}>
                {last ? (
                  <span className="cta__fillwrap">
                    {line}
                    {/* ember fill sweeps through the outlined line once it has risen */}
                    <span className="cta__fill" aria-hidden="true">
                      {line}
                    </span>
                  </span>
                ) : (
                  line
                )}
              </MaskLine>
            )
          })}
        </h2>
        <Reveal as="p" className="cta__sub" delay={200}>
          {t.cta.line}
        </Reveal>
        <Reveal className="cta__actions" delay={280}>
          <a className="btn btn--paper" href="https://t.me/fenixnfc" target="_blank" rel="noreferrer" ref={magnetRef}>
            {t.cta.button}
            <ArrowRight className="btn__arrow" size={15} strokeWidth={2} />
          </a>
        </Reveal>
            <Reveal className="cta__contacts" delay={360}>
              <a href="https://t.me/fenixnfc" target="_blank" rel="noreferrer" className="cta__contact">
                <Send size={13} strokeWidth={1.8} />
                <span className="micro">{t.cta.tg}</span>
                <span className="cta__val">@fenixnfc</span>
              </a>
              <a href="mailto:hello@fenixnfc.uz" className="cta__contact">
                <Mail size={13} strokeWidth={1.8} />
                <span className="micro">{t.cta.email}</span>
                <span className="cta__val">hello@fenixnfc.uz</span>
              </a>
              <a href="tel:+998900000000" className="cta__contact">
                <Phone size={13} strokeWidth={1.8} />
                <span className="micro">{t.cta.phoneLabel}</span>
                <span className="cta__val">+998 90 000 00 00</span>
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
