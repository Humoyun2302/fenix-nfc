import { useLang } from '../locales'
import { FEATURED, ARCHIVE } from '../data/works'
import { Reveal } from '../components/Reveal'
import { MaskLine } from '../components/MaskLine'
import { SectionMark } from '../components/SectionMark'
import { Ticker } from '../components/Ticker'
import './Projects.css'

export function Projects() {
  const { t } = useLang()
  return (
    <section id="work" className="work">
      <div className="container">
        <SectionMark num="06" label={t.work.mark} />
        <h2 className="display sec-title work__title">
          <MaskLine delay={60}>{t.work.title}</MaskLine>
        </h2>
      </div>

      {/* featured — editorial scales, real photography */}
      <div className="container work__grid">
        {FEATURED.map((p, i) => {
          const it = t.work.items[p.key]
          const meta = `${it.type} · ${it.product} · ${it.year}`
          return (
            <Reveal as="figure" key={p.key} className={`pj ${p.cls}`} delay={(i % 2) * 90}>
              <div className="pj__media">
                <img
                  className="ph pj__photo"
                  src={p.img}
                  width={p.w}
                  height={p.h}
                  alt={`${it.name} — ${it.type}`}
                  loading="lazy"
                  decoding="async"
                />
                <figcaption className="pj__overlay">
                  <span className="pj__oname">{it.name}</span>
                  <span className="pj__ometa micro">
                    {t.work.meta.type} — {it.type} / {t.work.meta.product} — {it.product} / {t.work.meta.year} —{' '}
                    {it.year}
                  </span>
                </figcaption>
              </div>
              <div className="pj__info">
                <span className="micro micro--mute">{p.num}</span>
                <span className="pj__name">{it.name}</span>
                <span className="pj__meta micro micro--mute">{meta}</span>
              </div>
            </Reveal>
          )
        })}
      </div>

      {/* every client name, on one running line */}
      <Ticker items={ARCHIVE.map((w) => w.name)} variant="line" duration={70} className="work__ticker" />

      {/* complete index */}
      <div className="container arch">
        <Reveal className="arch__head">
          <span className="micro arch__title">{t.work.archive.title}</span>
          <span className="arch__rule" aria-hidden="true" />
          <span className="micro micro--mute">{t.work.archive.hint}</span>
        </Reveal>
        <Reveal className="arch__grid">
          {ARCHIVE.map((w, i) => (
            <figure className="arch__item" key={w.name + i} style={{ transitionDelay: `${Math.min(i * 35, 500)}ms` }}>
              <div className="arch__ph">
                <img
                  className="ph"
                  src={w.img}
                  width={w.w}
                  height={w.h}
                  alt={`${w.name} — NFC`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <figcaption className="arch__name micro micro--mute">{w.name}</figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
