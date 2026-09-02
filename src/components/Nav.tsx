import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLang } from '../locales'
import { useMagnet } from '../hooks/useMagnet'
import { Logo } from './marks'
import { LangSwitcher } from './LangSwitcher'
import './Nav.css'

export function Nav() {
  const { t } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)
  const [open, setOpen] = useState(false)
  const progressRef = useRef<HTMLSpanElement>(null)
  const magnetRef = useMagnet<HTMLAnchorElement>(0.14, 5)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Hairline reading-progress indicator under the bar.
  useEffect(() => {
    const el = progressRef.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      cancelAnimationFrame(raf)
    }
  }, [])

  // The bar inverts while it floats over an ink-coloured section.
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-dark]'))
    if (zones.length === 0) return
    let raf = 0
    const themeMeta = document.querySelector('meta[name="theme-color"]')
    const check = () => {
      raf = 0
      const bar = document.querySelector('.nav__bar')
      const y = (bar ? bar.getBoundingClientRect().height : 76) * 0.55
      const isDark = zones.some((z) => {
        const r = z.getBoundingClientRect()
        return r.top <= y && r.bottom >= y
      })
      setDark(isDark)
      // keep the mobile browser chrome in step with the surface under the bar
      themeMeta?.setAttribute('content', isDark ? '#0A0A0A' : '#FCFDFF')
    }
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    const ro = new ResizeObserver(queue)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
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
    <header className={`nav${scrolled ? ' nav--scrolled' : ''}${dark ? ' nav--dark' : ''}${open ? ' nav--open' : ''}`}>
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
          <a className="btn btn--line nav__cta" href="#contact" ref={magnetRef}>
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
        <span className="nav__progress" ref={progressRef} aria-hidden="true" />
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
