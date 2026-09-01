import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../locales'
import { Logo } from './marks'
import { LangSwitcher } from './LangSwitcher'
import './Nav.css'

export function Nav() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const links = [
    { href: '#products', label: t.nav.products },
    { href: '#solutions', label: t.nav.solutions },
    { href: '#work', label: t.nav.work },
    { href: '#how', label: t.nav.how },
  ]

  return (
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${open ? ' nav--open' : ''}`}>
      <div className="nav__bar">
        <a className="brand" href="#top" aria-label="Fenix NFC" onClick={() => setOpen(false)}>
          <Logo size={20} />
          <span className="brand__word">FENIX</span>
          <span className="brand__tag">NFC</span>
        </a>

        <nav className="nav__links" aria-label={t.footer.colPages}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="nav__link micro">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__right">
          <LangSwitcher className="nav__langs" />
          <a className="btn btn--line nav__cta" href="#contact">
            {t.nav.contact}
            <ArrowRight className="btn__arrow" size={14} strokeWidth={2} />
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-label={open ? t.common.menuClose : t.common.menuOpen}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* full-screen mobile menu */}
      <div className="menu" aria-hidden={!open}>
        <nav className="menu__links" aria-label={t.footer.colPages}>
          {[...links, { href: '#contact', label: t.nav.contact }].map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="menu__link"
              style={{ transitionDelay: open ? `${140 + i * 55}ms` : '0ms' }}
              onClick={() => setOpen(false)}
              tabIndex={open ? 0 : -1}
            >
              <span className="menu__num micro">{`0${i + 1}`}</span>
              <span className="menu__label display">{l.label}</span>
            </a>
          ))}
        </nav>
        <div className="menu__foot" style={{ transitionDelay: open ? '420ms' : '0ms' }}>
          <LangSwitcher className="langs--inv" />
          <span className="micro menu__place">{t.hero.place}</span>
        </div>
      </div>
    </header>
  )
}
