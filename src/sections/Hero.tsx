import { useEffect, useRef } from 'react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { useLang } from '../locales'
import { useTilt } from '../hooks/useTilt'
import { useMagnet } from '../hooks/useMagnet'
import { WOOD_TAB } from '../data/works'
import { MaskLine } from '../components/MaskLine'
import './Hero.css'

/** Renders a headline line, painting a trailing period in the accent color. */
function AccentLine({ text }: { text: string }) {
  if (text.endsWith('.')) {
    return (
      <>
        {text.slice(0, -1)}
        <span className="acc">.</span>
      </>
    )
  }
  return <>{text}</>
}

export function Hero() {
  const { t, lang } = useLang()
  const tiltRef = useTilt<HTMLDivElement>(1.8)
  const stageRef = useRef<HTMLDivElement>(null)
  const magnetA = useMagnet<HTMLAnchorElement>()
  const magnetB = useMagnet<HTMLAnchorElement>()

  // Slight vertical drift of the product while scrolling out of the hero.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = Math.min(window.scrollY, 900)
        stageRef.current?.style.setProperty('--drift', `${(y * 0.05).toFixed(1)}px`)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="container hero__inner">
        <div className="hero__meta micro micro--mute">
          <span>{t.hero.kicker.join(' / ')}</span>
          <span className="hero__place">{t.hero.place}</span>
        </div>

        <div className="hero__grid">
          <div className="hero__copy">
            {/* key remounts the intro animation when the language changes */}
            <h1 className="display hero__title" key={lang}>
              {t.hero.title.map((line, i) => (
                <MaskLine className="hero__line" key={i} delay={140 + i * 110}>
                  <AccentLine text={line} />
                </MaskLine>
              ))}
            </h1>
            <p className="hero__sub">{t.hero.sub}</p>
            <div className="hero__ctas">
              <a className="btn btn--solid" href="#products" ref={magnetA}>
                {t.hero.ctaProducts}
                <ArrowRight className="btn__arrow" size={15} strokeWidth={2} />
              </a>
              <a className="btn btn--line" href="#contact" ref={magnetB}>
                {t.hero.ctaContact}
                <ArrowRight className="btn__arrow" size={15} strokeWidth={2} />
              </a>
            </div>
          </div>

          <div className="hero__stage" ref={stageRef}>
            <div className="hero__tilt" ref={tiltRef}>
              <div className="hero__photowrap">
                <img
                  className="ph hero__photo"
                  src={WOOD_TAB.img}
                  width={WOOD_TAB.w}
                  height={WOOD_TAB.h}
                  alt={t.hero.alt}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="callout callout--nfc">
                <span className="micro">{t.hero.callouts.nfc}</span>
                <i aria-hidden="true" />
              </div>
              <div className="callout callout--qr">
                <i aria-hidden="true" />
                <span className="micro">{t.hero.callouts.qr}</span>
              </div>
              <div className="callout callout--eng">
                <span className="micro">{t.hero.callouts.engrave}</span>
                <i aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* pinned to the viewport bottom at load — animated on a clock, not on
            scroll: an IntersectionObserver never fires for it (its pre-reveal
            offset keeps it below the shrunken observer root). */}
        <div className="hero__foot">
          <span className="micro micro--mute hero__caption">{t.hero.caption}</span>
          <a href="#concept" className="hero__scroll" aria-label={t.common.scroll}>
            <ArrowDown size={16} strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </section>
  )
}
