import { ArrowRight, Mail, Phone, Send } from 'lucide-react'
import { useLang } from '../locales'
import { Reveal } from '../components/Reveal'
import { SectionMark } from '../components/SectionMark'
import { WoodPlaque } from '../components/WoodPlaque'
import { NfcSymbol } from '../components/marks'
import './Cta.css'

export function Cta() {
  const { t } = useLang()
  return (
    <section id="contact" className="cta">
      <NfcSymbol size={460} color="rgba(243,241,235,0.045)" strokeWidth={1.1} className="cta__ghost" />
      <div className="cta__plaque" aria-hidden="true">
        <WoodPlaque width={560} />
      </div>

      <div className="container cta__inner">
        <SectionMark num="07" label={t.cta.mark} inverse />
        <h2 className="display cta__title">
          {t.cta.title.map((line, i) => (
            <Reveal as="span" key={line} className="cta__line" delay={i * 100}>
              {line}
            </Reveal>
          ))}
        </h2>
        <Reveal as="p" className="cta__sub" delay={200}>
          {t.cta.line}
        </Reveal>
        <Reveal className="cta__actions" delay={280}>
          <a className="btn btn--paper" href="https://t.me/fenixnfc" target="_blank" rel="noreferrer">
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
    </section>
  )
}
