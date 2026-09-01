import { Instagram, Mail, Phone, Send } from 'lucide-react'
import { useLang } from '../locales'
import { Logo } from './marks'
import { LangSwitcher } from './LangSwitcher'
import './Footer.css'

export function Footer() {
  const { t } = useLang()
  const pages = [
    { href: '#products', label: t.nav.products },
    { href: '#solutions', label: t.nav.solutions },
    { href: '#work', label: t.nav.work },
    { href: '#how', label: t.nav.how },
  ]

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href="#top" className="brand footer__brandlink" aria-label="Fenix NFC">
            <Logo size={22} />
            <span className="brand__word">FENIX</span>
            <span className="brand__tag brand__tag--inv">NFC</span>
          </a>
          <p className="footer__tagline">{t.footer.tagline}</p>
          <span className="micro footer__place">{t.footer.place}</span>
        </div>

        <nav className="footer__col" aria-label={t.footer.colPages}>
          <span className="micro footer__head">{t.footer.colPages}</span>
          {pages.map((p) => (
            <a key={p.href} href={p.href} className="footer__link">
              {p.label}
            </a>
          ))}
        </nav>

        <div className="footer__col">
          <span className="micro footer__head">{t.footer.colContact}</span>
          <a href="https://t.me/fenixnfc" target="_blank" rel="noreferrer" className="footer__link">
            <Send size={13} strokeWidth={1.8} /> {t.cta.tg}
          </a>
          <a href="mailto:hello@fenixnfc.uz" className="footer__link">
            <Mail size={13} strokeWidth={1.8} /> {t.cta.email}
          </a>
          <a href="tel:+998900000000" className="footer__link">
            <Phone size={13} strokeWidth={1.8} /> {t.cta.phoneLabel}
          </a>
          <a href="https://instagram.com/fenixnfc" target="_blank" rel="noreferrer" className="footer__link">
            <Instagram size={13} strokeWidth={1.8} /> Instagram
          </a>
        </div>

        <div className="footer__col">
          <span className="micro footer__head">{t.footer.colLang}</span>
          <LangSwitcher className="langs--inv footer__langs" />
        </div>
      </div>

      <div className="container footer__bottom">
        <span className="micro footer__rights">{t.footer.rights}</span>
        <span className="micro footer__stamp">FENIX / NFC / 2026</span>
      </div>
    </footer>
  )
}
